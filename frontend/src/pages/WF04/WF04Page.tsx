import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  Eye,
  ThumbsUp,
  MessageSquare,
  Users,
  RotateCw,
  TrendingUp,
  BarChart2,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  Zap,
  ExternalLink,
} from 'lucide-react';
import {
  MOCK_VIEWS_TREND,
} from '../../mocks/performance';
import { useToast } from '../../components/common/Toast';
import './WF04Page.css';

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

export const WF04Page: React.FC = () => {
  const { showToast } = useToast();
  const [timePeriod, setTimePeriod] = useState('7_days');
  const [competitorFilter, setCompetitorFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('youtube');

  const topVideos = [
    {
      rank: 1,
      title: 'Xiaomi 18 Pro Max: Họ lại làm nên điều kỳ diệu!',
      competitor: 'Marques Brownlee',
      avatarBg: '#B45309',
      avatarText: 'MB',
      date: '08/10/2026',
      views: '1.2M',
      likes: '52K',
      comments: '3.4K',
      engagement: '4.6%',
      trendColor: '#10B981',
      trendPath: 'M0,15 Q15,12 30,8 T60,2',
      duration: '12:05',
    },
    {
      rank: 2,
      title: 'Câu chuyện 180 người người xa lạ cùng sống...',
      competitor: 'TED',
      avatarBg: '#E11D48',
      avatarText: 'TED',
      date: '07/10/2026',
      views: '892K',
      likes: '28K',
      comments: '2.1K',
      engagement: '3.4%',
      trendColor: '#2563EB',
      trendPath: 'M0,18 Q15,10 30,12 T60,4',
      duration: '12:05',
    },
    {
      rank: 3,
      title: 'Chúng tôi đang thử nghiệm lỗ đen...',
      competitor: 'Veritasium',
      avatarBg: '#2563EB',
      avatarText: 'Ve',
      date: '06/10/2026',
      views: '845K',
      likes: '42K',
      comments: '3.8K',
      engagement: '5.4%',
      trendColor: '#10B981',
      trendPath: 'M0,16 Q15,14 30,6 T60,1',
      duration: '12:05',
    },
    {
      rank: 4,
      title: 'Apple Watch gặp sự cố nghiêm trọng?',
      competitor: 'Marques Brownlee',
      avatarBg: '#B45309',
      avatarText: 'MB',
      date: '05/10/2026',
      views: '667K',
      likes: '18K',
      comments: '1.2K',
      engagement: '2.9%',
      trendColor: '#EF4444',
      trendPath: 'M0,4 Q15,6 30,14 T60,18',
      duration: '12:05',
    },
    {
      rank: 5,
      title: 'Cách sử dụng công nghệ để thay đổi thế giới',
      competitor: 'TED',
      avatarBg: '#E11D48',
      avatarText: 'TED',
      date: '04/10/2026',
      views: '521K',
      likes: '14K',
      comments: '980',
      engagement: '2.8%',
      trendColor: '#2563EB',
      trendPath: 'M0,16 Q15,12 30,11 T60,8',
      duration: '12:05',
    },
  ];

  const handleRefreshData = () => {
    showToast('Đang làm mới và đồng bộ các snapshot hiệu suất đối thủ...', 'info');
    setTimeout(() => {
      showToast('Đã cập nhật các chỉ số tương tác và xếp hạng mới nhất!', 'success');
    }, 1200);
  };

  return (
    <div className="wf04-page-container fade-in">
      <PageHeader
        title="WF04 - Phân tích hiệu suất đối thủ"
        subtitle="Đánh giá hiệu suất nội dung và so sánh đối thủ dựa trên các chỉ số tương tác, lượt xem và xu hướng."
        stepNumber={4}
      />

      {/* FILTER BAR */}
      <div className="wf04-top-filter-bar ui-card">
        <div className="filter-item-block">
          <label className="filter-block-label">Khoảng thời gian</label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="filter-select-input"
          >
            <option value="7_days">7 ngày qua</option>
            <option value="30_days">30 ngày qua</option>
            <option value="90_days">90 ngày qua</option>
          </select>
        </div>

        <div className="filter-item-block">
          <label className="filter-block-label">Đối thủ</label>
          <select
            value={competitorFilter}
            onChange={(e) => setCompetitorFilter(e.target.value)}
            className="filter-select-input"
          >
            <option value="all">Tất cả</option>
            <option value="mkbhd">Marques Brownlee</option>
            <option value="veritasium">Veritasium</option>
            <option value="ted">TED</option>
          </select>
        </div>

        <div className="filter-item-block">
          <label className="filter-block-label">Nền tảng</label>
          <div className="platform-select-wrap">
            <YoutubeIcon size={16} className="yt-red" />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="filter-select-input border-none"
            >
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-refresh-metrics"
          onClick={handleRefreshData}
        >
          <RotateCw size={14} />
          <span>Cập nhật dữ liệu</span>
        </button>
      </div>

      {/* KPI 4 CARDS */}
      <div className="wf04-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue">
            <Eye size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng lượt xem</span>
            <span className="kpi-number">16.8M</span>
            <span className="kpi-subtext positive">↗ +12.5% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green">
            <ThumbsUp size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng lượt thích</span>
            <span className="kpi-number">320K</span>
            <span className="kpi-subtext positive">↗ +8.3% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap purple">
            <MessageSquare size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng bình luận</span>
            <span className="kpi-number">18.4K</span>
            <span className="kpi-subtext positive">↗ +15.2% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap orange">
            <Users size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tỷ lệ tương tác</span>
            <span className="kpi-number">4.2%</span>
            <span className="kpi-subtext positive">↗ +2.1% so với tuần trước</span>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: 3 ANALYTICS CARDS */}
      <div className="wf04-middle-grid">
        {/* Card 1: Xu hướng lượt xem theo thời gian */}
        <div className="ui-card wf04-trend-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <TrendingUp size={16} className="text-primary" />
              <span>Xu hướng lượt xem theo thời gian</span>
            </div>

            <div className="chart-legend-row">
              <span className="legend-item">
                <span className="legend-dot blue" /> Marques Brownlee
              </span>
              <span className="legend-item">
                <span className="legend-dot green" /> Veritasium
              </span>
              <span className="legend-item">
                <span className="legend-dot red" /> TED
              </span>
            </div>
          </div>

          <div className="line-chart-container">
            <svg viewBox="0 0 520 220" className="trend-svg-chart">
              {/* Y Grid lines */}
              <line x1="40" y1="20" x2="510" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <text x="30" y="24" fill="#94A3B8" fontSize="10" textAnchor="end">20M</text>

              <line x1="40" y1="65" x2="510" y2="65" stroke="#F1F5F9" strokeWidth="1" />
              <text x="30" y="69" fill="#94A3B8" fontSize="10" textAnchor="end">15M</text>

              <line x1="40" y1="110" x2="510" y2="110" stroke="#F1F5F9" strokeWidth="1" />
              <text x="30" y="114" fill="#94A3B8" fontSize="10" textAnchor="end">10M</text>

              <line x1="40" y1="155" x2="510" y2="155" stroke="#F1F5F9" strokeWidth="1" />
              <text x="30" y="159" fill="#94A3B8" fontSize="10" textAnchor="end">5M</text>

              <line x1="40" y1="200" x2="510" y2="200" stroke="#E2E8F0" strokeWidth="1" />
              <text x="30" y="204" fill="#94A3B8" fontSize="10" textAnchor="end">0</text>

              {/* X Axis Labels */}
              {MOCK_VIEWS_TREND.map((pt, i) => {
                const x = 50 + i * 72;
                return (
                  <text key={i} x={x} y="215" fill="#64748B" fontSize="10" textAnchor="middle">
                    {pt.date}
                  </text>
                );
              })}

              {/* Marques Brownlee (Blue line) */}
              <polyline
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                points="50,140 122,120 194,95 266,78 338,62 410,48 482,32"
              />
              {/* Veritasium (Green line) */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                points="50,170 122,158 194,148 266,138 338,128 410,120 482,112"
              />
              {/* TED (Red line) */}
              <polyline
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                points="50,186 122,180 194,175 266,170 338,165 410,160 482,155"
              />

              {/* Data points (circles) */}
              <circle cx="50" cy="140" r="3.5" fill="#2563EB" />
              <circle cx="122" cy="120" r="3.5" fill="#2563EB" />
              <circle cx="194" cy="95" r="3.5" fill="#2563EB" />
              <circle cx="266" cy="78" r="3.5" fill="#2563EB" />
              <circle cx="338" cy="62" r="3.5" fill="#2563EB" />
              <circle cx="410" cy="48" r="3.5" fill="#2563EB" />
              <circle cx="482" cy="32" r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />

              <circle cx="482" cy="112" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="482" cy="155" r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Card 2: So sánh hiệu suất đối thủ */}
        <div className="ui-card wf04-compare-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <BarChart2 size={16} className="text-primary" />
              <span>So sánh hiệu suất đối thủ</span>
            </div>

            <div className="chart-legend-row">
              <span className="legend-item"><span className="legend-dot blue" /> Lượt xem</span>
              <span className="legend-item"><span className="legend-dot green" /> Lượt thích</span>
              <span className="legend-item"><span className="legend-dot purple" /> Bình luận</span>
            </div>
          </div>

          <div className="horizontal-bars-container">
            {/* Marques Brownlee */}
            <div className="comp-bar-row">
              <span className="comp-bar-name">Marques Brownlee</span>
              <div className="bars-stack">
                <div className="bar-line blue" style={{ width: '95%' }}>
                  <span className="bar-tag">16.8M</span>
                </div>
                <div className="bar-line green" style={{ width: '52%' }}>
                  <span className="bar-tag">320K</span>
                </div>
                <div className="bar-line purple" style={{ width: '28%' }}>
                  <span className="bar-tag">18.4K</span>
                </div>
              </div>
            </div>

            {/* Veritasium */}
            <div className="comp-bar-row">
              <span className="comp-bar-name">Veritasium</span>
              <div className="bars-stack">
                <div className="bar-line blue" style={{ width: '60%' }}>
                  <span className="bar-tag">8.7M</span>
                </div>
                <div className="bar-line green" style={{ width: '38%' }}>
                  <span className="bar-tag">180K</span>
                </div>
                <div className="bar-line purple" style={{ width: '18%' }}>
                  <span className="bar-tag">9.2K</span>
                </div>
              </div>
            </div>

            {/* TED */}
            <div className="comp-bar-row">
              <span className="comp-bar-name">TED</span>
              <div className="bars-stack">
                <div className="bar-line blue" style={{ width: '35%' }}>
                  <span className="bar-tag">4.2M</span>
                </div>
                <div className="bar-line green" style={{ width: '22%' }}>
                  <span className="bar-tag">95K</span>
                </div>
                <div className="bar-line purple" style={{ width: '12%' }}>
                  <span className="bar-tag">5.1K</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Nhận xét & Insight */}
        <div className="ui-card wf04-insight-card">
          <div className="card-section-title">
            <Lightbulb size={16} className="text-primary" />
            <span>Nhận xét & Insight</span>
          </div>

          <div className="insight-cards-stack">
            <div className="insight-item-box">
              <div className="insight-top">
                <div className="insight-avatar-circle green">
                  <CheckCircle2 size={16} />
                </div>
                <span className="insight-name">Marques Brownlee</span>
              </div>
              <p className="insight-desc">
                Hiệu suất cao nhất với 16.8M lượt xem. Tăng trưởng ổn định +12.5% so với tuần trước.
              </p>
            </div>

            <div className="insight-item-box">
              <div className="insight-top">
                <div className="insight-avatar-circle blue">
                  <Sparkles size={16} />
                </div>
                <span className="insight-name">Veritasium</span>
              </div>
              <p className="insight-desc">
                Hiệu suất trung bình với 8.7M lượt xem. Nội dung giáo dục có tỷ lệ tương tác tốt.
              </p>
            </div>

            <div className="insight-item-box">
              <div className="insight-top">
                <div className="insight-avatar-circle purple">
                  <Zap size={16} />
                </div>
                <span className="insight-name">TED</span>
              </div>
              <p className="insight-desc">
                Hiệu suất thấp hơn nhưng ổn định. Nội dung dài có tỷ lệ giữ chân người xem cao.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Top video hiệu suất cao */}
      <div className="ui-card wf04-top-videos-card">
        <div className="card-section-title">
          <TrendingUp size={18} className="text-primary" />
          <span>Top video hiệu suất cao</span>
        </div>

        <div className="table-responsive-wrap">
          <table className="top-videos-table">
            <thead>
              <tr>
                <th style={{ width: '32px' }}>#</th>
                <th style={{ width: '70px' }}>Thumbnail</th>
                <th>Tiêu đề</th>
                <th>Đối thủ</th>
                <th>Ngày đăng</th>
                <th>Lượt xem</th>
                <th>Lượt thích</th>
                <th>Bình luận</th>
                <th>Tỷ lệ tương tác</th>
                <th>Xu hướng</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {topVideos.map((vid) => (
                <tr key={vid.rank}>
                  <td className="font-semibold text-muted-cell">{vid.rank}</td>
                  <td>
                    <div className="video-thumb-mini dark">
                      <span className="duration-tag">{vid.duration}</span>
                    </div>
                  </td>
                  <td>
                    <span className="top-video-title">{vid.title}</span>
                  </td>
                  <td>
                    <div className="comp-mini-cell">
                      <div
                        className="comp-mini-avatar"
                        style={{ backgroundColor: vid.avatarBg }}
                      >
                        {vid.avatarText}
                      </div>
                      <span className="comp-mini-name">{vid.competitor}</span>
                    </div>
                  </td>
                  <td className="text-muted-cell">{vid.date}</td>
                  <td className="font-bold">{vid.views}</td>
                  <td className="font-semibold">{vid.likes}</td>
                  <td className="text-muted-cell">{vid.comments}</td>
                  <td className="font-bold text-primary">{vid.engagement}</td>
                  <td>
                    <svg width="60" height="20" className="sparkline-svg">
                      <path
                        d={vid.trendPath}
                        fill="none"
                        stroke={vid.trendColor}
                        strokeWidth="2"
                      />
                    </svg>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        type="button"
                        className="action-icon-btn view"
                        title="Xem chi tiết"
                        onClick={() => showToast(`Xem chi tiết: ${vid.title}`, 'info')}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        className="action-icon-btn more"
                        title="Mở YouTube"
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
      </div>
    </div>
  );
};
