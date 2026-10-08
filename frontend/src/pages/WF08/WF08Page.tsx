import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  BarChart2,
  Target,
  Calendar,
  TrendingUp,
  PieChart,
  Search,
  Eye,
  ExternalLink,
  Flame,
} from 'lucide-react';
import {
  INITIAL_FORECASTS,
  type VideoForecastItem,
} from '../../mocks/forecasts';
import './WF08Page.css';

const YoutubeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const WF08Page: React.FC = () => {
  const [forecasts] = useState<VideoForecastItem[]>(INITIAL_FORECASTS);
  const [selectedVideoId, setSelectedVideoId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'perf' | 'ai' | 'factors'>('perf');

  const selectedVideo = forecasts.find((f) => f.id === selectedVideoId) || forecasts[0];

  const compForecasts = [
    { name: 'Marques Brownlee', cur: '1.2M', next: '1.8M (+50%)', curW: 60, nextW: 90 },
    { name: 'Veritasium', cur: '850K', next: '1.3M (+53%)', curW: 42, nextW: 65 },
    { name: 'TED', cur: '520K', next: '780K (+50%)', curW: 26, nextW: 39 },
    { name: 'MrBeast', cur: '2.1M', next: '3.2M (+52%)', curW: 75, nextW: 100 },
    { name: 'Others', cur: '430K', next: '680K (+58%)', curW: 22, nextW: 34 },
  ];

  return (
    <div className="wf08-page-container fade-in">
      <PageHeader
        title="WF08 - Dự báo hiệu suất"
        subtitle="Sử dụng AI để dự báo hiệu suất video trong tương lai, hỗ trợ lập kế hoạch nội dung hiệu quả."
        stepNumber={8}
      />

      {/* TOP ROW: 4 KPI CARDS */}
      <div className="wf08-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap purple">
            <BarChart2 size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng video dự báo</span>
            <span className="kpi-number">320</span>
            <span className="kpi-subtext positive">↗ +25.0% so với tháng trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green">
            <Target size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Độ chính xác dự báo (MAPE)</span>
            <span className="kpi-number">87.5%</span>
            <span className="kpi-subtext positive">↗ +5.2% so với tháng trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap red">
            <BarChart2 size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Video tiềm năng cao</span>
            <span className="kpi-number">96</span>
            <span className="kpi-subtext positive">↗ +33.3% so với tháng trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue">
            <Calendar size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Thời gian dự báo</span>
            <span className="kpi-number">7 ngày</span>
            <span className="kpi-subtext neutral">Cập nhật hàng ngày</span>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: 3 CARDS */}
      <div className="wf08-middle-grid">
        {/* Card 1: Dự báo 30 ngày (Line Chart) */}
        <div className="ui-card wf08-line-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <TrendingUp size={16} className="text-primary" />
              <span>Dự báo lượt xem trong 30 ngày tới</span>
            </div>
            <div className="chart-legend-row">
              <span className="legend-item"><span className="legend-dot blue" /> Lượt xem thực tế</span>
              <span className="legend-item"><span className="legend-dot dashed-green" /> Lượt xem dự báo</span>
            </div>
          </div>

          <div className="chart-svg-wrap">
            <svg viewBox="0 0 500 180" className="trend-svg-chart">
              <line x1="30" y1="15" x2="480" y2="15" stroke="#F1F5F9" />
              <text x="24" y="19" fill="#94A3B8" fontSize="9" textAnchor="end">200K</text>
              <line x1="30" y1="55" x2="480" y2="55" stroke="#F1F5F9" />
              <text x="24" y="59" fill="#94A3B8" fontSize="9" textAnchor="end">150K</text>
              <line x1="30" y1="95" x2="480" y2="95" stroke="#F1F5F9" />
              <text x="24" y="99" fill="#94A3B8" fontSize="9" textAnchor="end">100K</text>
              <line x1="30" y1="135" x2="480" y2="135" stroke="#F1F5F9" />
              <text x="24" y="139" fill="#94A3B8" fontSize="9" textAnchor="end">50K</text>
              <line x1="30" y1="165" x2="480" y2="165" stroke="#E2E8F0" />
              <text x="24" y="169" fill="#94A3B8" fontSize="9" textAnchor="end">0</text>

              {['02/10', '07/10', '12/10', '17/10', '22/10', '27/10', '01/11'].map((d, i) => (
                <text key={i} x={45 + i * 68} y="176" fill="#64748B" fontSize="9" textAnchor="middle">
                  {d}
                </text>
              ))}

              {/* Confidence interval area in light green */}
              <polygon
                points="317,100 385,82 453,60 453,92 385,110 317,100"
                fill="rgba(16, 185, 129, 0.12)"
              />

              {/* Actual solid blue line */}
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                points="45,150 113,142 181,130 249,124 317,100"
              />
              {/* Forecast dashed green line */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                points="317,100 385,88 453,74"
              />

              <circle cx="45" cy="150" r="3" fill="#2563EB" />
              <circle cx="113" cy="142" r="3" fill="#2563EB" />
              <circle cx="181" cy="130" r="3" fill="#2563EB" />
              <circle cx="249" cy="124" r="3" fill="#2563EB" />
              <circle cx="317" cy="100" r="4" fill="#2563EB" stroke="#FFF" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Card 2: So sánh theo đối thủ (Bars) */}
        <div className="ui-card wf08-compare-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <BarChart2 size={16} className="text-primary" />
              <span>So sánh dự báo theo đối thủ</span>
            </div>
            <div className="chart-legend-row">
              <span className="legend-item"><span className="legend-dot blue" /> Lượt xem hiện tại</span>
              <span className="legend-item"><span className="legend-dot green" /> Dự báo 30 ngày</span>
            </div>
          </div>

          <div className="comp-bars-list">
            {compForecasts.map((c, idx) => (
              <div key={idx} className="comp-dual-bar">
                <span className="comp-d-name">{c.name}</span>
                <div className="d-bar-container">
                  <div className="bar-track-h">
                    <div className="bar-h-fill blue" style={{ width: `${c.curW}%` }} />
                    <span className="bar-h-lbl">{c.cur}</span>
                  </div>
                  <div className="bar-track-h">
                    <div className="bar-h-fill green" style={{ width: `${c.nextW}%` }} />
                    <span className="bar-h-lbl">{c.next}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Phân loại tiềm năng video (Donut) */}
        <div className="ui-card wf08-donut-card">
          <div className="card-section-title">
            <PieChart size={16} className="text-primary" />
            <span>Phân loại tiềm năng video</span>
          </div>

          <div className="donut-content-row">
            <div className="donut-svg-wrap">
              <svg viewBox="0 0 160 160" className="donut-svg">
                <circle cx="80" cy="80" r="56" fill="none" stroke="#EF4444" strokeWidth="24" strokeDasharray="113 377" strokeDashoffset="0" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#F59E0B" strokeWidth="24" strokeDasharray="132 377" strokeDashoffset="-113" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#2563EB" strokeWidth="24" strokeDasharray="94 377" strokeDashoffset="-245" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#10B981" strokeWidth="24" strokeDasharray="38 377" strokeDashoffset="-339" />
              </svg>
              <div className="donut-center-label">
                <span className="donut-center-number">320</span>
                <span className="donut-center-sub">video dự báo</span>
              </div>
            </div>

            <div className="donut-legend-stack">
              <div className="donut-legend-item"><span className="legend-dot red" /><div className="legend-meta"><span className="legend-name">Rất cao</span><span className="legend-val">96 (30.0%)</span></div></div>
              <div className="donut-legend-item"><span className="legend-dot orange" /><div className="legend-meta"><span className="legend-name">Cao</span><span className="legend-val">112 (35.0%)</span></div></div>
              <div className="donut-legend-item"><span className="legend-dot blue" /><div className="legend-meta"><span className="legend-name">Trung bình</span><span className="legend-val">80 (25.0%)</span></div></div>
              <div className="donut-legend-item"><span className="legend-dot green" /><div className="legend-meta"><span className="legend-name">Thấp</span><span className="legend-val">32 (10.0%)</span></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 2 COLUMNS */}
      <div className="wf08-bottom-grid">
        {/* Left Column: Table */}
        <div className="ui-card wf08-table-card">
          <div className="table-card-header">
            <div className="card-section-title">
              <BarChart2 size={18} className="text-primary" />
              <span>Danh sách video dự báo</span>
            </div>

            <div className="table-filters-row">
              <div className="search-input-wrap">
                <Search size={14} className="search-icon" />
                <input type="text" placeholder="Tìm kiếm video, tiêu đề..." className="table-search-input" />
              </div>

              <select className="table-select"><option>Đối thủ: Tất cả</option></select>
              <select className="table-select"><option>Nền tảng: Tất cả</option></select>
              <select className="table-select"><option>Mức tiềm năng: Tất cả</option></select>
            </div>
          </div>

          <div className="table-responsive-wrap">
            <table className="forecast-table">
              <thead>
                <tr>
                  <th style={{ width: '32px' }}>#</th>
                  <th style={{ width: '60px' }}>Thumbnail</th>
                  <th>Tiêu đề</th>
                  <th>Đối thủ</th>
                  <th>Nền tảng</th>
                  <th>Lượt xem hiện tại</th>
                  <th>Dự báo 7 ngày</th>
                  <th>Dự báo 30 ngày</th>
                  <th>Mức tiềm năng</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {forecasts.map((row, idx) => {
                  const isCurrent = row.id === selectedVideo.id;
                  return (
                    <tr
                      key={row.id}
                      className={`f-row ${isCurrent ? 'row-active' : ''}`}
                      onClick={() => setSelectedVideoId(row.id)}
                    >
                      <td className="text-muted-cell font-semibold">{idx + 1}</td>
                      <td>
                        <div className="f-thumb-box" style={{ background: row.gradient }}>
                          <span className="f-dur">{row.duration}</span>
                        </div>
                      </td>
                      <td><span className="f-title-txt">{row.title}</span></td>
                      <td>
                        <div className="comp-mini-cell">
                          <span className="comp-mini-name">{row.competitor}</span>
                        </div>
                      </td>
                      <td><YoutubeIcon size={14} className="yt-red" /></td>
                      <td className="font-semibold">{row.currentViews}</td>
                      <td className="text-success font-semibold">{row.forecast7d}</td>
                      <td className="text-primary font-bold">{row.forecast30d}</td>
                      <td>
                        <span className={`badge-pot ${row.potential.toLowerCase().replace(' ', '-')}`}>
                          {row.potential}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          <button type="button" className="action-icon-btn view"><Eye size={14} /></button>
                          <button type="button" className="action-icon-btn more"><ExternalLink size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="table-pagination-footer">
            <span className="pagination-info">Hiển thị 1 - 5 của 320 video</span>
            <div className="pagination-nav">
              <button className="page-nav-btn">&lt;</button>
              <button className="page-num-btn active">1</button>
              <button className="page-num-btn">2</button>
              <button className="page-num-btn">3</button>
              <button className="page-num-btn">4</button>
              <button className="page-num-btn">5</button>
              <span className="page-dots">...</span>
              <button className="page-num-btn">64</button>
              <button className="page-nav-btn">&gt;</button>
            </div>
          </div>
        </div>

        {/* Right Column: Detail Panel */}
        <div className="ui-card wf08-detail-card">
          <div className="card-section-title">
            <TrendingUp size={18} className="text-primary" />
            <span>Chi tiết dự báo</span>
          </div>

          <div className="f-detail-hero">
            <div className="f-hero-thumb" style={{ background: selectedVideo.gradient }}>
              <div className="play-circle-center"><div className="play-triangle" /></div>
              <span className="f-hero-dur">{selectedVideo.duration}</span>
            </div>

            <div className="f-hero-meta">
              <h4 className="f-hero-title">{selectedVideo.title}</h4>
              <span className="f-hero-author">{selectedVideo.competitor}</span>
            </div>
          </div>

          <div className="detail-tabs-nav">
            <button className={`detail-tab-btn ${activeTab === 'perf' ? 'active' : ''}`} onClick={() => setActiveTab('perf')}>
              Dự báo hiệu suất
            </button>
            <button className={`detail-tab-btn ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
              Phân tích AI
            </button>
            <button className={`detail-tab-btn ${activeTab === 'factors' ? 'active' : ''}`} onClick={() => setActiveTab('factors')}>
              Yếu tố ảnh hưởng
            </button>
          </div>

          <div className="f-forecast-numbers-box">
            <h5 className="f-box-title">Dự báo lượt xem</h5>
            <div className="f-num-row">
              <span className="f-num-lbl">📅 7 ngày tới:</span>
              <span className="f-num-val font-bold">1.4M <span className="text-success">(+17%)</span></span>
            </div>
            <div className="f-num-row">
              <span className="f-num-lbl">📅 30 ngày tới:</span>
              <span className="f-num-val font-bold">1.8M <span className="text-success">(+50%)</span></span>
            </div>
            <div className="f-num-row">
              <span className="f-num-lbl">📅 90 ngày tới:</span>
              <span className="f-num-val font-bold">2.6M <span className="text-success">(+117%)</span></span>
            </div>
          </div>

          <div className="f-potential-note-box">
            <div className="pot-note-header">
              <div className="pot-title-group">
                <Flame size={16} className="text-danger" />
                <span className="pot-title-text">Mức tiềm năng</span>
              </div>
              <span className="badge-pot rất-cao">Rất cao</span>
            </div>
            <p className="pot-desc">
              Video có tiềm năng đạt hiệu suất cao hơn 50% so với mức trung bình của kênh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
