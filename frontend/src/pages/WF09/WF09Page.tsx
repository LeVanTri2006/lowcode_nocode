import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  FileText,
  Mail,
  Clock,
  Users,
  Calendar,
  BarChart2,
  PieChart,
  Search,
  Eye,
  Download,
  MoreVertical,
  Plus,
} from 'lucide-react';
import { INITIAL_REPORTS, type AutoReportItem } from '../../mocks/reports';
import { useToast } from '../../components/common/Toast';
import './WF09Page.css';

const YoutubeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const WF09Page: React.FC = () => {
  const { showToast } = useToast();
  const [reports] = useState<AutoReportItem[]>(INITIAL_REPORTS);
  const [selectedDay] = useState(8);

  const dailySchedule = [
    { name: 'Báo cáo tuần - YouTube', time: '09:00', status: 'Đã gửi', type: 'yt' },
    { name: 'Báo cáo tuần - TikTok', time: '09:00', status: 'Đã gửi', type: 'tt' },
    { name: 'Báo cáo tuần - Facebook', time: '09:00', status: 'Đã gửi', type: 'fb' },
    { name: 'Báo cáo tổng hợp thị trường', time: '14:00', status: 'Đang tạo', type: 'mk' },
    { name: 'Báo cáo cơ hội nội dung', time: '16:00', status: 'Chờ gửi', type: 'id' },
  ];

  const templates = [
    { name: 'Mẫu báo cáo tuần - YouTube', icon: 'yt' },
    { name: 'Mẫu báo cáo tuần - TikTok', icon: 'tt' },
    { name: 'Mẫu báo cáo tuần - Facebook', icon: 'fb' },
    { name: 'Mẫu báo cáo tổng hợp thị trường', icon: 'mk' },
    { name: 'Mẫu báo cáo cơ hội nội dung', icon: 'id' },
  ];

  const handleCreateReport = () => {
    showToast('Mở trình tạo báo cáo tự động mới...', 'info');
  };

  return (
    <div className="wf09-page-container fade-in">
      <PageHeader
        title="WF09 - Báo cáo tự động"
        subtitle="Tạo và gửi báo cáo định kỳ về đối thủ, thị trường và cơ hội nội dung thông qua email, Google Drive và các kênh khác."
        stepNumber={9}
      />

      {/* TOP ROW: 4 KPI CARDS */}
      <div className="wf09-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue"><FileText size={22} /></div>
          <div className="kpi-details">
            <span className="kpi-label">Báo cáo đã tạo</span>
            <span className="kpi-number">36</span>
            <span className="kpi-subtext positive">↗ +28.6% so với tháng trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue"><Mail size={22} /></div>
          <div className="kpi-details">
            <span className="kpi-label">Báo cáo đã gửi</span>
            <span className="kpi-number">36</span>
            <span className="kpi-subtext positive">↗ +28.6% so với tháng trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap orange"><Clock size={22} /></div>
          <div className="kpi-details">
            <span className="kpi-label">Tỷ lệ gửi thành công</span>
            <span className="kpi-number">97.2%</span>
            <span className="kpi-subtext positive">↗ +2.1% so với tháng trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap purple"><Users size={22} /></div>
          <div className="kpi-details">
            <span className="kpi-label">Người nhận</span>
            <span className="kpi-number">12</span>
            <span className="kpi-subtext positive">↗ +20.0% so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: 2 CARDS */}
      <div className="wf09-middle-grid">
        {/* Left: Lịch tạo và gửi báo cáo */}
        <div className="ui-card wf09-calendar-card">
          <div className="card-section-title">
            <Calendar size={16} className="text-primary" />
            <span>Lịch tạo và gửi báo cáo</span>
          </div>

          <div className="calendar-split-row">
            {/* Calendar widget */}
            <div className="mini-calendar-widget">
              <div className="cal-header">
                <span className="cal-month-title">Tháng 10, 2026</span>
                <div className="cal-nav-btns">
                  <button type="button" className="cal-nav-btn">&lt;</button>
                  <button type="button" className="cal-nav-btn">&gt;</button>
                </div>
              </div>
              <div className="cal-days-grid">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
                  <span key={d} className="cal-weekday">{d}</span>
                ))}
                {/* 31 days */}
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isCur = day === selectedDay;
                  return (
                    <button
                      key={day}
                      type="button"
                      className={`cal-day-cell ${isCur ? 'active-day' : ''}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily Schedule List */}
            <div className="daily-schedule-list">
              <div className="sched-header-title">Báo cáo trong ngày 08/10/2026</div>
              <div className="sched-items-stack">
                {dailySchedule.map((item, idx) => (
                  <div key={idx} className="sched-item-row">
                    <div className="sched-left">
                      {item.type === 'yt' && <YoutubeIcon size={14} className="yt-red" />}
                      {item.type === 'tt' && <span className="tt-icon">🎵</span>}
                      {item.type === 'fb' && <span className="fb-icon">🔵</span>}
                      {item.type === 'mk' && <BarChart2 size={13} className="text-primary" />}
                      {item.type === 'id' && <span className="id-icon">💡</span>}
                      <span className="sched-name">{item.name}</span>
                    </div>
                    <span className="sched-time">{item.time}</span>
                    <span className={`badge-sched ${item.status === 'Đã gửi' ? 'sent' : item.status === 'Đang tạo' ? 'creating' : 'waiting'}`}>
                      ● {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Thống kê báo cáo (Grouped Bars) */}
        <div className="ui-card wf09-stats-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <BarChart2 size={16} className="text-primary" />
              <span>Thống kê báo cáo</span>
            </div>
            <select className="period-select-sm"><option>30 ngày qua</option></select>
          </div>

          <div className="chart-legend-row">
            <span className="legend-item"><span className="legend-dot blue" /> Báo cáo đã tạo</span>
            <span className="legend-item"><span className="legend-dot green" /> Báo cáo đã gửi</span>
          </div>

          <div className="chart-svg-wrap">
            <svg viewBox="0 0 480 180" className="report-bars-svg">
              <line x1="30" y1="15" x2="460" y2="15" stroke="#F1F5F9" />
              <text x="22" y="19" fill="#94A3B8" fontSize="9" textAnchor="end">10</text>
              <line x1="30" y1="45" x2="460" y2="45" stroke="#F1F5F9" />
              <text x="22" y="49" fill="#94A3B8" fontSize="9" textAnchor="end">8</text>
              <line x1="30" y1="75" x2="460" y2="75" stroke="#F1F5F9" />
              <text x="22" y="79" fill="#94A3B8" fontSize="9" textAnchor="end">6</text>
              <line x1="30" y1="105" x2="460" y2="105" stroke="#F1F5F9" />
              <text x="22" y="109" fill="#94A3B8" fontSize="9" textAnchor="end">4</text>
              <line x1="30" y1="135" x2="460" y2="135" stroke="#F1F5F9" />
              <text x="22" y="139" fill="#94A3B8" fontSize="9" textAnchor="end">2</text>
              <line x1="30" y1="165" x2="460" y2="165" stroke="#E2E8F0" />
              <text x="22" y="169" fill="#94A3B8" fontSize="9" textAnchor="end">0</text>

              {['02/10', '05/10', '08/10', '11/10', '14/10', '17/10', '20/10', '23/10', '26/10', '29/10'].map((d, i) => (
                <text key={i} x={45 + i * 44} y="176" fill="#64748B" fontSize="9" textAnchor="middle">
                  {d}
                </text>
              ))}

              {/* Grouped bar columns growing over time */}
              {[1, 2, 2, 3, 4, 5, 6, 7, 8, 9].map((val, idx) => {
                const x = 38 + idx * 44;
                const h = val * 15;
                const y = 165 - h;
                return (
                  <g key={idx}>
                    <rect x={x} y={y} width="5" height={h} fill="#2563EB" rx="1" />
                    <rect x={x + 7} y={y} width="5" height={h} fill="#10B981" rx="1" />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 2 COLUMNS */}
      <div className="wf09-bottom-grid">
        {/* Left: Table */}
        <div className="ui-card wf09-table-card">
          <div className="table-card-header">
            <div className="card-section-title">
              <FileText size={18} className="text-primary" />
              <span>Danh sách báo cáo gần đây</span>
            </div>

            <div className="table-filters-row">
              <select className="table-select"><option>Loại báo cáo: Tất cả</option></select>
              <select className="table-select"><option>Nền tảng: Tất cả</option></select>
              <select className="table-select"><option>Trạng thái: Tất cả</option></select>
              <div className="search-input-wrap">
                <Search size={14} className="search-icon" />
                <input type="text" placeholder="Tìm kiếm báo cáo..." className="table-search-input" />
              </div>
            </div>
          </div>

          <div className="table-responsive-wrap">
            <table className="reports-table">
              <thead>
                <tr>
                  <th style={{ width: '28px' }}>#</th>
                  <th>Tên báo cáo</th>
                  <th>Loại báo cáo</th>
                  <th>Nền tảng</th>
                  <th>Thời gian tạo</th>
                  <th>Trạng thái</th>
                  <th>Người nhận</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={r.id}>
                    <td className="text-muted-cell font-semibold">{i + 1}</td>
                    <td className="font-semibold">{r.name}</td>
                    <td className="text-muted-cell">{r.reportType}</td>
                    <td>
                      {r.platform === 'YouTube' && <span className="platform-tag"><YoutubeIcon size={13} className="yt-red" /> YouTube</span>}
                      {r.platform === 'TikTok' && <span className="platform-tag">🎵 TikTok</span>}
                      {r.platform === 'Facebook' && <span className="platform-tag">🔵 Facebook</span>}
                      {r.platform === 'Tổng hợp' && <span className="platform-tag">📊 Tổng hợp</span>}
                      {r.platform === 'Ý tưởng' && <span className="platform-tag">💡 Ý tưởng</span>}
                    </td>
                    <td className="text-muted-cell">{r.createdAt}</td>
                    <td>
                      <span className={`badge-sched ${r.status === 'Đã gửi' ? 'sent' : 'creating'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="text-muted-cell">{r.recipientsCount} người</td>
                    <td>
                      <div className="table-actions-cell">
                        <button type="button" className="action-icon-btn view" title="Xem báo cáo"><Eye size={14} /></button>
                        <button type="button" className="action-icon-btn edit" title="Tải về"><Download size={14} /></button>
                        <button type="button" className="action-icon-btn more"><MoreVertical size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-pagination-footer">
            <span className="pagination-info">Hiển thị 1 - 5 của 36 báo cáo</span>
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

        {/* Right: Stacked Cards (Channels & Templates) */}
        <div className="wf09-right-stack">
          {/* Channels Donut */}
          <div className="ui-card wf09-channels-card">
            <div className="card-section-title">
              <PieChart size={16} className="text-primary" />
              <span>Kênh gửi báo cáo</span>
            </div>

            <div className="donut-content-row">
              <div className="donut-svg-wrap">
                <svg viewBox="0 0 160 160" className="donut-svg">
                  <circle cx="80" cy="80" r="56" fill="none" stroke="#2563EB" strokeWidth="24" strokeDasharray="272 377" strokeDashoffset="0" />
                  <circle cx="80" cy="80" r="56" fill="none" stroke="#10B981" strokeWidth="24" strokeDasharray="63 377" strokeDashoffset="-272" />
                  <circle cx="80" cy="80" r="56" fill="none" stroke="#8B5CF6" strokeWidth="24" strokeDasharray="31 377" strokeDashoffset="-335" />
                  <circle cx="80" cy="80" r="56" fill="none" stroke="#F59E0B" strokeWidth="24" strokeDasharray="11 377" strokeDashoffset="-366" />
                </svg>
                <div className="donut-center-label">
                  <span className="donut-center-number">36</span>
                  <span className="donut-center-sub">báo cáo</span>
                </div>
              </div>

              <div className="donut-legend-stack">
                <div className="donut-legend-item"><span className="legend-dot blue" /><div className="legend-meta"><span className="legend-name">Email</span><span className="legend-val">26 (72.2%)</span></div></div>
                <div className="donut-legend-item"><span className="legend-dot green" /><div className="legend-meta"><span className="legend-name">Google Drive</span><span className="legend-val">6 (16.7%)</span></div></div>
                <div className="donut-legend-item"><span className="legend-dot purple" /><div className="legend-meta"><span className="legend-name">Slack</span><span className="legend-val">3 (8.3%)</span></div></div>
                <div className="donut-legend-item"><span className="legend-dot orange" /><div className="legend-meta"><span className="legend-name">Khác</span><span className="legend-val">1 (2.8%)</span></div></div>
              </div>
            </div>
          </div>

          {/* Templates List */}
          <div className="ui-card wf09-templates-card">
            <div className="templates-header">
              <div className="card-section-title">
                <FileText size={16} className="text-primary" />
                <span>Mẫu báo cáo</span>
              </div>
              <button type="button" className="btn btn-primary btn-new-tpl" onClick={handleCreateReport}>
                <Plus size={13} /> Tạo báo cáo mới
              </button>
            </div>

            <div className="templates-items-stack">
              {templates.map((tpl, i) => (
                <div key={i} className="template-item-row">
                  <div className="tpl-left">
                    {tpl.icon === 'yt' && <YoutubeIcon size={14} className="yt-red" />}
                    {tpl.icon === 'tt' && <span className="tt-icon">🎵</span>}
                    {tpl.icon === 'fb' && <span className="fb-icon">🔵</span>}
                    {tpl.icon === 'mk' && <BarChart2 size={13} className="text-primary" />}
                    {tpl.icon === 'id' && <span className="id-icon">💡</span>}
                    <span className="tpl-name">{tpl.name}</span>
                  </div>
                  <div className="tpl-actions">
                    <button type="button" className="tpl-btn customize">Tùy chỉnh</button>
                    <button type="button" className="tpl-btn download" title="Tải mẫu"><Download size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
