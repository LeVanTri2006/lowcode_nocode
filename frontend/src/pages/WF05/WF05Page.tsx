import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  Bell,
  Flame,
  Users,
  FileText,
  PieChart,
  BarChart2,
  Search,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_ALERTS, type AlertItem } from '../../mocks/alerts';
import { useToast } from '../../components/common/Toast';
import './WF05Page.css';

export const WF05Page: React.FC = () => {
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  // Filters
  const [typeFilter, setTypeFilter] = useState('all');
  const [compFilter, setCompFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter((a) => {
    const matchesType = typeFilter === 'all' || a.alertType === typeFilter;
    const matchesComp = compFilter === 'all' || a.competitor === compFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      a.videoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesComp && matchesStatus && matchesSearch;
  });

  const handleToggleStatus = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const next = a.status === 'Mới' ? 'Đã xử lý' : 'Mới';
          showToast(`Đã đổi trạng thái cảnh báo #${a.id} sang "${next}"`, 'info');
          return { ...a, status: next };
        }
        return a;
      })
    );
  };

  return (
    <div className="wf05-page-container fade-in">
      <PageHeader
        title="WF05 - Giám sát & Cảnh báo"
        subtitle="Theo dõi đối thủ, phát hiện nội dung bất thường và gửi cảnh báo kịp thời."
        stepNumber={5}
      />

      {/* TOP ROW: 4 KPI CARDS */}
      <div className="wf05-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap red">
            <Bell size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng cảnh báo</span>
            <span className="kpi-number">48</span>
            <span className="kpi-subtext positive">↗ +23.1% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap orange">
            <Flame size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Cảnh báo tăng trưởng</span>
            <span className="kpi-number">28</span>
            <span className="kpi-subtext positive">↗ +40.0%</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue">
            <Users size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Cảnh báo đối thủ mới</span>
            <span className="kpi-number">12</span>
            <span className="kpi-subtext positive">↗ +9.1%</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green">
            <FileText size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Cảnh báo xu hướng</span>
            <span className="kpi-number">8</span>
            <span className="kpi-subtext danger">↘ -11.1%</span>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: 3 ANALYTICS & CHARTS */}
      <div className="wf05-middle-grid">
        {/* Card 1: Số lượng cảnh báo theo thời gian */}
        <div className="ui-card wf05-timeline-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <Bell size={16} className="text-primary" />
              <span>Số lượng cảnh báo theo thời gian</span>
            </div>
            <select className="period-select-sm">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>

          <div className="chart-legend-row-wrap">
            <span className="legend-item"><span className="legend-dot red" /> Tăng trưởng đột biến</span>
            <span className="legend-item"><span className="legend-dot blue" /> Video mới nổi bật</span>
            <span className="legend-item"><span className="legend-dot green" /> Đối thủ mới</span>
            <span className="legend-item"><span className="legend-dot purple" /> Xu hướng mới</span>
          </div>

          <div className="chart-svg-wrap">
            <svg viewBox="0 0 500 180" className="alert-trend-svg">
              <line x1="30" y1="15" x2="480" y2="15" stroke="#F1F5F9" strokeWidth="1" />
              <text x="22" y="19" fill="#94A3B8" fontSize="10" textAnchor="end">20</text>

              <line x1="30" y1="55" x2="480" y2="55" stroke="#F1F5F9" strokeWidth="1" />
              <text x="22" y="59" fill="#94A3B8" fontSize="10" textAnchor="end">15</text>

              <line x1="30" y1="95" x2="480" y2="95" stroke="#F1F5F9" strokeWidth="1" />
              <text x="22" y="99" fill="#94A3B8" fontSize="10" textAnchor="end">10</text>

              <line x1="30" y1="135" x2="480" y2="135" stroke="#F1F5F9" strokeWidth="1" />
              <text x="22" y="139" fill="#94A3B8" fontSize="10" textAnchor="end">5</text>

              <line x1="30" y1="165" x2="480" y2="165" stroke="#E2E8F0" strokeWidth="1" />
              <text x="22" y="169" fill="#94A3B8" fontSize="10" textAnchor="end">0</text>

              {['02/10', '03/10', '04/10', '05/10', '06/10', '07/10', '08/10'].map((d, i) => (
                <text key={i} x={45 + i * 68} y="178" fill="#64748B" fontSize="9.5" textAnchor="middle">
                  {d}
                </text>
              ))}

              {/* Red Line: Tăng trưởng */}
              <polyline
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                points="45,145 113,130 181,115 249,122 317,100 385,96 453,30"
              />
              {/* Blue Line: Video mới */}
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                points="45,155 113,142 181,130 249,112 317,108 385,92 453,92"
              />
              {/* Green Line: Đối thủ */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                points="45,160 113,155 181,152 249,145 317,145 385,128 453,128"
              />
              {/* Purple Line: Xu hướng */}
              <polyline
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2"
                points="45,162 113,162 181,158 249,158 317,152 385,148 453,148"
              />

              {/* Points */}
              <circle cx="453" cy="30" r="4" fill="#EF4444" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="453" cy="92" r="4" fill="#2563EB" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="453" cy="128" r="3.5" fill="#10B981" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="453" cy="148" r="3.5" fill="#8B5CF6" stroke="#FFF" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Card 2: Phân loại cảnh báo (Donut Chart) */}
        <div className="ui-card wf05-donut-card">
          <div className="card-section-title">
            <PieChart size={16} className="text-primary" />
            <span>Phân loại cảnh báo</span>
          </div>

          <div className="donut-content-row">
            <div className="donut-svg-wrap">
              <svg viewBox="0 0 160 160" className="donut-svg">
                {/* Circumference = 2 * PI * 60 ~= 377 */}
                {/* 58.3% = 220, offset 0 */}
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="24"
                  strokeDasharray="220 377"
                  strokeDashoffset="0"
                />
                {/* 25.0% = 94, offset -220 */}
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="24"
                  strokeDasharray="94 377"
                  strokeDashoffset="-220"
                />
                {/* 10.4% = 39, offset -314 */}
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="24"
                  strokeDasharray="39 377"
                  strokeDashoffset="-314"
                />
                {/* 6.3% = 24, offset -353 */}
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="24"
                  strokeDasharray="24 377"
                  strokeDashoffset="-353"
                />
              </svg>
              <div className="donut-center-label">
                <span className="donut-center-number">48</span>
                <span className="donut-center-sub">Tổng cảnh báo</span>
              </div>
            </div>

            <div className="donut-legend-stack">
              <div className="donut-legend-item">
                <span className="legend-dot red" />
                <div className="legend-meta">
                  <span className="legend-name">Tăng trưởng đột biến</span>
                  <span className="legend-val">28 (58.3%)</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <span className="legend-dot blue" />
                <div className="legend-meta">
                  <span className="legend-name">Video mới nổi bật</span>
                  <span className="legend-val">12 (25.0%)</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <span className="legend-dot green" />
                <div className="legend-meta">
                  <span className="legend-name">Đối thủ mới</span>
                  <span className="legend-val">5 (10.4%)</span>
                </div>
              </div>

              <div className="donut-legend-item">
                <span className="legend-dot purple" />
                <div className="legend-meta">
                  <span className="legend-name">Xu hướng mới</span>
                  <span className="legend-val">3 (6.3%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Kênh / Đối thủ có nhiều cảnh báo */}
        <div className="ui-card wf05-bar-card">
          <div className="card-section-title">
            <BarChart2 size={16} className="text-primary" />
            <span>Kênh / Đối thủ có nhiều cảnh báo</span>
          </div>

          <div className="channels-alert-bars">
            <div className="channel-bar-item">
              <span className="ch-name">Marques Brownlee</span>
              <div className="ch-bar-track">
                <div className="ch-bar-fill blue" style={{ width: '90%' }} />
              </div>
              <span className="ch-num">18</span>
            </div>

            <div className="channel-bar-item">
              <span className="ch-name">Veritasium</span>
              <div className="ch-bar-track">
                <div className="ch-bar-fill green" style={{ width: '60%' }} />
              </div>
              <span className="ch-num">12</span>
            </div>

            <div className="channel-bar-item">
              <span className="ch-name">TED</span>
              <div className="ch-bar-track">
                <div className="ch-bar-fill coral" style={{ width: '50%' }} />
              </div>
              <span className="ch-num">10</span>
            </div>

            <div className="channel-bar-item">
              <span className="ch-name">MrBeast</span>
              <div className="ch-bar-track">
                <div className="ch-bar-fill purple" style={{ width: '30%' }} />
              </div>
              <span className="ch-num">6</span>
            </div>

            <div className="channel-bar-item">
              <span className="ch-name">Others</span>
              <div className="ch-bar-track">
                <div className="ch-bar-fill gray" style={{ width: '10%' }} />
              </div>
              <span className="ch-num">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Danh sách cảnh báo mới nhất */}
      <div className="ui-card wf05-alerts-table-card">
        <div className="table-card-header">
          <div className="card-section-title">
            <Bell size={18} className="text-primary" />
            <span>Danh sách cảnh báo mới nhất</span>
          </div>

          <div className="table-filters-row">
            <div className="filter-select-wrap">
              <span className="filter-label">Loại cảnh báo</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="table-select"
              >
                <option value="all">Tất cả</option>
                <option value="Tăng trưởng đột biến">Tăng trưởng đột biến</option>
                <option value="Video mới nổi bật">Video mới nổi bật</option>
                <option value="Đối thủ mới">Đối thủ mới</option>
                <option value="Xu hướng mới">Xu hướng mới</option>
              </select>
            </div>

            <div className="filter-select-wrap">
              <span className="filter-label">Đối thủ</span>
              <select
                value={compFilter}
                onChange={(e) => setCompFilter(e.target.value)}
                className="table-select"
              >
                <option value="all">Tất cả</option>
                <option value="Marques Brownlee">Marques Brownlee</option>
                <option value="TED">TED</option>
                <option value="Veritasium">Veritasium</option>
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
                <option value="Mới">Mới</option>
                <option value="Đã xử lý">Đã xử lý</option>
              </select>
            </div>

            <div className="search-input-wrap">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm video, tiêu đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="table-search-input"
              />
            </div>
          </div>
        </div>

        <div className="table-responsive-wrap">
          <table className="alerts-data-table">
            <thead>
              <tr>
                <th style={{ width: '32px' }}>#</th>
                <th>Thời gian</th>
                <th style={{ width: '60px' }}>Thumbnail</th>
                <th>Tiêu đề</th>
                <th>Đối thủ</th>
                <th>Loại cảnh báo</th>
                <th>Mức độ</th>
                <th>Chi tiết</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alt) => (
                <tr key={alt.id}>
                  <td className="text-muted-cell font-semibold">{alt.id}</td>
                  <td className="text-muted-cell">{alt.time}</td>
                  <td>
                    <div
                      className="alert-thumb-mini"
                      style={{ background: alt.thumbnailGradient }}
                    />
                  </td>
                  <td>
                    <span className="alert-video-title">{alt.videoTitle}</span>
                  </td>
                  <td>
                    <div className="comp-mini-cell">
                      <div
                        className="comp-mini-avatar"
                        style={{ backgroundColor: alt.avatarBg }}
                      >
                        {alt.avatarText}
                      </div>
                      <span className="comp-mini-name">{alt.competitor}</span>
                    </div>
                  </td>
                  <td>
                    {alt.alertType === 'Tăng trưởng đột biến' && (
                      <span className="badge-alert red">Tăng trưởng đột biến</span>
                    )}
                    {alt.alertType === 'Video mới nổi bật' && (
                      <span className="badge-alert blue">Video mới nổi bật</span>
                    )}
                    {alt.alertType === 'Đối thủ mới' && (
                      <span className="badge-alert green">Đối thủ mới</span>
                    )}
                    {alt.alertType === 'Xu hướng mới' && (
                      <span className="badge-alert purple">Xu hướng mới</span>
                    )}
                  </td>
                  <td>
                    <span className={`severity-text ${alt.severity.toLowerCase()}`}>
                      {alt.severity}
                    </span>
                  </td>
                  <td className="detail-cell-text">{alt.detail}</td>
                  <td>
                    <button
                      type="button"
                      className={`status-toggle-badge ${alt.status === 'Mới' ? 'is-new' : 'is-resolved'}`}
                      onClick={() => handleToggleStatus(alt.id)}
                    >
                      {alt.status}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        type="button"
                        className="action-icon-btn view"
                        title="Xem chi tiết cảnh báo"
                        onClick={() => showToast(`Chi tiết cảnh báo: ${alt.videoTitle}`, 'info')}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        className="action-icon-btn more"
                        title="Xem video trên YouTube"
                      >
                        <ExternalLink size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination-footer">
          <span className="pagination-info">Hiển thị 1 - 6 của 48 cảnh báo</span>
          <div className="pagination-nav">
            <button className="page-nav-btn">&lt;</button>
            <button className="page-num-btn active">1</button>
            <button className="page-num-btn">2</button>
            <button className="page-num-btn">3</button>
            <button className="page-num-btn">4</button>
            <button className="page-num-btn">5</button>
            <span className="page-dots">...</span>
            <button className="page-num-btn">8</button>
            <button className="page-nav-btn">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};
