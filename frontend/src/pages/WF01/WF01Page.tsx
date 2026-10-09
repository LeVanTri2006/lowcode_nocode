import React, { useMemo, useRef, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  UserPlus, Database, Users, Video, Play, Calendar, Clock, PlayCircle,
  Edit2, Trash2, Search, Info, Loader2, RotateCcw,
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import { createCompetitor, getCompetitors } from '../../services/api/competitorsApi';
import { getSocialContents } from '../../services/api/socialContentsApi';
import { ApiError } from '../../services/api/client';
import { useApiResource } from '../../hooks/api/useApiResource';
import { platformLabel } from '../../utils/platformLabel';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { requestWf01Run } from '../../services/api/authApi';
import './WF01Page.css';

const YoutubeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const extractChannelId = (value: string) => value.match(/youtube\.com\/channel\/(UC[\w-]{22})(?:[/?#]|$)/i)?.[1] ?? '';
const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN').format(date);
};
const avatarColors = ['#2563EB', '#7C3AED', '#059669', '#B45309', '#E11D48'];

export const WF01Page: React.FC = () => {
  const { showToast } = useToast();
  const { user, refresh: refreshAuth } = useAuth();
  const navigate = useNavigate();
  const competitors = useApiResource((signal) => getCompetitors(undefined, signal), []);
  const contents = useApiResource(getSocialContents, []);
  const [nameInput, setNameInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [channelIdInput, setChannelIdInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLock = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [isRequestingRun, setIsRequestingRun] = useState(false);
  const [runRequestAccepted, setRunRequestAccepted] = useState(false);
  const runRequestLock = useRef(false);

  const videoCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const content of contents.data ?? []) counts.set(content.competitorId, (counts.get(content.competitorId) ?? 0) + 1);
    return counts;
  }, [contents.data]);

  const filteredCompetitors = useMemo(() => (competitors.data ?? []).filter((competitor) => {
    const query = searchTerm.trim().toLocaleLowerCase();
    const matchesSearch = !query || [competitor.name, competitor.channelId, competitor.url]
      .some((value) => value.toLocaleLowerCase().includes(query));
    const matchesPlatform = platformFilter === 'all' || competitor.platform.toLowerCase() === platformFilter;
    return matchesSearch && matchesPlatform;
  }), [competitors.data, searchTerm, platformFilter]);

  const handleAddCompetitor = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitLock.current) return;
    const name = nameInput.trim();
    const url = urlInput.trim();
    const channelId = channelIdInput.trim();
    if (!name) { showToast('Vui lòng nhập tên đối thủ.', 'warning'); return; }
    if (!url) { showToast('Vui lòng nhập Đường dẫn YouTube.', 'warning'); return; }
    let parsedUrl: URL;
    try { parsedUrl = new URL(url); }
    catch { showToast('Đường dẫn không hợp lệ. Vui lòng nhập đầy đủ địa chỉ YouTube.', 'warning'); return; }
    if (!['https:', 'http:'].includes(parsedUrl.protocol)) {
      showToast('Đường dẫn phải sử dụng HTTP hoặc HTTPS.', 'warning'); return;
    }
    if (!['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtu.be'].includes(parsedUrl.hostname.toLowerCase())) {
      showToast('Đường dẫn phải thuộc YouTube.', 'warning'); return;
    }
    if (!/^UC[\w-]{22}$/.test(channelId)) {
      showToast('Vui lòng nhập mã kênh YouTube hợp lệ (bắt đầu bằng UC, gồm 24 ký tự).', 'warning'); return;
    }

    submitLock.current = true;
    setIsSubmitting(true);
    try {
      const created = await createCompetitor({ name, platform: 'youtube', channel_id: channelId, url });
      setNameInput(''); setUrlInput(''); setChannelIdInput('');
      competitors.refresh();
      showToast(`Đã thêm đối thủ “${created.name}”.`, 'success');
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        showToast('Đối thủ này đã tồn tại trên máy chủ.', 'warning');
      } else {
        showToast(error instanceof Error ? error.message : 'Không thể thêm đối thủ. Vui lòng thử lại.', 'error');
      }
    } finally {
      submitLock.current = false;
      setIsSubmitting(false);
    }
  };

  const handleRequestRun = async () => {
    if (!user) { navigate('/login', { state: { returnTo: '/wf01' } }); return; }
    if (user.role !== 'operator') { showToast('Tài khoản của bạn không có quyền vận hành WF01.', 'warning'); return; }
    if (runRequestLock.current) return;
    runRequestLock.current = true;
    setIsRequestingRun(true);
    setRunRequestAccepted(false);
    try {
      await requestWf01Run();
      setRunRequestAccepted(true);
      showToast('Webhook đã tiếp nhận yêu cầu chạy WF01. Chưa có xác nhận workflow hoàn tất.', 'success');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await refreshAuth().catch(() => null);
        showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'warning');
        navigate('/login', { state: { returnTo: '/wf01' } });
      } else showToast(error instanceof Error ? error.message : 'Không thể gửi yêu cầu chạy WF01.', 'error');
    } finally { runRequestLock.current = false; setIsRequestingRun(false); }
  };

  const maxVideos = Math.max(1, ...(competitors.data ?? []).map((item) => videoCounts.get(item.id) ?? 0));

  return (
    <div className="wf01-page-container fade-in">
      <PageHeader title="WF01 - Quản lý đối thủ & Thu thập dữ liệu" subtitle="Quản lý đối thủ thật và gửi yêu cầu thu thập qua Backend tới n8n." stepNumber={1} />

      <div className="wf01-top-grid">
        <div className="ui-card wf01-add-card">
          <div className="card-section-title"><UserPlus size={18} className="title-icon text-primary" /><span>Thêm đối thủ mới</span></div>
          <form onSubmit={handleAddCompetitor} className="add-competitor-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="wf01-name">Tên đối thủ <span className="req">*</span></label>
                <input id="wf01-name" type="text" className="form-input" placeholder="Ví dụ: MrBeast, TED, Veritasium" value={nameInput} onChange={(event) => setNameInput(event.target.value)} disabled={isSubmitting} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wf01-url">Đường dẫn YouTube <span className="req">*</span></label>
                <input id="wf01-url" type="url" className="form-input" placeholder="https://www.youtube.com/@channel hoặc /channel/UC..." value={urlInput} onChange={(event) => { const value = event.target.value; setUrlInput(value); const detected = extractChannelId(value); if (detected) setChannelIdInput(detected); }} disabled={isSubmitting} required />
              </div>
            </div>
            <div className="form-group wf01-channel-id-field">
              <label className="form-label" htmlFor="wf01-channel-id">Mã kênh YouTube <span className="req">*</span></label>
              <input id="wf01-channel-id" type="text" className="form-input" placeholder="UCxxxxxxxxxxxxxxxxxxxxxx" value={channelIdInput} onChange={(event) => setChannelIdInput(event.target.value)} disabled={isSubmitting} required />
              <small>Đường dẫn dạng /channel/UC… sẽ tự điền ID. Đường dẫn @handle hoặc /c/ không thể tự phân giải thành Mã kênh.</small>
            </div>
            <div className="url-guideline-box">
              <div className="guideline-icon"><Info size={16} /></div>
              <div className="guideline-content"><p className="guideline-header">Các định dạng đường dẫn YouTube thường dùng:</p><ul className="guideline-list"><li>https://www.youtube.com/@username</li><li>https://www.youtube.com/channel/UC...</li><li>https://www.youtube.com/c/ChannelName</li></ul></div>
            </div>
            <div className="form-actions-right">
              <button type="submit" className="btn btn-primary add-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 size={15} className="spin-icon" /><span>Đang lưu…</span></> : <span>+ Thêm đối thủ</span>}
              </button>
            </div>
          </form>
        </div>

        <div className="ui-card wf01-collect-card">
          <div className="card-section-title"><Database size={18} className="title-icon text-success" /><span>Thu thập dữ liệu (WF01)</span></div>
          <div className="collect-info-box"><Info size={16} className="collect-info-icon" /><p className="collect-info-text">Chỉ tài khoản người vận hành mới được gửi yêu cầu. Phản hồi xác nhận tiếp nhận không cho biết WF01 đã hoàn tất hay thất bại.</p></div>
          <button type="button" className="btn btn-primary run-collect-btn" onClick={handleRequestRun} disabled={isRequestingRun}>
            {isRequestingRun ? <><Loader2 size={16} className="spin-icon" /><span>Đang gửi yêu cầu…</span></> : <><PlayCircle size={17} /><span>Bắt đầu thu thập dữ liệu</span></>}
          </button>
          <div className="history-section" role="status" aria-live="polite">
            <div className="history-header"><span className="history-title">Trạng thái yêu cầu</span></div>
            <p>{isRequestingRun ? 'Đang gửi yêu cầu chạy WF01…' : runRequestAccepted ? 'Đã gửi yêu cầu; Webhook đã tiếp nhận. Chưa có dữ liệu xác nhận workflow hoàn tất hoặc thất bại.' : 'Chưa gửi yêu cầu chạy WF01.'}</p>
          </div>
        </div>
      </div>

      <div className="ui-card wf01-table-card">
        <div className="table-card-header">
          <div className="card-section-title"><Users size={18} className="title-icon text-primary" /><span>Danh sách đối thủ</span></div>
          <div className="table-filters-row">
            <div className="search-input-wrap"><Search size={15} className="search-icon" /><input type="text" placeholder="Tìm tên, Mã kênh hoặc URL…" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="table-search-input" /></div>
            <div className="filter-select-wrap"><span className="filter-label">Nền tảng</span><select value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value)} className="table-select"><option value="all">Tất cả</option><option value="youtube">YouTube</option><option value="tiktok">TikTok</option></select></div>
            <button type="button" className="btn btn-secondary" onClick={competitors.refresh} disabled={competitors.loading}><RotateCcw size={14} /> Làm mới</button>
          </div>
        </div>
        {competitors.loading && competitors.data === null && <div className="wf01-api-state" role="status"><Loader2 size={18} className="spin-icon" /> Đang tải đối thủ từ máy chủ…</div>}
        {competitors.error && <div className="wf01-api-error" role="alert"><span>{competitors.error}</span><button className="btn btn-secondary" type="button" onClick={competitors.refresh}>Thử tải lại</button></div>}
        <div className="main-table-wrap"><table className="data-table"><thead><tr><th style={{ width: '55px' }}>ID</th><th>Tên đối thủ</th><th>Nền tảng</th><th>Mã kênh</th><th style={{ textAlign: 'center' }}>Số video trong cơ sở dữ liệu</th><th>Ngày tạo</th><th>Trạng thái thu thập</th><th style={{ textAlign: 'center' }}>Thao tác</th></tr></thead>
          <tbody>{filteredCompetitors.map((competitor, index) => <tr key={competitor.id}>
            <td className="text-subtle-cell font-semibold">{competitor.id}</td>
            <td><div className="competitor-cell"><div className="competitor-avatar" style={{ backgroundColor: avatarColors[index % avatarColors.length] }}>{competitor.name.slice(0, 2).toUpperCase()}</div><div className="competitor-meta"><span className="comp-name">{competitor.name}</span><a className="comp-handle" href={competitor.url} target="_blank" rel="noreferrer">{competitor.url}</a></div></div></td>
            <td><span className="platform-tag">{competitor.platform.toLowerCase() === 'youtube' && <YoutubeIcon size={14} className="yt-icon" />}<span>{platformLabel(competitor.platform)}</span></span></td>
            <td className="channel-id-cell">{competitor.channelId || '—'}</td>
            <td className="text-center font-bold">{contents.error ? '—' : contents.loading && contents.data === null ? '…' : videoCounts.get(competitor.id) ?? 0}</td>
            <td className="text-muted-cell">{formatDate(competitor.createdAt)}</td>
            <td><span className="text-muted-cell">Máy chủ chưa lưu trạng thái</span></td>
            <td><div className="table-actions-cell"><button type="button" className="action-icon-btn edit" title="Máy chủ chưa hỗ trợ sửa đối thủ" disabled><Edit2 size={15} /></button><button type="button" className="action-icon-btn delete" title="Máy chủ chưa hỗ trợ xóa đối thủ" disabled><Trash2 size={15} /></button><button type="button" className="btn-collect-now" onClick={handleRequestRun} disabled={isRequestingRun}><Play size={12} fill="#2563EB" /><span>Gửi yêu cầu</span></button></div></td>
          </tr>)}</tbody>
        </table>
        {!competitors.loading && !competitors.error && competitors.data?.length === 0 && <div className="wf01-api-state">Chưa có đối thủ. Hãy thêm đối thủ đầu tiên bằng biểu mẫu.</div>}
        {!competitors.loading && !competitors.error && (competitors.data?.length ?? 0) > 0 && filteredCompetitors.length === 0 && <div className="wf01-api-state">Không tìm thấy đối thủ phù hợp với bộ lọc.</div>}
        {contents.error && <div className="wf01-api-error compact" role="alert"><span>Không thể tải số video theo đối thủ: {contents.error}</span><button className="btn btn-secondary" type="button" onClick={contents.refresh}>Thử lại</button></div>}
        </div>
      </div>

      <div className="wf01-bottom-grid">
        <div className="ui-card wf01-kpi-card"><div className="kpi-icon-square blue"><Users size={22} /></div><div className="kpi-info-group"><span className="kpi-title">Tổng số đối thủ</span><span className="kpi-number">{competitors.error ? '—' : competitors.data?.length ?? (competitors.loading ? '…' : 0)}</span><span className="kpi-status-note">Theo dữ liệu máy chủ</span></div></div>
        <div className="ui-card wf01-kpi-card"><div className="kpi-icon-square green"><Video size={22} /></div><div className="kpi-info-group"><span className="kpi-title">Tổng số nội dung</span><span className="kpi-number">{contents.error ? '—' : contents.data?.length ?? (contents.loading ? '…' : 0)}</span><span className="kpi-status-note">Bản ghi nội dung trong máy chủ</span></div></div>
        <div className="ui-card wf01-kpi-card"><div className="kpi-icon-square purple"><Calendar size={22} /></div><div className="kpi-info-group"><span className="kpi-title">Lần thu thập cuối</span><span className="kpi-number-sm">Chưa có dữ liệu</span><span className="kpi-status-note">máy chủ chưa lưu lịch sử thu thập</span></div></div>
        <div className="ui-card wf01-chart-card"><div className="chart-card-header"><div className="chart-title-wrap"><Clock size={16} className="text-warning" /><span className="chart-title-text">Số video đã lưu theo đối thủ</span></div><span className="chart-period-select">Tổng số hiện có</span></div>
          {contents.error ? <div className="wf01-api-state">Không có dữ liệu biểu đồ do API nội dung lỗi.</div> : contents.loading && contents.data === null ? <div className="wf01-api-state">Đang tải dữ liệu…</div> : (competitors.data ?? []).length === 0 ? <div className="wf01-api-state">Chưa có dữ liệu đối thủ.</div> : <div className="bar-chart-visual">{(competitors.data ?? []).map((competitor, index) => { const count = videoCounts.get(competitor.id) ?? 0; return <div className="bar-column" key={competitor.id}><span className="bar-val">{count}</span><div className="bar-track"><div className={`bar-fill ${['blue', 'green', 'purple'][index % 3]}`} style={{ height: `${count ? Math.max(4, count / maxVideos * 100) : 0}%` }} /></div><span className="bar-label">{competitor.name}</span></div>; })}</div>}
        </div>
      </div>
    </div>
  );
};
