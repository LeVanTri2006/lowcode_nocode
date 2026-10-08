import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  UserPlus,
  Database,
  Users,
  Video,
  Play,
  Calendar,
  Clock,
  PlayCircle,
  Edit2,
  Trash2,
  Search,
  Info,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import {
  INITIAL_COMPETITORS,
  INITIAL_COLLECTION_HISTORY,
  type CompetitorItem,
} from '../../mocks/competitors';
import { useToast } from '../../components/common/Toast';
import { WorkflowExecutionStatus } from '../../components/workflow/WorkflowExecutionStatus';
import './WF01Page.css';

const YoutubeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const WF01Page: React.FC = () => {
  const { showToast } = useToast();
  const [competitors, setCompetitors] = useState<CompetitorItem[]>(INITIAL_COMPETITORS);
  const [history] = useState(INITIAL_COLLECTION_HISTORY);

  // Form State
  const [nameInput, setNameInput] = useState('');
  const [urlInput, setUrlInput] = useState('');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Collection Run State
  const [isCollecting, setIsCollecting] = useState(false);

  // Add Competitor
  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      showToast('Vui lòng nhập tên đối thủ', 'warning');
      return;
    }
    if (!urlInput.trim()) {
      showToast('Vui lòng nhập YouTube URL', 'warning');
      return;
    }

    const newId = competitors.length > 0 ? Math.max(...competitors.map((c) => c.id)) + 1 : 1;
    const handle = urlInput.includes('@') ? `@${urlInput.split('@')[1].split('/')[0]}` : `@channel_${newId}`;

    const newComp: CompetitorItem = {
      id: newId,
      name: nameInput.trim(),
      handle: handle,
      platform: 'YouTube',
      channelId: handle,
      videoCount: 0,
      lastCollectedAt: 'Vừa thêm',
      status: 'Đang theo dõi',
      avatarBg: '#0284C7',
      avatarText: nameInput.substring(0, 2).toUpperCase(),
    };

    setCompetitors([newComp, ...competitors]);
    setNameInput('');
    setUrlInput('');
    showToast(`Đã thêm đối thủ "${newComp.name}" thành công!`, 'success');
  };

  // Delete Competitor
  const handleDelete = (id: number, name: string) => {
    setCompetitors(competitors.filter((c) => c.id !== id));
    showToast(`Đã xóa đối thủ ${name}`, 'info');
  };

  // Run Collection
  const handleRunCollection = () => {
    if (isCollecting) return;
    setIsCollecting(true);
    showToast('Đang mô phỏng thu thập dữ liệu từ bộ mock...', 'info');

    setTimeout(() => {
      setIsCollecting(false);
      showToast('Mô phỏng thu thập hoàn tất cho 3 đối thủ.', 'success');
    }, 2000);
  };

  // Filtered List
  const filteredCompetitors = competitors.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.handle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || c.platform.toLowerCase() === platformFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="wf01-page-container fade-in">
      <PageHeader
        title="WF01 - Quản lý đối thủ & Thu thập dữ liệu"
        subtitle="Thêm, chỉnh sửa, xóa đối thủ và quản lý việc thu thập dữ liệu từ YouTube."
        stepNumber={1}
      />
      <WorkflowExecutionStatus workflowCode="WF01" />

      {/* TOP ROW: Add Competitor & Collection Manager */}
      <div className="wf01-top-grid">
        {/* Card: Thêm đối thủ mới */}
        <div className="ui-card wf01-add-card">
          <div className="card-section-title">
            <UserPlus size={18} className="title-icon text-primary" />
            <span>Thêm đối thủ mới</span>
          </div>

          <form onSubmit={handleAddCompetitor} className="add-competitor-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Tên đối thủ <span className="req">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ví dụ: MrBeast, TED, Veritasium"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">YouTube URL <span className="req">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://www.youtube.com/@channel hoặc /channel/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
            </div>

            {/* URL format guideline box */}
            <div className="url-guideline-box">
              <div className="guideline-icon">
                <Info size={16} />
              </div>
              <div className="guideline-content">
                <p className="guideline-header">Hỗ trợ các định dạng URL YouTube:</p>
                <ul className="guideline-list">
                  <li>https://www.youtube.com/@username</li>
                  <li>https://www.youtube.com/channel/UC...</li>
                  <li>https://www.youtube.com/c/ChannelName</li>
                </ul>
              </div>
            </div>

            <div className="form-actions-right">
              <button type="submit" className="btn btn-primary add-submit-btn">
                <span>+ Thêm đối thủ</span>
              </button>
            </div>
          </form>
        </div>

        {/* Card: Thu thập dữ liệu */}
        <div className="ui-card wf01-collect-card">
          <div className="card-section-title">
            <Database size={18} className="title-icon text-success" />
            <span>Thu thập dữ liệu (WF01)</span>
          </div>

          <div className="collect-info-box">
            <Info size={16} className="collect-info-icon" />
            <p className="collect-info-text">
              Chạy mô phỏng thu thập video mới nhất cho danh sách đối thủ mẫu.
            </p>
          </div>

          <button
            type="button"
            className={`btn btn-primary run-collect-btn ${isCollecting ? 'collecting' : ''}`}
            onClick={handleRunCollection}
            disabled={isCollecting}
          >
            {isCollecting ? (
              <>
                <Loader2 size={16} className="spin-icon" />
                <span>Đang thu thập dữ liệu từ YouTube...</span>
              </>
            ) : (
              <>
                <PlayCircle size={17} />
                <span>Chạy thu thập dữ liệu (WF01)</span>
              </>
            )}
          </button>

          {/* Lịch sử thu thập gần đây */}
          <div className="history-section">
            <div className="history-header">
              <span className="history-title">Lịch sử thu thập gần đây</span>
              <button
                type="button"
                className="view-all-link"
                onClick={() => showToast('Đang xem toàn bộ 12 phiên thu thập gần nhất', 'info')}
              >
                Xem tất cả →
              </button>
            </div>

            <div className="history-table-wrap">
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th>Số video thu thập</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.id}>
                      <td className="text-muted-cell">{row.time}</td>
                      <td>
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> {row.status}
                        </span>
                      </td>
                      <td className="font-semibold text-center">{row.videoCount}</td>
                      <td className="text-subtle-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Danh sách đối thủ */}
      <div className="ui-card wf01-table-card">
        <div className="table-card-header">
          <div className="card-section-title">
            <Users size={18} className="title-icon text-primary" />
            <span>Danh sách đối thủ</span>
          </div>

          <div className="table-filters-row">
            <div className="search-input-wrap">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm đối thủ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="table-search-input"
              />
            </div>

            <div className="filter-select-wrap">
              <span className="filter-label">Nền tảng</span>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="table-select"
              >
                <option value="all">Tất cả</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            <div className="filter-select-wrap">
              <span className="filter-label">Trạng thái</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="table-select"
              >
                <option value="all">Tất cả</option>
                <option value="Đang theo dõi">Đang theo dõi</option>
                <option value="Tạm dừng">Tạm dừng</option>
              </select>
            </div>
          </div>
        </div>

        <div className="main-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>ID</th>
                <th>Tên đối thủ</th>
                <th>Nền tảng</th>
                <th>Channel ID</th>
                <th style={{ textAlign: 'center' }}>Số video</th>
                <th>Lần thu thập cuối</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompetitors.map((comp) => (
                <tr key={comp.id}>
                  <td className="text-subtle-cell font-semibold">{comp.id}</td>
                  <td>
                    <div className="competitor-cell">
                      <div
                        className="competitor-avatar"
                        style={{ backgroundColor: comp.avatarBg }}
                      >
                        {comp.avatarText}
                      </div>
                      <div className="competitor-meta">
                        <span className="comp-name">{comp.name}</span>
                        <span className="comp-handle">{comp.handle}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="platform-tag">
                      <YoutubeIcon size={14} className="yt-icon" />
                      <span>{comp.platform}</span>
                    </span>
                  </td>
                  <td className="channel-id-cell">{comp.channelId}</td>
                  <td className="text-center font-bold">{comp.videoCount}</td>
                  <td className="text-muted-cell">{comp.lastCollectedAt}</td>
                  <td>
                    <span className="badge badge-success">
                      {comp.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        type="button"
                        className="action-icon-btn edit"
                        title="Chỉnh sửa đối thủ"
                        onClick={() => showToast(`Chỉnh sửa ${comp.name}`, 'info')}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="action-icon-btn delete"
                        title="Xóa đối thủ"
                        onClick={() => handleDelete(comp.id, comp.name)}
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn-collect-now"
                        onClick={() => showToast(`Bắt đầu thu thập cho ${comp.name}...`, 'success')}
                      >
                        <Play size={12} fill="#2563EB" />
                        <span>Thu thập ngay</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM ROW: 4 KPI Cards & Bar Chart */}
      <div className="wf01-bottom-grid">
        {/* KPI 1 */}
        <div className="ui-card wf01-kpi-card">
          <div className="kpi-icon-square blue">
            <Video size={22} />
          </div>
          <div className="kpi-info-group">
            <span className="kpi-title">Tổng số đối thủ</span>
            <span className="kpi-number">3</span>
            <span className="kpi-status-note">Đang theo dõi</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="ui-card wf01-kpi-card">
          <div className="kpi-icon-square green">
            <Play size={22} fill="#10B981" />
          </div>
          <div className="kpi-info-group">
            <span className="kpi-title">Tổng số video</span>
            <span className="kpi-number">754</span>
            <span className="kpi-trend-note positive">↗ +12.5% so với tuần trước</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="ui-card wf01-kpi-card">
          <div className="kpi-icon-square purple">
            <Calendar size={22} />
          </div>
          <div className="kpi-info-group">
            <span className="kpi-title">Lần thu thập cuối</span>
            <span className="kpi-number-sm">08/10/2026 15:30</span>
            <span className="kpi-status-dot-wrap">
              <span className="status-dot-green" /> Hoàn thành
            </span>
          </div>
        </div>

        {/* KPI 4 / Mini Chart */}
        <div className="ui-card wf01-chart-card">
          <div className="chart-card-header">
            <div className="chart-title-wrap">
              <Clock size={16} className="text-warning" />
              <span className="chart-title-text">Số video thu thập theo đối thủ</span>
            </div>
            <select className="chart-period-select">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>

          <div className="bar-chart-visual">
            <div className="bar-column">
              <span className="bar-val">125</span>
              <div className="bar-track">
                <div className="bar-fill blue" style={{ height: '36%' }} />
              </div>
              <span className="bar-label">TED</span>
            </div>

            <div className="bar-column">
              <span className="bar-val">342</span>
              <div className="bar-track">
                <div className="bar-fill green" style={{ height: '100%' }} />
              </div>
              <span className="bar-label">Marques Brownlee</span>
            </div>

            <div className="bar-column">
              <span className="bar-val">287</span>
              <div className="bar-track">
                <div className="bar-fill purple" style={{ height: '84%' }} />
              </div>
              <span className="bar-label">Veritasium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
