import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Video, Search, ExternalLink, ChevronLeft, ChevronRight, Lightbulb,
  Folder, FileText, Smile, Target, Users, Loader2, RotateCcw, Sparkles, PlayCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { getAiAnalyses } from '../../services/api/aiAnalysesApi';
import { getSocialContents } from '../../services/api/socialContentsApi';
import { getCompetitors } from '../../services/api/competitorsApi';
import { useApiResource } from '../../hooks/api/useApiResource';
import type { AiAnalysis, SocialContent } from '../../types/api';
import { platformLabel } from '../../utils/platformLabel';
import { requestWf03Run } from '../../services/api/workflowRunsApi';
import { ApiError } from '../../services/api/client';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import { useNavigate } from 'react-router-dom';
import './WF03Page.css';

type AnalysisTab = 'result' | 'keywords' | 'audience' | 'summary';
const PAGE_SIZE = 8;
const EMPTY_ANALYSES: AiAnalysis[] = [];
const displayValue = (value: unknown) => typeof value === 'string' && value.trim() ? value : '—';
const formatDate = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};
const isHttpUrl = (value: unknown): value is string => {
  if (typeof value !== 'string' || !value.trim()) return false;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); }
  catch { return false; }
};
const normalizeKeywords = (value: unknown): string[] => {
  let parsed = value;
  if (typeof parsed === 'string') {
    const raw = parsed;
    try { parsed = JSON.parse(raw) as unknown; }
    catch { return raw.trim() ? [raw.trim()] : []; }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).map((item) => item.trim());
};

