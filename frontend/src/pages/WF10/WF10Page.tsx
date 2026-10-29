import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Bell,
  Eye,
  Lightbulb,
  MessageSquare,
  Play,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  RotateCw,
  Loader2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { getPerformanceAnalyses } from '../../services/api/performanceApi';
import { getPerformanceData } from '../../services/api/socialContentsApi';
import { getMonitoringAlerts } from '../../services/api/monitoringApi';
import { getTrends } from '../../services/api/trendsApi';
import { getOpportunities } from '../../services/api/opportunitiesApi';
import { getReports } from '../../services/api/reportsApi';
import { getRisks } from '../../services/api/risksApi';
import type {
  MonitoringAlert,
  OpportunityItem,
  PerformanceAnalysis,
  PerformanceData,
  ReportItem,
  RiskItem,
  TrendItem,
} from '../../types/api';
import './WF10Page.css';

const fmt = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

const fmtNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value);

export const WF10Page: React.FC = () => {
  const navigate = useNavigate();

  const [analyses, setAnalyses] = useState<PerformanceAnalysis[]>([]);
  const [videos, setVideos] = useState<PerformanceData[]>([]);
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [
        analysesData,
        videosData,
        alertsData,
        trendsData,
        opportunitiesData,
        risksData,
        reportsData,
      ] = await Promise.all([
        getPerformanceAnalyses(signal).catch(() => []),
        getPerformanceData(signal).catch(() => []),
        getMonitoringAlerts(signal).catch(() => []),
        getTrends(signal).catch(() => []),
        getOpportunities(signal).catch(() => []),
        getRisks(signal).catch(() => []),
        getReports(signal).catch(() => []),
      ]);

      setAnalyses(analysesData);
      setVideos(videosData);
      setAlerts(alertsData);
      setTrends(trendsData);
      setOpportunities(opportunitiesData);
      setRisks(risksData);
      setReports(reportsData);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Không tải được dữ liệu bảng điều khiển tổng hợp.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchDashboardData(controller.signal);
    return () => controller.abort();
  }, []);

  const totalViews = useMemo(() => {
    if (analyses.length > 0) {
      return analyses.reduce((sum, item) => sum + (item.totalViews || 0), 0);
    }
    return videos.reduce((sum, item) => sum + (item.views || 0), 0);
  }, [analyses, videos]);

  const totalVideos = useMemo(() => {
    if (analyses.length > 0) {
      return analyses.reduce((sum, item) => sum + (item.videoCount || 0), 0);
    }
    return videos.length;
  }, [analyses, videos]);

  const totalLikes = useMemo(() => {
    if (analyses.length > 0) {
      return analyses.reduce((sum, item) => sum + (item.totalLikes || 0), 0);
    }
    return videos.reduce((sum, item) => sum + (item.likes || 0), 0);
  }, [analyses, videos]);

  const totalComments = useMemo(() => {
    if (analyses.length > 0) {
      return analyses.reduce((sum, item) => sum + (item.totalComments || 0), 0);
    }
    return videos.reduce((sum, item) => sum + (item.comments || 0), 0);
  }, [analyses, videos]);

  const latestAlerts = useMemo(() => alerts.slice(0, 4), [alerts]);

  const topVideos = useMemo(() => {
    return [...videos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  }, [videos]);

  const topTrends = useMemo(() => {
    return trends
      .filter((t) => !String(t.name || '').startsWith('TEST_'))
      .slice(0, 5);
  }, [trends]);

  const topOpportunities = useMemo(() => {
    return opportunities.slice(0, 4);
  }, [opportunities]);

  const trendingKeywords = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of videos) {
      const words = (v.title || '').toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
      for (const w of words) {
        if (w.length >= 4) counts.set(w, (counts.get(w) || 0) + 1);
      }
    }
    for (const t of trends) {
      const words = (t.name || '').toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
      for (const w of words) {
        if (w.length >= 4) counts.set(w, (counts.get(w) || 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([kw, count]) => ({ kw, count }));
  }, [videos, trends]);

  // Executive AI summary text
  const executiveSummary = useMemo(() => {
    if (reports.length > 0 && reports[0].executiveSummary) {
      return reports[0].executiveSummary;
    }
    const topComp = analyses[0]?.competitor?.name || 'các kênh được theo dõi';
    return `Hệ thống ghi nhận tổng cộng ${fmtNumber(totalVideos)} nội dung với ${fmt(totalViews)} lượt xem và ${fmt(totalLikes)} lượt thích. ${topComp} đang giữ vị trí dẫn đầu về lượng người xem. Phát hiện ${trends.length} xu hướng thị trường và ${opportunities.length} cơ hội nội dung tiềm năng cần khai thác.`;
  }, [reports, analyses, totalVideos, totalViews, totalLikes, trends.length, opportunities.length]);

  return (
    <div className="wf10-page-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <PageHeader
          title="WF10 - Bảng điều khiển tổng hợp"
          subtitle="Hiệu suất, thị trường, cơ hội và rủi ro được tổng hợp trực tiếp từ cơ sở dữ liệu."
          stepNumber={10}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => fetchDashboardData()}
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8 }}
        >
          {loading ? <Loader2 size={14} className="spin" /> : <RotateCw size={14} />}
          <span>{loading ? 'Đang tải...' : 'Làm mới tổng hợp'}</span>
        </button>
      </div>

      {loading && (
        <div role="status" className="ui-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 16 }}>
          <Loader2 size={18} className="spin text-primary" />
          <span>Đang tổng hợp dữ liệu toàn diện từ hệ thống…</span>
        </div>
      )}

      {error && (
        <div role="alert" className="ui-card" style={{ padding: 16, backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} />
            <span>Không tải được dữ liệu: {error}</span>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => fetchDashboardData()} style={{ padding: '4px 10px', fontSize: 12 }}>
            Thử lại
          </button>
        </div>
      )}

      {/* TOP ROW: 5 KPI CARDS */}
      <section className="wf10-kpi-grid">
        <article className="ui-card wf10-kpi-card">
          <span className="wf10-kpi-icon blue">
            <Play size={18} />
          </span>
          <div>
            <span>Tổng video</span>
            <strong>{loading ? '…' : fmt(totalVideos)}</strong>
          </div>
        </article>

        <article className="ui-card wf10-kpi-card">
          <span className="wf10-kpi-icon green">
            <Eye size={18} />
          </span>
          <div>
            <span>Tổng lượt xem</span>
            <strong>{loading ? '…' : fmt(totalViews)}</strong>
          </div>
        </article>

        <article className="ui-card wf10-kpi-card">
          <span className="wf10-kpi-icon red">
            <ThumbsUp size={18} />
          </span>
          <div>
            <span>Tổng lượt thích</span>
            <strong>{loading ? '…' : fmt(totalLikes)}</strong>
          </div>
        </article>

        <article className="ui-card wf10-kpi-card">
          <span className="wf10-kpi-icon purple">
            <MessageSquare size={18} />
          </span>
          <div>
            <span>Tổng bình luận</span>
            <strong>{loading ? '…' : fmt(totalComments)}</strong>
          </div>
        </article>

        <article className="ui-card wf10-kpi-card">
          <span className="wf10-kpi-icon orange">
            <Bell size={18} />
          </span>
          <div>
            <span>Tổng cảnh báo & Rủi ro</span>
            <strong>{loading ? '…' : alerts.length + risks.length}</strong>
          </div>
        </article>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="wf10-main-grid">
        {/* Panel 1: Performance Comparison by Competitor */}
        <article className="ui-card wf10-panel wf10-trend-panel">
          <div className="wf10-panel-heading">
            <div>
              <h2>
                <TrendingUp size={17} /> So sánh hiệu suất đối thủ
              </h2>
              <p>Tổng hợp lượt xem và lượt thích theo từng đối thủ trong hệ thống</p>
            </div>
            <span className="wf10-tag">Dữ liệu thực từ API</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '10px 0' }}>
            {analyses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
                {loading ? 'Đang tải dữ liệu phân tích...' : 'Chưa có bản ghi phân tích hiệu suất đối thủ (WF04).'}
              </p>
            ) : (
              analyses.map((item) => {
                const maxViews = Math.max(...analyses.map((a) => a.totalViews || 1));
                const pct = Math.round(((item.totalViews || 0) / maxViews) * 100);
                return (
                  <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
                      <span>{item.competitor?.name || `Đối thủ #${item.competitorId}`}</span>
                      <span>
                        {fmtNumber(item.totalViews)} xem ({item.videoCount} video ·{' '}
                        {typeof item.engagementRate === 'number'
                          ? `${(item.engagementRate * 100).toFixed(1)}%`
                          : `${item.engagementRate}%`}{' '}
                        tương tác)
                      </span>
                    </div>
                    <div style={{ height: 10, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                          borderRadius: 'inherit',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </article>

        {/* Panel 2: Competitor Ranking */}
        <article className="ui-card wf10-panel">
          <div className="wf10-panel-heading">
            <div>
              <h2>
                <TrendingUp size={17} /> Bảng xếp hạng đối thủ
              </h2>
              <p>Xếp hạng dựa trên dữ liệu phân tích WF04</p>
            </div>
          </div>
          <div className="wf10-ranking-list">
            {analyses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: 12 }}>Chưa có dữ liệu xếp hạng.</p>
            ) : (
              analyses.map((item, index) => (
                <div className="wf10-ranking-row" key={item.id || index}>
                  <b>{item.performanceRank || index + 1}</b>
                  <div className="wf10-rank-name">
                    <strong>{item.competitor?.name || `Đối thủ #${item.competitorId}`}</strong>
                    <span>
                      {item.videoCount} video ·{' '}
                      {typeof item.engagementRate === 'number'
                        ? `${(item.engagementRate * 100).toFixed(1)}%`
                        : `${item.engagementRate}%`}{' '}
                      tương tác
                    </span>
                  </div>
                  <strong>{fmt(item.totalViews)}</strong>
                </div>
              ))
            )}
          </div>
        </article>

        {/* Panel 3: Top Videos */}
        <article className="ui-card wf10-panel wf10-videos-panel">
          <div className="wf10-panel-heading">
            <div>
              <h2>
                <Play size={17} /> Video nổi bật hàng đầu
              </h2>
              <p>Nội dung có lượt xem cao nhất từ WF02 / WF04</p>
            </div>
          </div>
          <div className="wf10-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Tiêu đề video</th>
                  <th>Đối thủ</th>
                  <th>Lượt xem</th>
                  <th>Lượt thích</th>
                </tr>
              </thead>
              <tbody>
                {topVideos.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                      Chưa có dữ liệu video.
                    </td>
                  </tr>
                ) : (
                  topVideos.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.title}</td>
                      <td>{item.competitorName || item.competitor?.name || '—'}</td>
                      <td style={{ color: '#2563eb', fontWeight: 700 }}>{fmtNumber(item.views)}</td>
                      <td>{fmtNumber(item.likes)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        {/* Panel 4: Market Trends */}
        <article className="ui-card wf10-panel">
          <div className="wf10-panel-heading">
            <div>
              <h2>
                <Sparkles size={17} /> Xu hướng thị trường (WF06)
              </h2>
              <p>Chủ đề và từ khóa nổi bật</p>
            </div>
          </div>
          <div className="wf10-topic-list">
            {topTrends.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: 12 }}>Chưa có xu hướng được ghi nhận.</p>
            ) : (
              topTrends.map((item) => (
                <div className="wf10-topic-row" key={item.id}>
                  <span title={item.name}>{item.name}</span>
                  <div>
                    <i
                      style={{
                        width: `${Math.min(100, item.score)}%`,
                        background: '#2563eb',
                      }}
                    />
                  </div>
                  <b>{item.score}/100</b>
                </div>
              ))
            )}
          </div>
          <div className="wf10-keywords">
            {trendingKeywords.map((item, i) => (
              <span key={i}>
                #{item.kw} <b>x{item.count}</b>
              </span>
            ))}
          </div>
        </article>

        {/* Panel 5: Content Opportunities */}
        <article className="ui-card wf10-panel">
          <div className="wf10-panel-heading">
            <div>
              <h2>
                <Lightbulb size={17} /> Cơ hội nội dung (WF07)
              </h2>
              <p>Khoảng trống thị trường và ý tưởng đề xuất</p>
            </div>
          </div>
          <div className="wf10-opportunity-list">
            {topOpportunities.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: 12 }}>
                Chưa có dữ liệu cơ hội trong database (WF07).
              </p>
            ) : (
              topOpportunities.map((item) => (
                <div key={item.id} className="wf10-opportunity-row">
                  <span title={item.title}>{item.title}</span>
                  <div className="wf10-score-track">
                    <i style={{ width: `${Math.min(100, item.score)}%` }} />
                  </div>
                  <b>{item.score}</b>
                </div>
              ))
            )}
          </div>
        </article>

        {/* Panel 6: Strategic Risks */}
        <article className="ui-card wf10-panel">
          <div className="wf10-panel-heading">
            <div>
              <h2>
                <ShieldAlert size={17} /> Rủi ro chiến lược (WF08)
              </h2>
              <p>Rủi ro cạnh tranh cần theo dõi</p>
            </div>
          </div>
          {risks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: 12 }}>
              Chưa có bản ghi rủi ro nào được lưu (WF08).
            </p>
          ) : (
            risks.slice(0, 4).map((item) => (
              <div className="wf10-forecast-row" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <span>Mức độ: {item.severity}</span>
                </div>
                <b style={{ color: item.severity.toUpperCase() === 'HIGH' ? '#dc2626' : '#ea580c' }}>
                  {item.score}/100
                </b>
              </div>
            ))
          )}
        </article>

        {/* Panel 7: Monitoring Alerts */}
        <article className="ui-card wf10-panel">
          <div className="wf10-panel-heading">
            <div>
              <h2>
                <Bell size={17} /> Cảnh báo biến động (WF05)
              </h2>
              <p>Phát hiện tăng trưởng đột biến từ đối thủ</p>
            </div>
          </div>
          {latestAlerts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: 12 }}>Chưa có cảnh báo nào gần đây.</p>
          ) : (
            latestAlerts.map((alert) => (
              <div className="wf10-alert-row" key={alert.id}>
                <span className="wf10-alert-dot" />
                <div>
                  <strong>{alert.competitor?.name || `Đối thủ #${alert.competitorId}`}</strong>
                  <span>{alert.message}</span>
                </div>
                <time>{new Date(alert.createdAt).toLocaleDateString('vi-VN')}</time>
              </div>
            ))
          )}
        </article>

        {/* Panel 8: AI Insight & Actions */}
        <article className="ui-card wf10-panel wf10-insight-panel">
          <div className="wf10-panel-heading">
            <div>
              <h2>
                <Sparkles size={17} /> Nhận định tổng quan điều hành (AI Insight)
              </h2>
              <p>Được tổng hợp từ các phân tích thị trường & báo cáo mới nhất</p>
            </div>
          </div>
          <p className="wf10-ai-summary">{executiveSummary}</p>
          <ul>
            <li>
              <strong>Xu hướng:</strong> Theo dõi chặt chẽ {trends.length} xu hướng đang tăng trưởng để định hướng nội dung.
            </li>
            <li>
              <strong>Hiệu suất:</strong> Tối ưu tỷ lệ tương tác dựa trên phân tích chỉ số đối thủ hàng đầu.
            </li>
            <li>
              <strong>Ứng phó:</strong> Rà soát các cảnh báo và rủi ro để đưa ra điều chỉnh chiến lược kịp thời.
            </li>
          </ul>
          <div className="wf10-next-actions">
            <b>Hành động nhanh:</b>
            <button type="button" onClick={() => navigate('/wf06')}>
              Xem xu hướng thị trường <ArrowUpRight size={14} />
            </button>
            <button type="button" onClick={() => navigate('/wf07')}>
              Xem cơ hội nội dung <ArrowUpRight size={14} />
            </button>
            <button type="button" onClick={() => navigate('/wf08')}>
              Xem phân tích rủi ro <ArrowUpRight size={14} />
            </button>
            <button type="button" onClick={() => navigate('/wf09')}>
              Mở báo cáo & chiến lược <ArrowUpRight size={14} />
            </button>
            <button type="button" onClick={() => navigate('/wf05')}>
              Mở cảnh báo đối thủ <ArrowUpRight size={14} />
            </button>
          </div>
        </article>
      </section>
    </div>
  );
};
