import React, { useMemo, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  FileText, CheckCircle2, AlertTriangle, ShieldAlert, Filter, Layers, Video,
  Download, Eye, Edit2, MoreVertical, RotateCcw, Loader2,
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import { getSocialContents } from '../../services/api/socialContentsApi';
import { getSocialMetrics } from '../../services/api/socialMetricsApi';
import { getCompetitors } from '../../services/api/competitorsApi';
import { useApiResource } from '../../hooks/api/useApiResource';
import type { SocialContent, SocialMetric } from '../../types/api';
import { platformLabel } from '../../utils/platformLabel';
import './WF02Page.css';

const PAGE_SIZE = 10;
const EMPTY_CONTENTS: SocialContent[] = [];
const formatNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(value);
const formatMetric = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? formatNumber(value) : '—';
const formatDate = (value: string | null | undefined) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(date);
};
const dateKey = (value: string | null | undefined) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};
const isHttpUrl = (value: unknown): value is string => {
  if (typeof value !== 'string' || !value.trim()) return false;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); }
  catch { return false; }
};
const csvCell = (value: unknown) => {
  let text = String(value ?? '');
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

export const WF02Page: React.FC = () => {
  const { showToast } = useToast();
  const contentsResource = useApiResource(getSocialContents, []);
  const metricsResource = useApiResource(getSocialMetrics, []);
  const competitorsResource = useApiResource((signal) => getCompetitors(undefined, signal), []);
  const [competitorFilter, setCompetitorFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [metricsFilter, setMetricsFilter] = useState('all');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const competitorNames = useMemo(() => new Map((competitorsResource.data ?? []).map((item) => [item.id, item.name])), [competitorsResource.data]);
  const latestMetricByContent = useMemo(() => {
    const latest = new Map<number, SocialMetric>();
    for (const metric of metricsResource.data ?? []) {
      const contentId = Number(metric.socialContentId);
      const capturedAt = typeof metric.capturedAt === 'string' && metric.capturedAt.trim() ? Date.parse(metric.capturedAt) : Number.NaN;
      if (!Number.isInteger(contentId) || !Number.isFinite(capturedAt)) continue;
      const previous = latest.get(contentId);
      if (!previous || capturedAt > new Date(previous.capturedAt).getTime()) latest.set(contentId, metric);
    }
    return latest;
  }, [metricsResource.data]);

  const contents = contentsResource.data ?? EMPTY_CONTENTS;
  const filteredContents = useMemo(() => contents.filter((content) => {
    const title = typeof content.title === 'string' ? content.title : '';
    const competitorName = competitorNames.get(content.competitorId) ?? '';
    const query = keywordFilter.trim().toLocaleLowerCase();
    const matchesCompetitor = competitorFilter === 'all' || String(content.competitorId) === competitorFilter;
    const matchesPlatform = platformFilter === 'all' || content.platform?.toLowerCase() === platformFilter;
    const matchesMetrics = Boolean(metricsResource.error) || metricsFilter === 'all' || (metricsFilter === 'has' ? latestMetricByContent.has(content.id) : !latestMetricByContent.has(content.id));
    const matchesKeyword = !query || title.toLocaleLowerCase().includes(query) || competitorName.toLocaleLowerCase().includes(query) || String(content.contentId ?? '').toLocaleLowerCase().includes(query);
    const publishedDate = dateKey(content.publishedAt);
    const matchesStart = !startDate || (publishedDate !== '' && publishedDate >= startDate);
    const matchesEnd = !endDate || (publishedDate !== '' && publishedDate <= endDate);
    return matchesCompetitor && matchesPlatform && matchesMetrics && matchesKeyword && matchesStart && matchesEnd;
  }), [contents, competitorNames, competitorFilter, platformFilter, metricsFilter, keywordFilter, startDate, endDate, latestMetricByContent, metricsResource.error]);

  const pageCount = Math.max(1, Math.ceil(filteredContents.length / PAGE_SIZE));
  const pageContents = filteredContents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const withMetricsCount = contents.filter((item) => latestMetricByContent.has(item.id)).length;
  const distinctPlatforms = new Set(contents.map((item) => item.platform).filter(Boolean)).size;

  const resetFilters = () => {
    setCompetitorFilter('all'); setPlatformFilter('all'); setMetricsFilter('all');
    setKeywordFilter(''); setStartDate(''); setEndDate(''); setCurrentPage(1);
  };

  const refreshAll = () => {
    contentsResource.refresh(); metricsResource.refresh(); competitorsResource.refresh();
  };

  const exportCsv = () => {
    if (!filteredContents.length) { showToast('Không có nội dung phù hợp để xuất.', 'warning'); return; }
    const rows = [
      ['Mã nội dung mạng xã hội', 'Mã nội dung trên nền tảng', 'Tiêu đề', 'Nền tảng', 'Đối thủ', 'Đường dẫn', 'Ngày đăng', 'Lượt xem', 'Lượt thích', 'Bình luận', 'Lượt chia sẻ', 'Thời điểm ghi nhận chỉ số'],
      ...filteredContents.map((content) => {
        const metric = latestMetricByContent.get(content.id);
        return [content.id, content.contentId, content.title, content.platform, competitorNames.get(content.competitorId) ?? `Đối thủ #${content.competitorId}`, content.url, content.publishedAt, metric?.views, metric?.likes, metric?.comments, metric?.shares, metric?.capturedAt];
      }),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'wf02-social-contents.csv'; anchor.click();
    URL.revokeObjectURL(url);
    showToast(`Đã xuất ${filteredContents.length} nội dung đang hiển thị.`, 'success');
  };

  const kpiValue = (loading: boolean, error: string | null, value: number) => error ? '—' : loading ? '…' : formatNumber(value);

  return (
    <div className="wf02-page-container fade-in">
      <PageHeader title="WF02 - Quản lý nội dung & Làm sạch dữ liệu" subtitle="Nội dung và chỉ số lấy từ máy chủ. Trạng thái làm sạch chưa được lưu trong cơ sở dữ liệu." stepNumber={2} />
      <section className="ui-card wf02-workflow-info" aria-labelledby="wf02-workflow-title">
        <div>
          <span className="wf02-workflow-label">WF02 · Quy trình con</span>
          <h2 id="wf02-workflow-title">Quy trình làm sạch dữ liệu</h2>
          <p>WF02 được WF01 kích hoạt để chuẩn hóa nội dung, kiểm tra dữ liệu và loại bỏ nội dung trùng lặp.</p>
        </div>
        <span className="wf02-trigger-badge">Được WF01 kích hoạt</span>
      </section>

      <div className="wf02-kpi-grid">
        <div className="ui-card kpi-card-clean"><div className="kpi-icon-wrap blue"><FileText size={22} /></div><div className="kpi-details"><span className="kpi-label">Tổng số nội dung</span><span className="kpi-number">{kpiValue(contentsResource.loading, contentsResource.error, contents.length)}</span><span className="kpi-subtext neutral">Bản ghi nội dung mạng xã hội</span></div></div>
        <div className="ui-card kpi-card-clean"><div className="kpi-icon-wrap green"><CheckCircle2 size={22} /></div><div className="kpi-details"><span className="kpi-label">Có chỉ số mới nhất</span><span className="kpi-number">{kpiValue(contentsResource.loading || metricsResource.loading, contentsResource.error || metricsResource.error, withMetricsCount)}</span><span className="kpi-subtext neutral">Lần ghi nhận trên nội dung</span></div></div>
        <div className="ui-card kpi-card-clean"><div className="kpi-icon-wrap red"><AlertTriangle size={22} /></div><div className="kpi-details"><span className="kpi-label">Chưa có chỉ số</span><span className="kpi-number">{kpiValue(contentsResource.loading || metricsResource.loading, contentsResource.error || metricsResource.error, Math.max(0, contents.length - withMetricsCount))}</span><span className="kpi-subtext neutral">Chưa có lần ghi nhận liên kết</span></div></div>
        <div className="ui-card kpi-card-clean"><div className="kpi-icon-wrap orange"><ShieldAlert size={22} /></div><div className="kpi-details"><span className="kpi-label">Lần ghi nhận chỉ số</span><span className="kpi-number">{kpiValue(metricsResource.loading, metricsResource.error, metricsResource.data?.length ?? 0)}</span><span className="kpi-subtext neutral">{distinctPlatforms} nền tảng trong nội dung</span></div></div>
      </div>

      <div className="wf02-main-layout">
        <div className="wf02-left-col">
          <div className="ui-card wf02-filter-card">
            <div className="card-section-title"><Filter size={16} className="text-primary" /><span>Bộ lọc dữ liệu</span></div>
            <div className="filter-group"><label className="filter-field-label" htmlFor="wf02-competitor">Đối thủ</label><select id="wf02-competitor" className="filter-select" value={competitorFilter} onChange={(event) => { setCompetitorFilter(event.target.value); setCurrentPage(1); }}><option value="all">Tất cả</option>{(competitorsResource.data ?? []).map((competitor) => <option value={competitor.id} key={competitor.id}>{competitor.name}</option>)}</select>{competitorsResource.error && <small className="wf02-inline-error">Tên đối thủ không tải được; đang hiển thị ID. <button type="button" onClick={competitorsResource.refresh}>Thử lại</button></small>}</div>
            <div className="filter-group"><label className="filter-field-label" htmlFor="wf02-platform">Nền tảng</label><select id="wf02-platform" className="filter-select" value={platformFilter} onChange={(event) => { setPlatformFilter(event.target.value); setCurrentPage(1); }}><option value="all">Tất cả</option>{[...new Set(contents.map((item) => item.platform).filter(Boolean))].map((platform) => <option key={platform} value={platform.toLowerCase()}>{platformLabel(platform)}</option>)}</select></div>
            <div className="filter-group"><label className="filter-field-label" htmlFor="wf02-metrics">Tình trạng chỉ số</label><select id="wf02-metrics" className="filter-select" value={metricsFilter} disabled={Boolean(metricsResource.error)} onChange={(event) => { setMetricsFilter(event.target.value); setCurrentPage(1); }}><option value="all">Tất cả</option><option value="has">Có lần ghi nhận</option><option value="none">Chưa có lần ghi nhận</option></select></div>
            <div className="filter-group"><label className="filter-field-label" htmlFor="wf02-keyword">Từ khóa</label><input id="wf02-keyword" type="search" placeholder="Tìm tiêu đề hoặc video ID…" className="filter-text-input" value={keywordFilter} onChange={(event) => { setKeywordFilter(event.target.value); setCurrentPage(1); }} /></div>
            <div className="filter-group"><label className="filter-field-label">Ngày đăng</label><div className="date-range-box"><input aria-label="Từ ngày đăng" type="date" className="date-input" value={startDate} onChange={(event) => { setStartDate(event.target.value); setCurrentPage(1); }} /><span className="date-sep">→</span><input aria-label="Đến ngày đăng" type="date" className="date-input" value={endDate} onChange={(event) => { setEndDate(event.target.value); setCurrentPage(1); }} /></div></div>
            <div className="filter-actions-row"><button type="button" className="btn btn-primary btn-apply-filter" onClick={() => setCurrentPage(1)}>🔍 Lọc dữ liệu</button><button type="button" className="btn btn-secondary btn-reset-filter" onClick={resetFilters}><RotateCcw size={13} /> Đặt lại</button></div>
          </div>

          <div className="ui-card wf02-bulk-card"><div className="card-section-title"><Layers size={16} className="text-primary" /><span>Thông tin dữ liệu</span></div><p className="wf02-data-note">máy chủ hiện không lưu trạng thái hợp lệ, trùng lặp hoặc không hợp lệ. Các thao tác đổi trạng thái và xóa hàng loạt chưa được hỗ trợ.</p><p className="wf02-data-note">Chỉ số hiển thị là lần ghi nhận mới nhất theo thời gian ghi nhận.</p></div>
        </div>

        <div className="ui-card wf02-right-col">
          <div className="content-table-header"><div className="card-section-title"><Video size={18} className="text-primary" /><span>Danh sách nội dung</span></div><div className="wf02-table-actions"><button type="button" className="btn btn-outline export-btn" onClick={exportCsv}><Download size={14} /><span>Xuất dữ liệu</span></button><button type="button" className="btn btn-secondary" onClick={refreshAll} disabled={contentsResource.loading || metricsResource.loading}><RotateCcw size={14} /> Làm mới</button></div></div>

          {contentsResource.loading && contentsResource.data === null && <div className="wf02-state" role="status"><Loader2 size={18} className="spin-icon" /> Đang tải nội dung từ máy chủ…</div>}
          {contentsResource.error && <div className="wf02-error" role="alert"><span>{contentsResource.error}</span><button className="btn btn-secondary" type="button" onClick={contentsResource.refresh}>Thử tải lại nội dung</button></div>}
          {metricsResource.error && <div className="wf02-error compact" role="alert"><span>Không tải được chỉ số: {metricsResource.error} Lượt tương tác sẽ hiện “—”.</span><button className="btn btn-secondary" type="button" onClick={metricsResource.refresh}>Thử lại</button></div>}
          {competitorsResource.error && <div className="wf02-error compact" role="alert"><span>Không tải được tên đối thủ; đang dùng Mã nội bộ.</span><button className="btn btn-secondary" type="button" onClick={competitorsResource.refresh}>Thử lại</button></div>}

          {contentsResource.data && contentsResource.data.length > 0 && <>
            <div className="table-responsive-wrap"><table className="content-data-table"><thead><tr><th>Mã nội bộ</th><th>Nội dung</th><th>Nền tảng</th><th>Đối thủ</th><th>Ngày đăng</th><th>Lượt xem</th><th>Lượt thích</th><th>Bình luận</th><th>Chia sẻ</th><th>Chỉ số gần nhất</th><th>Thao tác</th></tr></thead>
              <tbody>{pageContents.map((content: SocialContent) => {
                const metric = latestMetricByContent.get(content.id);
                const title = typeof content.title === 'string' && content.title.trim() ? content.title : '(Không có tiêu đề)';
                const competitorName = competitorNames.get(content.competitorId);
                return <tr key={content.id}>
                  <td className="text-muted-cell font-semibold">{content.id}</td>
                  <td><div className="wf02-content-title"><span className="video-title-text" title={title}>{title}</span><small>Mã video: {content.contentId || '—'}</small></div></td>
                  <td>{platformLabel(content.platform)}</td>
                  <td>{competitorName ?? `Đối thủ #${content.competitorId}`}</td>
                  <td className="text-muted-cell">{formatDate(content.publishedAt)}</td>
                  <td className="font-semibold">{metricsResource.error ? '—' : metricsResource.loading && metricsResource.data === null ? 'Đang tải…' : metric ? formatMetric(metric.views) : 'Chưa có dữ liệu chỉ số'}</td>
                  <td>{metricsResource.error ? '—' : metricsResource.loading && metricsResource.data === null ? '…' : metric ? formatMetric(metric.likes) : '—'}</td>
                  <td>{metricsResource.error ? '—' : metricsResource.loading && metricsResource.data === null ? '…' : metric ? formatMetric(metric.comments) : '—'}</td>
                  <td>{metricsResource.error ? '—' : metricsResource.loading && metricsResource.data === null ? '…' : metric ? formatMetric(metric.shares) : '—'}</td>
                  <td className="text-muted-cell">{metricsResource.error ? 'Lỗi tải' : metricsResource.loading && metricsResource.data === null ? 'Đang tải…' : metric ? formatDate(metric.capturedAt) : 'Chưa có lần ghi nhận'}</td>
                  <td><div className="table-actions-cell">{isHttpUrl(content.url) ? <a className="action-icon-btn view" title="Mở nội dung" href={content.url} target="_blank" rel="noreferrer"><Eye size={14} /></a> : <button className="action-icon-btn view" type="button" title="máy chủ không cung cấp Đường dẫn hợp lệ" disabled><Eye size={14} /></button>}<button className="action-icon-btn edit" type="button" title="máy chủ chưa hỗ trợ sửa nội dung" disabled><Edit2 size={14} /></button><button className="action-icon-btn more" type="button" title="máy chủ chưa hỗ trợ thao tác này" disabled><MoreVertical size={14} /></button></div></td>
                </tr>;
              })}</tbody>
            </table></div>
            <div className="table-pagination-footer"><span className="pagination-info">{filteredContents.length ? `Hiển thị ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filteredContents.length)} trong ${filteredContents.length} nội dung` : 'Không có kết quả'}</span><div className="pagination-nav"><button type="button" className="page-nav-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>‹</button><span className="pagination-info">Trang {currentPage} / {pageCount}</span><button type="button" className="page-nav-btn" disabled={currentPage >= pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}>›</button></div></div>
          </>}
          {!contentsResource.loading && !contentsResource.error && contentsResource.data?.length === 0 && <div className="wf02-state">Chưa có nội dung.</div>}
          {!contentsResource.loading && !contentsResource.error && contentsResource.data && contentsResource.data.length > 0 && filteredContents.length === 0 && <div className="wf02-state">Không có nội dung phù hợp với bộ lọc.</div>}
        </div>
      </div>
    </div>
  );
};