export const WF03Page: React.FC = () => {
  const { user, loading: authLoading, refresh: refreshAuth } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const analysesResource = useApiResource(getAiAnalyses, []);
  const contentsResource = useApiResource(getSocialContents, []);
  const competitorsResource = useApiResource((signal) => getCompetitors(undefined, signal), []);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<AnalysisTab>('result');
  const [searchQuery, setSearchQuery] = useState('');
  const [competitorFilter, setCompetitorFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [analysisFilter, setAnalysisFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [runRequestState, setRunRequestState] = useState<'idle' | 'sending' | 'accepted' | 'no_work' | 'error'>('idle');
  const runRequestLock = useRef(false);

  const analyses = analysesResource.data ?? EMPTY_ANALYSES;
  const competitorNames = useMemo(() => new Map((competitorsResource.data ?? []).map((item) => [item.id, item.name])), [competitorsResource.data]);
  const analysesByContentId = useMemo(() => new Map(analyses.map((analysis) => [analysis.contentId, analysis])), [analyses]);
  const contentRecords = useMemo(() => {
    if (contentsResource.data !== null) return contentsResource.data;
    const fromAnalyses = analyses.flatMap((analysis) => analysis.socialContent ? [analysis.socialContent] : []);
    const unique = new Map<number, SocialContent>();
    fromAnalyses.forEach((content) => unique.set(content.id, content));
    return [...unique.values()];
  }, [contentsResource.data, analyses]);

  const getCompetitorName = useCallback((content: SocialContent) => competitorNames.get(content.competitorId) ?? content.competitor?.name ?? `Đối thủ #${content.competitorId}`, [competitorNames]);
  const filteredContents = useMemo(() => contentRecords.filter((content) => {
    const title = typeof content.title === 'string' ? content.title : '';
    const competitorName = getCompetitorName(content);
    const query = searchQuery.trim().toLocaleLowerCase();
    const analysis = analysesByContentId.get(content.id);
    const matchesSearch = !query || title.toLocaleLowerCase().includes(query) || competitorName.toLocaleLowerCase().includes(query) || String(content.contentId ?? '').toLocaleLowerCase().includes(query);
    const matchesCompetitor = competitorFilter === 'all' || String(content.competitorId) === competitorFilter;
    const matchesPlatform = platformFilter === 'all' || content.platform?.toLowerCase() === platformFilter;
    const matchesAnalysis = analysesResource.error || analysisFilter === 'all' || (analysisFilter === 'analyzed' ? Boolean(analysis) : !analysis);
    return matchesSearch && matchesCompetitor && matchesPlatform && matchesAnalysis;
  }), [contentRecords, searchQuery, competitorFilter, platformFilter, analysisFilter, analysesByContentId, analysesResource.error, getCompetitorName]);

  const pageCount = Math.max(1, Math.ceil(filteredContents.length / PAGE_SIZE));
  const pageContents = filteredContents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const selectedContent = filteredContents.find((content) => content.id === selectedContentId) ?? filteredContents[0] ?? null;
  const selectedAnalysis = selectedContent ? analysesByContentId.get(selectedContent.id) ?? null : null;
  const topicCount = new Set(analyses.map((analysis) => typeof analysis.topic === 'string' ? analysis.topic.trim() : '').filter(Boolean)).size;
  const latestAnalysis = [...analyses].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
  const analyzedContentCount = new Set(analyses.map((analysis) => analysis.contentId)).size;

  const refreshAll = () => { analysesResource.refresh(); contentsResource.refresh(); competitorsResource.refresh(); };
  const renderCount = (loading: boolean, error: string | null, value: number) => error ? '—' : loading ? '…' : new Intl.NumberFormat('vi-VN').format(value);

  const handleRequestAnalysis = async () => {
    if (runRequestLock.current || authLoading) return;
    if (!user) {
      navigate('/login', { state: { returnTo: '/wf03' } });
      return;
    }
    if (user.role !== 'operator') {
      showToast('Chỉ tài khoản người vận hành mới được gửi yêu cầu phân tích WF03.', 'warning');
      return;
    }
    runRequestLock.current = true;
    setRunRequestState('sending');
    try {
      const result = await requestWf03Run();
      if (result.status === 'no_work') {
        setRunRequestState('no_work');
        showToast('Không có nội dung mới cần phân tích AI.', 'info');
      } else {
        setRunRequestState('accepted');
        showToast('Đã tiếp nhận yêu cầu phân tích. Chưa xác nhận kết quả đã hoàn tất.', 'success');
      }
    } catch (error) {
      setRunRequestState('error');
      if (error instanceof ApiError && error.status === 401) {
        await refreshAuth().catch(() => null);
        showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'warning');
        navigate('/login', { state: { returnTo: '/wf03' } });
      } else {
        showToast(error instanceof Error ? error.message : 'Không thể gửi yêu cầu phân tích WF03.', 'error');
      }
    } finally {
      runRequestLock.current = false;
    }
  };

  const changeFilter = (setValue: (value: string) => void, value: string) => { setValue(value); setCurrentPage(1); };
  const keywords = normalizeKeywords(selectedAnalysis?.keywords);

  return (
    <div className="wf03-page-container fade-in">
      <PageHeader title="WF03 - Phân tích AI nội dung" subtitle="Kết quả Phân tích AI đã lưu trong máy chủ; yêu cầu phân tích chỉ gửi nội dung chưa có kết quả." stepNumber={3} />

      <section className="ui-card wf03-run-card" aria-label="Yêu cầu phân tích nội dung mới">
        <div className="wf03-run-copy">
          <h2>Phân tích nội dung chưa được phân tích</h2>
          <p>WF03 tự lấy nội dung chưa có kết quả từ Backend. Phản hồi tiếp nhận chưa xác nhận AI đã hoàn tất hoặc lưu kết quả.</p>
          {runRequestState !== 'idle' && <span className={`wf03-run-state ${runRequestState}`} role="status" aria-live="polite">
            {runRequestState === 'sending' ? 'Đang gửi yêu cầu…' : runRequestState === 'accepted' ? 'Đã tiếp nhận yêu cầu phân tích; chưa xác nhận kết quả.' : runRequestState === 'no_work' ? 'Không có nội dung mới cần phân tích AI.' : 'Không gửi được yêu cầu.'}
          </span>}
          {user?.role === 'viewer' && <span className="wf03-run-state error" role="note">Chỉ tài khoản người vận hành mới được gửi yêu cầu.</span>}
        </div>
        <button type="button" className="btn btn-primary wf03-run-button" onClick={handleRequestAnalysis} disabled={authLoading || runRequestState === 'sending' || user?.role === 'viewer'}>
          {runRequestState === 'sending' ? <Loader2 size={16} className="spin-icon" /> : <PlayCircle size={16} />}
          {runRequestState === 'sending' ? 'Đang gửi yêu cầu…' : 'Phân tích nội dung chưa được phân tích'}
        </button>
      </section>

      <div className="wf03-kpi-grid">
        <div className="ui-card kpi-card-clean"><div className="kpi-icon-wrap blue"><Video size={22} /></div><div className="kpi-details"><span className="kpi-label">Tổng nội dung</span><span className="kpi-number">{renderCount(contentsResource.loading, contentsResource.error, contentRecords.length)}</span><span className="kpi-subtext neutral">Nội dung mạng xã hội từ máy chủ</span></div></div>
        <div className="ui-card kpi-card-clean"><div className="kpi-icon-wrap green"><Sparkles size={22} /></div><div className="kpi-details"><span className="kpi-label">Kết quả AI đã lưu</span><span className="kpi-number">{renderCount(analysesResource.loading, analysesResource.error, analyses.length)}</span><span className="kpi-subtext neutral">Bản ghi phân tích AI</span></div></div>
        <div className="ui-card kpi-card-clean"><div className="kpi-icon-wrap red"><Video size={22} /></div><div className="kpi-details"><span className="kpi-label">Chưa có kết quả</span><span className="kpi-number">{contentsResource.error || analysesResource.error ? '—' : contentsResource.loading || analysesResource.loading ? '…' : Math.max(0, contentRecords.length - analyzedContentCount)}</span><span className="kpi-subtext neutral">Chưa có bản ghi phân tích AI liên kết</span></div></div>
        <div className="ui-card kpi-card-clean"><div className="kpi-icon-wrap orange"><Folder size={22} /></div><div className="kpi-details"><span className="kpi-label">Chủ đề đã phân tích</span><span className="kpi-number">{renderCount(analysesResource.loading, analysesResource.error, topicCount)}</span><span className="kpi-subtext neutral">Cập nhật gần nhất: {latestAnalysis ? formatDate(latestAnalysis.createdAt) : '—'}</span></div></div>
      </div>

      <div className="wf03-columns-grid">
        <div className="ui-card wf03-list-card">
          <div className="list-card-header"><div className="card-section-title"><Video size={18} className="text-primary" /><span>Nội dung và trạng thái Phân tích AI</span></div></div>
          <div className="list-controls-bar">
            <div className="search-wrap"><Search size={14} className="search-icon" /><input type="search" placeholder="Tìm tiêu đề, đối thủ hoặc video ID…" value={searchQuery} onChange={(event) => changeFilter(setSearchQuery, event.target.value)} className="list-search-input" /></div>
            <select aria-label="Lọc đối thủ" value={competitorFilter} onChange={(event) => changeFilter(setCompetitorFilter, event.target.value)} className="list-select"><option value="all">Đối thủ: Tất cả</option>{(competitorsResource.data ?? []).map((competitor) => <option value={competitor.id} key={competitor.id}>{competitor.name}</option>)}</select>
            <select aria-label="Lọc nền tảng" value={platformFilter} onChange={(event) => changeFilter(setPlatformFilter, event.target.value)} className="list-select"><option value="all">Nền tảng: Tất cả</option>{[...new Set(contentRecords.map((content) => content.platform).filter(Boolean))].map((platform) => <option value={platform.toLowerCase()} key={platform}>{platformLabel(platform)}</option>)}</select>
            <select aria-label="Lọc trạng thái phân tích" value={analysisFilter} disabled={Boolean(analysesResource.error)} onChange={(event) => changeFilter(setAnalysisFilter, event.target.value)} className="list-select"><option value="all">Phân tích AI: Tất cả</option><option value="analyzed">Đã có kết quả</option><option value="missing">Chưa có kết quả</option></select>
          </div>

          {contentsResource.loading && contentsResource.data === null && analysesResource.data === null && <div className="wf03-state" role="status"><Loader2 size={18} className="spin-icon" /> Đang tải nội dung…</div>}
          {contentsResource.error && <div className="wf03-error" role="alert"><span>Không tải được danh sách nội dung: {contentsResource.error}</span><button className="btn btn-secondary" type="button" onClick={contentsResource.refresh}>Thử lại</button></div>}
          {analysesResource.error && <div className="wf03-error compact" role="alert"><span>Không tải được kết quả AI: {analysesResource.error}</span><button className="btn btn-secondary" type="button" onClick={analysesResource.refresh}>Thử lại</button></div>}
          {competitorsResource.error && <div className="wf03-error compact" role="alert"><span>Không tải được tên đối thủ; nội dung vẫn hiển thị theo ID.</span><button className="btn btn-secondary" type="button" onClick={competitorsResource.refresh}>Thử lại</button></div>}

          {(contentRecords.length > 0 || contentsResource.loading || analysesResource.loading) && <>
            <div className="table-responsive-wrap"><table className="ai-video-table"><thead><tr><th>#</th><th>Mã video</th><th>Tiêu đề</th><th>Đối thủ</th><th>Nền tảng</th><th>Ngày đăng</th><th>Phân tích AI</th></tr></thead>
              <tbody>{pageContents.map((content, index) => {
                const analysis = analysesByContentId.get(content.id);
                const current = selectedContent?.id === content.id;
                const title = displayValue(content.title);
                return <tr key={content.id} className={`video-row ${current ? 'row-active' : ''}`} onClick={() => setSelectedContentId(content.id)}>
                  <td className="text-muted-cell font-semibold">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                  <td>{displayValue(content.contentId)}</td>
                  <td><span className="video-title-truncate" title={title}>{title}</span></td>
                  <td>{getCompetitorName(content)}</td>
                  <td>{platformLabel(content.platform)}</td>
                  <td className="text-muted-cell">{formatDate(content.publishedAt)}</td>
                  <td>{analysesResource.error ? <span className="badge badge-warning">Không tải được</span> : analysesResource.loading && analysesResource.data === null ? <span className="badge badge-primary">Đang tải…</span> : analysis ? <span className="badge badge-success">Đã có kết quả</span> : <span className="badge badge-warning">Chưa có kết quả Phân tích AI</span>}</td>
                </tr>;
              })}</tbody>
            </table></div>
            <div className="table-pagination-footer"><span className="pagination-info">{filteredContents.length ? `Hiển thị ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filteredContents.length)} trong ${filteredContents.length} nội dung` : 'Không có kết quả phù hợp'}</span><div className="pagination-nav"><button type="button" className="page-nav-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>‹</button><span className="pagination-info">Trang {currentPage} / {pageCount}</span><button type="button" className="page-nav-btn" disabled={currentPage >= pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}>›</button></div></div>
            {!filteredContents.length && !contentsResource.loading && <div className="wf03-state">Không có nội dung phù hợp với bộ lọc.</div>}
          </>}
          {!contentsResource.loading && !contentsResource.error && !contentRecords.length && !analysesResource.error && !analysesResource.loading && <div className="wf03-state">Chưa có nội dung hoặc kết quả Phân tích AI.</div>}
          <div className="wf03-list-footer"><button className="btn btn-secondary" type="button" onClick={refreshAll} disabled={contentsResource.loading || analysesResource.loading}><RotateCcw size={14} /> Làm mới dữ liệu</button><span>Chỉ đọc kết quả đã lưu; chưa có API kích hoạt AI.</span></div>
        </div>

        <div className="ui-card wf03-detail-card">
          <div className="detail-card-header"><div className="card-section-title"><Sparkles size={18} className="text-primary" /><span>Chi tiết phân tích AI</span></div><div className="detail-header-actions"><div className="nav-arrows-group"><button type="button" className="arrow-btn" onClick={() => { const index = filteredContents.findIndex((item) => item.id === selectedContent?.id); if (index > 0) setSelectedContentId(filteredContents[index - 1].id); }} disabled={!selectedContent || filteredContents.findIndex((item) => item.id === selectedContent.id) <= 0} aria-label="Nội dung trước"><ChevronLeft size={16} /></button><button type="button" className="arrow-btn" onClick={() => { const index = filteredContents.findIndex((item) => item.id === selectedContent?.id); if (index >= 0 && index < filteredContents.length - 1) setSelectedContentId(filteredContents[index + 1].id); }} disabled={!selectedContent || filteredContents.findIndex((item) => item.id === selectedContent.id) >= filteredContents.length - 1} aria-label="Nội dung tiếp theo"><ChevronRight size={16} /></button></div>
            {selectedContent && isHttpUrl(selectedContent.url) && <a href={selectedContent.url} target="_blank" rel="noreferrer" className="btn-yt-external"><span>Mở video</span><ExternalLink size={13} /></a>}
          </div></div>

          {selectedContent && <div className="video-hero-preview"><div className="video-preview-placeholder"><Video size={34} /><span>Không có ảnh thu nhỏ trong dữ liệu máy chủ</span></div><div className="preview-info-box"><h3 className="preview-video-title">{displayValue(selectedContent.title)}</h3><div className="preview-author-row"><div className="author-avatar">{getCompetitorName(selectedContent).slice(0, 2).toUpperCase()}</div><div className="author-details"><span className="author-name">{getCompetitorName(selectedContent)}</span><span className="author-handle">{platformLabel(selectedContent.platform)} · ID {selectedContent.competitorId}</span></div></div><div className="preview-stats-line"><span>{displayValue(selectedContent.contentId)}</span><span className="dot-sep">•</span><span>{formatDate(selectedContent.publishedAt)}</span></div></div></div>}

          {selectedContent && <div className="detail-tabs-nav"><button className={`detail-tab-btn ${activeTab === 'result' ? 'active' : ''}`} onClick={() => setActiveTab('result')}>Kết quả</button><button className={`detail-tab-btn ${activeTab === 'keywords' ? 'active' : ''}`} onClick={() => setActiveTab('keywords')}>Từ khóa</button><button className={`detail-tab-btn ${activeTab === 'audience' ? 'active' : ''}`} onClick={() => setActiveTab('audience')}>Đối tượng</button><button className={`detail-tab-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Tóm tắt</button></div>}

          {analysesResource.loading && analysesResource.data === null && <div className="wf03-state" role="status"><Loader2 size={18} className="spin-icon" /> Đang tải kết quả AI…</div>}
          {analysesResource.error && <div className="wf03-state wf03-detail-error" role="alert"><p>{analysesResource.error}</p><button type="button" className="btn btn-secondary" onClick={analysesResource.refresh}>Thử tải lại</button></div>}
          {!analysesResource.loading && !analysesResource.error && selectedContent && !selectedAnalysis && <div className="wf03-state" role="status">Chưa có kết quả Phân tích AI cho nội dung này.</div>}
          {!selectedContent && !contentsResource.loading && !analysesResource.loading && <div className="wf03-state">Chọn nội dung để xem kết quả Phân tích AI.</div>}

          {selectedAnalysis && !analysesResource.error && <>
            {activeTab === 'result' && <div className="tab-pane-result fade-in"><div className="ai-attributes-grid">
              <div className="ai-attr-card"><div className="attr-top"><div className="attr-title-group"><Lightbulb size={16} className="attr-icon text-danger" /><span className="attr-label">Chủ đề chính </span></div></div><div className="attr-value-bold">{displayValue(selectedAnalysis.topic)}</div></div>
              <div className="ai-attr-card"><div className="attr-top"><div className="attr-title-group"><Folder size={16} className="attr-icon text-primary" /><span className="attr-label">Danh mục </span></div></div><div className="attr-value-bold">{displayValue(selectedAnalysis.category)}</div></div>
              <div className="ai-attr-card"><div className="attr-top"><div className="attr-title-group"><FileText size={16} className="attr-icon text-primary" /><span className="attr-label">Loại nội dung</span></div></div><div className="attr-value-bold">{displayValue(selectedAnalysis.contentType)}</div></div>
              <div className="ai-attr-card"><div className="attr-top"><div className="attr-title-group"><Smile size={16} className="attr-icon text-success" /><span className="attr-label">Cảm xúc </span></div></div><div className="attr-value-bold">{displayValue(selectedAnalysis.sentiment)}</div></div>
            </div><div className="ai-text-insights-list"><div className="ai-insight-box"><div className="insight-box-title"><FileText size={16} className="text-primary" /><span>Tóm tắt nội dung</span></div><p className="insight-box-body">{displayValue(selectedAnalysis.summary)}</p></div><div className="ai-insight-box"><div className="insight-box-title"><Target size={16} className="text-danger" /><span>Thông điệp chính</span></div><p className="insight-box-body">{displayValue(selectedAnalysis.keyMessage)}</p></div><div className="ai-insight-box"><div className="insight-box-title"><Users size={16} className="text-primary" /><span>Đối tượng mục tiêu</span></div><p className="insight-box-body">{displayValue(selectedAnalysis.targetAudience)}</p></div><p className="wf03-created-at">Được lưu lúc {formatDate(selectedAnalysis.createdAt)}</p></div></div>}
            {activeTab === 'keywords' && <div className="tab-pane-keywords fade-in"><h5 className="sub-tab-title">Từ khóa được lưu trong Phân tích AI:</h5>{keywords.length ? <div className="keywords-cloud">{keywords.map((keyword, index) => <span key={`${keyword}-${index}`} className="keyword-tag">#{keyword}</span>)}</div> : <p className="wf03-state">Không có từ khóa dạng chuỗi trong dữ liệu phân tích.</p>}</div>}
            {activeTab === 'audience' && <div className="tab-pane-box fade-in"><h5 className="sub-tab-title">Đối tượng mục tiêu:</h5><p className="audience-paragraph">{displayValue(selectedAnalysis.targetAudience)}</p></div>}
            {activeTab === 'summary' && <div className="tab-pane-box fade-in"><h5 className="sub-tab-title">Tóm tắt:</h5><p className="summary-paragraph">{displayValue(selectedAnalysis.summary)}</p></div>}
          </>}
        </div>
      </div>
    </div>
  );
};
