import React, { useMemo, useRef, useState } from 'react';
import {
  BarChart2,
  CalendarClock,
  Eye,
  Loader2,
  MessageSquare,
  PlayCircle,
  RotateCw,
  ThumbsUp,
  Users,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useApiResource } from '../../hooks/api/useApiResource';
import { getPerformanceData } from '../../services/api/socialContentsApi';
import { getPerformanceAnalyses } from '../../services/api/performanceApi';
import type { PerformanceAnalysis, PerformanceData } from '../../types/api';
import { platformLabel } from '../../utils/platformLabel';
import { requestWf04Run } from '../../services/api/workflowRunsApi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import { useNavigate } from 'react-router-dom';
import { createInFlightLock, executeWf04Run, formatVietnameseDate, getAnalysisTimestamp } from './wf04RunBehavior.mjs';
import './WF04Page.css';

const numberValue = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : 0);
const formatCount = (value: number) => new Intl.NumberFormat('vi-VN').format(value);
const EMPTY_PERFORMANCE_DATA: PerformanceData[] = [];
const EMPTY_ANALYSES: PerformanceAnalysis[] = [];
const formatDate = (value: string | null | undefined) => {
  return formatVietnameseDate(value);
};
const formatRateValue = (value: number) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 4 }).format(value);

export const WF04Page: React.FC = () => {
  const { user, loading: authLoading, refresh: refreshAuth } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const performanceResource = useApiResource(getPerformanceData, []);
  const analysesResource = useApiResource(getPerformanceAnalyses, []);
  const [period, setPeriod] = useState('all');
  const [competitorFilter, setCompetitorFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [now] = useState(() => Date.now());
  const [runRequestState, setRunRequestState] = useState<'idle' | 'sending' | 'accepted' | 'no_work' | 'error'>('idle');
  const [runRequestMessage, setRunRequestMessage] = useState('');
  const runRequestLock = useRef(createInFlightLock());

  const performanceData = performanceResource.data ?? EMPTY_PERFORMANCE_DATA;
  const analyses = analysesResource.data ?? EMPTY_ANALYSES;
  const competitors = useMemo(() => {
    const names = new Map<number, string>();
    performanceData.forEach((item) => names.set(item.competitorId, item.competitorName || item.competitor?.name || `Đối thủ #${item.competitorId}`));
    analyses.forEach((item) => names.set(item.competitorId, item.competitor?.name || names.get(item.competitorId) || `Đối thủ #${item.competitorId}`));
    return [...names.entries()].sort((a, b) => a[1].localeCompare(b[1], 'vi'));
  }, [performanceData, analyses]);
  const platforms = useMemo(() => [...new Set([...performanceData.map((item) => item.platform), ...analyses.map((item) => item.platform)].filter(Boolean))].sort(), [performanceData, analyses]);

  const filteredMetrics = useMemo(() => performanceData.filter((item) => {
    if (competitorFilter !== 'all' && item.competitorId !== Number(competitorFilter)) return false;
    if (platformFilter !== 'all' && item.platform.toLowerCase() !== platformFilter.toLowerCase()) return false;
    if (period !== 'all') {
      const published = new Date(item.publishedAt).getTime();
      const days = Number(period);
      if (!Number.isFinite(published) || published < now - days * 24 * 60 * 60 * 1000) return false;
    }
    return true;
  }), [performanceData, competitorFilter, platformFilter, period, now]);
  const filteredAnalyses = useMemo(() => analyses.filter((item) =>
    (competitorFilter === 'all' || item.competitorId === Number(competitorFilter)) &&
    (platformFilter === 'all' || item.platform.toLowerCase() === platformFilter.toLowerCase())
  ), [analyses, competitorFilter, platformFilter]);
  const topVideos = useMemo(() => [...filteredMetrics].sort((a, b) => numberValue(b.views) - numberValue(a.views)), [filteredMetrics]);
  const snapshotRows = filteredMetrics.filter((item) => Boolean(item.capturedAt));
  const lastSnapshotAt = snapshotRows.reduce<string | null>((latest, item) => {
    if (!item.capturedAt) return latest;
    return !latest || new Date(item.capturedAt).getTime() > new Date(latest).getTime() ? item.capturedAt : latest;
  }, null);
  const totals = snapshotRows.reduce((result, item) => ({
    views: result.views + numberValue(item.views),
    likes: result.likes + numberValue(item.likes),
    comments: result.comments + numberValue(item.comments),
  }), { views: 0, likes: 0, comments: 0 });

  const latestMetricError = performanceResource.error;
  const latestAnalysisError = analysesResource.error;
  const hasInitialLoading = (performanceResource.loading && performanceResource.data === null) || (analysesResource.loading && analysesResource.data === null);

  const handleRequestAnalysis = async () => {
    if (authLoading || !runRequestLock.current.acquire()) return;
    if (!user) {
      runRequestLock.current.release();
      navigate('/login', { state: { returnTo: '/wf04' } });
      return;
    }
    if (user.role !== 'operator') {
      runRequestLock.current.release();
      showToast('Chỉ tài khoản người vận hành mới được gửi yêu cầu phân tích WF04.', 'warning');
      return;
    }

    setRunRequestState('sending');
    setRunRequestMessage('Đang gửi yêu cầu tới Backend…');
    try {
      const result = await executeWf04Run(requestWf04Run);
      setRunRequestState(result.status);
      setRunRequestMessage(result.message);
      if (result.status === 'no_work') {
        showToast(result.message, 'info');
      } else if (result.status === 'accepted') {
        showToast(result.message, 'success');
      } else if (result.httpStatus === 401) {
        await refreshAuth().catch(() => null);
        showToast(result.message, 'warning');
        navigate('/login', { state: { returnTo: '/wf04' } });
      } else {
        showToast(result.message, result.httpStatus === 403 ? 'warning' : 'error');
      }
    } finally {
      runRequestLock.current.release();
    }
  };

  return (
    <div className="wf04-page-container fade-in">
      <PageHeader
        title="WF04 - Phân tích hiệu suất đối thủ"
        subtitle="Chỉ số là lần ghi nhận mới nhất theo từng nội dung; Phân tích hiệu suất là bản ghi tổng hợp đã lưu trong máy chủ."
        stepNumber={4}
      />

      <div className="wf04-top-filter-bar ui-card">
        <div className="filter-item-block">
          <label className="filter-block-label" htmlFor="wf04-period">Ngày đăng</label>
          <select id="wf04-period" value={period} onChange={(event) => setPeriod(event.target.value)} className="filter-select-input">
            <option value="all">Tất cả thời gian</option>
            <option value="7">7 ngày qua</option>
            <option value="30">30 ngày qua</option>
            <option value="90">90 ngày qua</option>
          </select>
        </div>
        <div className="filter-item-block">
          <label className="filter-block-label" htmlFor="wf04-competitor">Đối thủ</label>
          <select id="wf04-competitor" value={competitorFilter} onChange={(event) => setCompetitorFilter(event.target.value)} className="filter-select-input">
            <option value="all">Tất cả</option>
            {competitors.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        </div>
        <div className="filter-item-block">
          <label className="filter-block-label" htmlFor="wf04-platform">Nền tảng</label>
          <select id="wf04-platform" value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value)} className="filter-select-input">
            <option value="all">Tất cả</option>
            {platforms.map((platform) => <option key={platform} value={platform}>{platformLabel(platform)}</option>)}
          </select>
        </div>
        <button type="button" className="btn btn-primary btn-refresh-metrics" onClick={() => { performanceResource.refresh(); analysesResource.refresh(); }} disabled={performanceResource.loading || analysesResource.loading}>
          <RotateCw size={14} />
          <span>{performanceResource.loading || analysesResource.loading ? 'Đang tải…' : 'Làm mới dữ liệu'}</span>
        </button>
        <button type="button" className="btn btn-primary wf04-run-button" onClick={handleRequestAnalysis} disabled={authLoading || runRequestState === 'sending' || user?.role === 'viewer'}>
          {runRequestState === 'sending' ? <Loader2 size={15} className="spin-icon" /> : <PlayCircle size={15} />}
          <span>{runRequestState === 'sending' ? 'Đang gửi yêu cầu…' : 'Bắt đầu phân tích hiệu suất'}</span>
        </button>
      </div>

      {runRequestState !== 'idle' && <div className={`ui-card wf04-run-state ${runRequestState}`} role="status" aria-live="polite">{runRequestMessage}</div>}
      {user?.role === 'viewer' && <div className="wf04-run-permission" role="note">Chỉ tài khoản người vận hành mới được gửi yêu cầu chạy WF04.</div>}

      {hasInitialLoading && <div className="ui-card wf04-state" role="status">Đang tải dữ liệu hiệu suất từ máy chủ…</div>}

      {latestMetricError && (
        <div className="ui-card wf04-error" role="alert">
          <div><strong>Không tải được lần ghi nhận chỉ số.</strong><p>{latestMetricError}</p></div>
          <button type="button" className="btn btn-secondary" onClick={performanceResource.refresh}>Thử tải lại chỉ số</button>
        </div>
      )}
      {latestAnalysisError && (
        <div className="ui-card wf04-error" role="alert">
          <div><strong>Không tải được Phân tích hiệu suất đã lưu.</strong><p>{latestAnalysisError}</p></div>
          <button type="button" className="btn btn-secondary" onClick={analysesResource.refresh}>Thử tải lại phân tích</button>
        </div>
      )}

      <div className="wf04-kpi-grid">
        <Kpi icon={<Users size={22} />} color="orange" label="Nội dung trong bộ lọc" value={formatCount(filteredMetrics.length)} detail="nội dung mạng xã hội từ máy chủ" />
        <Kpi icon={<Eye size={22} />} color="blue" label="Lượt xem" value={formatCount(totals.views)} detail="Tổng lần ghi nhận mới nhất / nội dung" />
        <Kpi icon={<ThumbsUp size={22} />} color="green" label="Lượt thích" value={formatCount(totals.likes)} detail="Tổng lần ghi nhận mới nhất / nội dung" />
        <Kpi icon={<MessageSquare size={22} />} color="purple" label="Bình luận" value={formatCount(totals.comments)} detail="Tổng lần ghi nhận mới nhất / nội dung" />
      </div>

      <div className="wf04-data-note" role="note">
        <CalendarClock size={15} />
        <span>{snapshotRows.length} / {filteredMetrics.length} nội dung có lần ghi nhận; lần ghi nhận mới nhất: {formatDate(lastSnapshotAt)}. Máy chủ trả về lần ghi nhận mới nhất của mỗi nội dung mạng xã hội.</span>
      </div>

      <div className="wf04-middle-grid">
        <div className="ui-card wf04-compare-card">
          <div className="analytics-card-header">
            <div className="card-section-title"><BarChart2 size={16} className="text-primary" /><span>Phân tích hiệu suất đã lưu</span></div>
            <span className="wf04-source-label">{filteredAnalyses.length} bản ghi</span>
          </div>
          {analysesResource.loading && analysesResource.data === null ? <div className="wf04-state">Đang tải phân tích…</div> : analysesResource.error ? <div className="wf04-state">Không có dữ liệu phân tích để hiển thị.</div> : filteredAnalyses.length === 0 ? <div className="wf04-state">Chưa có Phân tích hiệu suất phù hợp với bộ lọc.</div> : (
            <div className="wf04-analysis-list">
              {filteredAnalyses.map((analysis) => <AnalysisSummary key={analysis.id} analysis={analysis} />)}
            </div>
          )}
        </div>

        <div className="ui-card wf04-trend-card">
          <div className="analytics-card-header">
            <div className="card-section-title"><CalendarClock size={16} className="text-primary" /><span>Lần ghi nhận theo đối thủ</span></div>
          </div>
          {performanceResource.loading && performanceResource.data === null ? <div className="wf04-state">Đang tải lần ghi nhận…</div> : performanceResource.error ? <div className="wf04-state">Chỉ số độc lập chưa tải được.</div> : snapshotRows.length === 0 ? <div className="wf04-state">Chưa có lần ghi nhận chỉ số trong bộ lọc.</div> : (
            <div className="wf04-lần ghi nhận-list">
              {groupSnapshots(snapshotRows).map((row) => (
                <div className="wf04-lần ghi nhận-row" key={`${row.competitorId}-${row.platform}`}>
                  <div><strong>{row.name}</strong><span>{platformLabel(row.platform)} · {row.count} nội dung</span></div>
                  <time>{formatDate(row.latestCapturedAt)}</time>
                </div>
              ))}
            </div>
          )}
          <p className="wf04-footnote">API hiện chỉ trả lần ghi nhận mới nhất, không cung cấp chuỗi lịch sử để tính xu hướng tăng trưởng.</p>
        </div>

        <div className="ui-card wf04-insight-card">
          <div className="card-section-title"><BarChart2 size={16} className="text-primary" /><span>Phạm vi phân tích</span></div>
          {analysesResource.loading && analysesResource.data === null ? <div className="wf04-state">Đang tải…</div> : analysesResource.error ? <div className="wf04-state">Không tải được bản ghi phân tích.</div> : filteredAnalyses.length === 0 ? <div className="wf04-state">máy chủ chưa có bản ghi phân tích cho bộ lọc này.</div> : (
            <div className="wf04-analysis-list compact">
              {filteredAnalyses.map((analysis) => <AnalysisRates key={analysis.id} analysis={analysis} />)}
            </div>
          )}
          <p className="wf04-footnote">Các tỷ lệ và thứ hạng bên trên được đọc nguyên trạng từ phân tích hiệu suất; trang không tạo nhận xét hoặc tính toán dự đoán.</p>
        </div>
      </div>

      <div className="ui-card wf04-top-videos-card">
        <div className="card-section-title"><Eye size={18} className="text-primary" /><span>Nội dung có lượt xem cao nhất</span></div>
        {performanceResource.loading && performanceResource.data === null ? <div className="wf04-state">Đang tải nội dung và chỉ số…</div> : performanceResource.error ? <div className="wf04-state">Danh sách chỉ số không khả dụng. Hãy thử tải lại ở phía trên.</div> : filteredMetrics.length === 0 ? <div className="wf04-state">Không có nội dung trong bộ lọc hiện tại.</div> : (
          <div className="table-responsive-wrap">
            <table className="top-videos-table">
              <thead><tr><th>#</th><th>Mã video</th><th>Tiêu đề</th><th>Đối thủ</th><th>Nền tảng</th><th>Ngày đăng</th><th>Lượt xem</th><th>Lượt thích</th><th>Bình luận</th><th>Lượt chia sẻ</th><th>Lần ghi nhận lúc</th><th>Thao tác</th></tr></thead>
              <tbody>{topVideos.map((item, index) => <PerformanceRow key={item.id} item={item} rank={index + 1} />)}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const Kpi: React.FC<{ icon: React.ReactNode; color: string; label: string; value: string; detail: string }> = ({ icon, color, label, value, detail }) => (
  <div className="ui-card kpi-card-clean"><div className={`kpi-icon-wrap ${color}`}>{icon}</div><div className="kpi-details"><span className="kpi-label">{label}</span><span className="kpi-number">{value}</span><span className="kpi-subtext neutral">{detail}</span></div></div>
);

const AnalysisSummary: React.FC<{ analysis: PerformanceAnalysis }> = ({ analysis }) => {
  const timestamp = getAnalysisTimestamp(analysis);
  return (
    <div className="wf04-analysis-item">
      <div className="wf04-analysis-title"><strong>#{analysis.performanceRank} · {analysis.competitor?.name || `Đối thủ #${analysis.competitorId}`}</strong><span>{analysis.platform}</span></div>
      <div className="wf04-analysis-metrics"><span>{formatCount(numberValue(analysis.videoCount))} video</span><span>{formatCount(numberValue(analysis.totalViews))} lượt xem</span><span>{formatCount(numberValue(analysis.totalLikes))} lượt thích</span><span>{formatCount(numberValue(analysis.totalComments))} bình luận</span></div>
      <small>{timestamp.label}: {formatDate(timestamp.value)}</small>
    </div>
  );
};

const AnalysisRates: React.FC<{ analysis: PerformanceAnalysis }> = ({ analysis }) => (
  <div className="wf04-analysis-item compact">
    <div className="wf04-analysis-title"><strong>{analysis.competitor?.name || `Đối thủ #${analysis.competitorId}`}</strong><span>Thứ hạng #{analysis.performanceRank}</span></div>
    <div className="wf04-rate-grid"><span>Tỷ lệ tương tác <b>{formatRateValue(numberValue(analysis.engagementRate))}</b></span><span>Tỷ lệ thích trung bình <b>{formatRateValue(numberValue(analysis.averageLikeRate))}</b></span><span>Tỷ lệ bình luận trung bình <b>{formatRateValue(numberValue(analysis.averageCommentRate))}</b></span></div>
  </div>
);

const PerformanceRow: React.FC<{ item: PerformanceData; rank: number }> = ({ item, rank }) => {
  let videoId = item.contentId;
  try {
    const parsedUrl = new URL(item.url);
    videoId = parsedUrl.searchParams.get('v') || item.contentId;
  } catch { /* Keep the backend content ID if the URL is absent or invalid. */ }
  const shares = item.shares === null || item.shares === undefined ? '—' : formatCount(numberValue(item.shares));
  return (
    <tr>
      <td className="font-semibold text-muted-cell">{rank}</td>
      <td className="text-muted-cell">{videoId}</td>
      <td><span className="top-video-title">{item.title || 'Chưa có tiêu đề'}</span></td>
      <td><span className="comp-mini-name">{item.competitorName || item.competitor?.name || `Đối thủ #${item.competitorId}`}</span></td>
      <td className="text-muted-cell">{platformLabel(item.platform)}</td>
      <td className="text-muted-cell">{formatDate(item.publishedAt)}</td>
      <td className="font-bold">{formatCount(numberValue(item.views))}</td>
      <td className="font-semibold">{formatCount(numberValue(item.likes))}</td>
      <td className="text-muted-cell">{formatCount(numberValue(item.comments))}</td>
      <td className="text-muted-cell">{shares}</td>
      <td className="text-muted-cell">{formatDate(item.capturedAt)}</td>
      <td><a className="action-icon-btn view" href={item.url} target="_blank" rel="noreferrer" aria-label={`Mở ${item.title || videoId} trên nền tảng`}><ExternalLink size={14} /></a></td>
    </tr>
  );
};

function groupSnapshots(items: PerformanceData[]) {
  const groups = new Map<string, { competitorId: number; name: string; platform: string; count: number; latestCapturedAt: string }>();
  items.forEach((item) => {
    if (!item.capturedAt) return;
    const key = `${item.competitorId}-${item.platform}`;
    const previous = groups.get(key);
    if (!previous) {
      groups.set(key, { competitorId: item.competitorId, name: item.competitorName || item.competitor?.name || `Đối thủ #${item.competitorId}`, platform: item.platform, count: 1, latestCapturedAt: item.capturedAt });
    } else {
      previous.count += 1;
      if (new Date(item.capturedAt).getTime() > new Date(previous.latestCapturedAt).getTime()) previous.latestCapturedAt = item.capturedAt;
    }
  });
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}
