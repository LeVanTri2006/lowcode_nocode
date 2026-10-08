import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  Play,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Calendar,
  ChevronDown,
  TrendingUp,
  PieChart,
  Trophy,
  Flame,
  Hash,
  Lightbulb,
  Bot,
  ArrowUpRight,
} from 'lucide-react';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const topVideos = [
    {
      id: 1,
      title: 'Xiaomi 18 Pro Max: Họ lại làm nên điều kỳ diệu!',
      comp: 'Marques Brownlee',
      views: '1.4M',
      likes: '92K',
      comments: '8.5K',
      dur: '12:05',
      bg: 'linear-gradient(135deg, #1e293b, #334155)',
    },
    {
      id: 2,
      title: 'The future of AI and humanity',
      comp: 'TED',
      views: '1.1M',
      likes: '68K',
      comments: '6.2K',
      dur: '10:18',
      bg: 'linear-gradient(135deg, #18181b, #27272a)',
    },
    {
      id: 3,
      title: 'Chúng tôi đang thử nghiệm lỗ đen...',
      comp: 'Veritasium',
      views: '850K',
      likes: '52K',
      comments: '4.1K',
      dur: '08:32',
      bg: 'linear-gradient(135deg, #451a03, #78350f)',
    },
    {
      id: 4,
      title: 'Apple Watch gặp sự cố nghiêm trọng?',
      comp: 'Marques Brownlee',
      views: '780K',
      likes: '48K',
      comments: '3.9K',
      dur: '14:25',
      bg: 'linear-gradient(135deg, #172554, #1e3a8a)',
    },
    {
      id: 5,
      title: 'Cách sử dụng công nghệ để thay đổi thế giới',
      comp: 'TED',
      views: '610K',
      likes: '37K',
      comments: '2.8K',
      dur: '11:03',
      bg: 'linear-gradient(135deg, #042f2e, #134e4a)',
    },
  ];

  const topTopics = [
    { rank: 1, name: 'AI & Technology', count: '320 video', growth: '+45%' },
    { rank: 2, name: 'Smart Home', count: '256 video', growth: '+38%' },
    { rank: 3, name: 'Du lịch & Khám phá', count: '198 video', growth: '+32%' },
    { rank: 4, name: 'Kinh nghiệm du lịch', count: '175 video', growth: '+28%' },
    { rank: 5, name: 'Ẩm thực', count: '142 video', growth: '+24%' },
  ];

  const topOpportunities = [
    { rank: 1, name: 'Review công nghệ mới', barW: 85, level: 'Cao', color: '#EF4444' },
    { rank: 2, name: 'Hướng dẫn du lịch chi tiết', barW: 75, level: 'Cao', color: '#EF4444' },
    { rank: 3, name: 'Ẩm thực địa phương', barW: 60, level: 'Trung bình', color: '#F59E0B' },
    { rank: 4, name: 'So sánh sản phẩm', barW: 55, level: 'Trung bình', color: '#F59E0B' },
    { rank: 5, name: 'Xu hướng AI mới', barW: 40, level: 'Thấp', color: '#10B981' },
  ];

  const topComps = [
    { rank: 1, name: 'MrBeast', views: '3.2M', width: 95, color: '#2563EB', bg: '#0284C7' },
    { rank: 2, name: 'Marques Brownlee', views: '1.8M', width: 68, color: '#10B981', bg: '#B45309' },
    { rank: 3, name: 'Veritasium', views: '1.3M', width: 50, color: '#EF4444', bg: '#2563EB' },
    { rank: 4, name: 'TED', views: '780K', width: 32, color: '#F59E0B', bg: '#E11D48' },
    { rank: 5, name: 'Kurzgesagt', views: '520K', width: 22, color: '#8B5CF6', bg: '#0F172A' },
  ];

  return (
    <div className="dashboard-page-container fade-in">
      <PageHeader
        title="Tổng quan - Bảng điều khiển tổng hợp"
        subtitle="Tổng hợp toàn bộ phân tích, xu hướng, cơ hội và hiệu suất từ WF01 - WF09."
        showStepper={true}
        actions={
          <button type="button" className="btn-date-picker-overview">
            <Calendar size={14} className="text-muted" />
            <span>02/10/2026 - 08/10/2026</span>
            <ChevronDown size={14} className="text-muted" />
          </button>
        }
      />

      {/* TOP ROW: 5 KPI CARDS */}
      <div className="overview-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue">
            <Play size={22} fill="#2563EB" />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng video</span>
            <span className="kpi-number">1,254</span>
            <span className="kpi-subtext positive">↗ +18.5% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green">
            <Eye size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng lượt xem</span>
            <span className="kpi-number">12.8M</span>
            <span className="kpi-subtext positive">↗ +32.6% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap red">
            <ThumbsUp size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng lượt thích</span>
            <span className="kpi-number">842K</span>
            <span className="kpi-subtext positive">↗ +28.1% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap purple">
            <MessageSquare size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng bình luận</span>
            <span className="kpi-number">96K</span>
            <span className="kpi-subtext positive">↗ +24.3% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap orange">
            <Share2 size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng lượt chia sẻ</span>
            <span className="kpi-number">54K</span>
            <span className="kpi-subtext positive">↗ +19.8% so với tuần trước</span>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW 1: 3 CARDS */}
      <div className="overview-middle-grid-1">
        {/* Card 1: Xu hướng hiệu suất tổng quan */}
        <div className="ui-card overview-trend-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <TrendingUp size={16} className="text-primary" />
              <span>Xu hướng hiệu suất tổng quan</span>
            </div>
            <select className="period-select-sm">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>

          <div className="chart-legend-row-sm">
            <span className="legend-item"><span className="legend-dot blue" /> Lượt xem</span>
            <span className="legend-item"><span className="legend-dot green" /> Lượt thích</span>
            <span className="legend-item"><span className="legend-dot red" /> Bình luận</span>
            <span className="legend-item"><span className="legend-dot orange" /> Chia sẻ</span>
          </div>

          <div className="chart-svg-wrap">
            <svg viewBox="0 0 500 170" className="trend-svg-chart">
              <line x1="30" y1="15" x2="480" y2="15" stroke="#F1F5F9" />
              <text x="24" y="19" fill="#94A3B8" fontSize="9" textAnchor="end">2M</text>
              <line x1="30" y1="55" x2="480" y2="55" stroke="#F1F5F9" />
              <text x="24" y="59" fill="#94A3B8" fontSize="9" textAnchor="end">1.5M</text>
              <line x1="30" y1="95" x2="480" y2="95" stroke="#F1F5F9" />
              <text x="24" y="99" fill="#94A3B8" fontSize="9" textAnchor="end">1M</text>
              <line x1="30" y1="135" x2="480" y2="135" stroke="#F1F5F9" />
              <text x="24" y="139" fill="#94A3B8" fontSize="9" textAnchor="end">500K</text>
              <line x1="30" y1="160" x2="480" y2="160" stroke="#E2E8F0" />
              <text x="24" y="164" fill="#94A3B8" fontSize="9" textAnchor="end">0</text>

              {['02/10', '03/10', '04/10', '05/10', '06/10', '07/10', '08/10'].map((d, i) => (
                <text key={i} x={45 + i * 68} y="170" fill="#64748B" fontSize="9" textAnchor="middle">
                  {d}
                </text>
              ))}

              <polyline fill="none" stroke="#2563EB" strokeWidth="2.5" points="45,125 113,110 181,95 249,85 317,75 385,68 453,55" />
              <polyline fill="none" stroke="#10B981" strokeWidth="2" points="45,142 113,135 181,128 249,120 317,112 385,108 453,98" />
              <polyline fill="none" stroke="#EF4444" strokeWidth="2" points="45,152 113,148 181,145 249,142 317,138 385,135 453,130" />
              <polyline fill="none" stroke="#F59E0B" strokeWidth="2" points="45,158 113,156 181,154 249,150 317,148 385,145 453,142" />

              <circle cx="453" cy="55" r="3.5" fill="#2563EB" />
            </svg>
          </div>
        </div>

        {/* Card 2: Hiệu suất theo nền tảng (Donut) */}
        <div className="ui-card overview-donut-card">
          <div className="card-section-title">
            <PieChart size={16} className="text-primary" />
            <span>Hiệu suất theo nền tảng</span>
          </div>

          <div className="donut-content-row">
            <div className="donut-svg-wrap">
              <svg viewBox="0 0 160 160" className="donut-svg">
                <circle cx="80" cy="80" r="56" fill="none" stroke="#EF4444" strokeWidth="24" strokeDasharray="150 377" strokeDashoffset="0" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#0F172A" strokeWidth="24" strokeDasharray="94 377" strokeDashoffset="-150" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#2563EB" strokeWidth="24" strokeDasharray="82 377" strokeDashoffset="-244" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#EC4899" strokeWidth="24" strokeDasharray="18 377" strokeDashoffset="-326" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#06B6D4" strokeWidth="24" strokeDasharray="33 377" strokeDashoffset="-344" />
              </svg>
              <div className="donut-center-label">
                <span className="donut-center-number">12.8M</span>
                <span className="donut-center-sub">Tổng lượt xem</span>
              </div>
            </div>

            <div className="donut-legend-stack">
              <div className="donut-legend-item">
                <span className="legend-dot red" />
                <div className="legend-meta">
                  <span className="legend-name">YouTube</span>
                  <span className="legend-val">5.1M (39.8%)</span>
                </div>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot black" />
                <div className="legend-meta">
                  <span className="legend-name">TikTok</span>
                  <span className="legend-val">3.2M (25.0%)</span>
                </div>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot blue" />
                <div className="legend-meta">
                  <span className="legend-name">Facebook</span>
                  <span className="legend-val">2.8M (21.9%)</span>
                </div>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot pink" />
                <div className="legend-meta">
                  <span className="legend-name">Instagram</span>
                  <span className="legend-val">620K (4.8%)</span>
                </div>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot cyan" />
                <div className="legend-meta">
                  <span className="legend-name">Khác</span>
                  <span className="legend-val">1.1M (8.5%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Top đối thủ theo lượt xem */}
        <div className="ui-card overview-comps-card">
          <div className="card-section-title">
            <Trophy size={16} className="text-primary" />
            <span>Top đối thủ theo lượt xem</span>
          </div>

          <div className="top-comps-bars-stack">
            {topComps.map((c) => (
              <div key={c.rank} className="top-comp-bar-item">
                <span className="comp-rank-no">{c.rank}</span>
                <div className="comp-avatar-xs" style={{ backgroundColor: c.bg }}>
                  {c.name.substring(0, 2)}
                </div>
                <span className="comp-txt-name">{c.name}</span>
                <div className="c-bar-track">
                  <div className="c-bar-fill" style={{ width: `${c.width}%`, backgroundColor: c.color }} />
                </div>
                <span className="comp-view-num">{c.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MIDDLE ROW 2: 3 CARDS */}
      <div className="overview-middle-grid-2">
        {/* Card 1: Top video hiệu suất cao */}
        <div className="ui-card overview-top-vids-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <Flame size={16} className="text-danger" />
              <span>Top video hiệu suất cao</span>
            </div>
            <span className="view-all-link-xs">Xem tất cả →</span>
          </div>

          <div className="top-vids-compact-list">
            {topVideos.map((v, i) => (
              <div key={v.id} className="top-vid-item-row">
                <span className="v-rank-no">{i + 1}</span>
                <div className="v-thumb-box" style={{ background: v.bg }}>
                  <span className="v-dur">{v.dur}</span>
                </div>
                <div className="v-meta-center">
                  <span className="v-title-text">{v.title}</span>
                  <span className="v-author-text">{v.comp}</span>
                </div>
                <div className="v-metrics-right">
                  <span className="v-metric-tag"><Eye size={12} /> {v.views}</span>
                  <span className="v-metric-tag"><ThumbsUp size={12} /> {v.likes}</span>
                  <span className="v-metric-tag"><MessageSquare size={12} /> {v.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Chủ đề nổi bật tuần này */}
        <div className="ui-card overview-topics-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <Hash size={16} className="text-primary" />
              <span>Chủ đề nổi bật tuần này</span>
            </div>
            <span className="view-all-link-xs">Xem tất cả →</span>
          </div>

          <div className="topics-rows-stack">
            {topTopics.map((t) => (
              <div key={t.rank} className="topic-rank-row">
                <span className="t-rank-no">{t.rank}</span>
                <span className="t-name-badge">{t.name}</span>
                <span className="t-count-num">{t.count}</span>
                <span className="t-growth-pill">↗ {t.growth}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Cơ hội nội dung đề xuất */}
        <div className="ui-card overview-opps-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <Lightbulb size={16} className="text-primary" />
              <span>Cơ hội nội dung đề xuất</span>
            </div>
            <span className="view-all-link-xs">Xem tất cả →</span>
          </div>

          <div className="opps-rows-stack">
            {topOpportunities.map((o) => (
              <div key={o.rank} className="opp-rank-row">
                <span className="o-rank-no">{o.rank}</span>
                <span className="o-name-txt">{o.name}</span>
                <div className="o-bar-track">
                  <div className="o-bar-fill" style={{ width: `${o.barW}%` }} />
                </div>
                <span className="o-level-txt" style={{ color: o.color }}>{o.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: 2 CARDS */}
      <div className="overview-bottom-grid">
        {/* Card 1: Tóm tắt & Khuyến nghị AI */}
        <div className="ui-card overview-ai-summary-card">
          <div className="card-section-title">
            <Bot size={18} className="text-primary" />
            <span>Tóm tắt & Khuyến nghị AI</span>
          </div>

          <ul className="ai-summary-bullets">
            <li>• Hiệu suất tổng thể tăng 32.8% so với tuần trước, đặc biệt là nội dung về AI & Technology.</li>
            <li>• YouTube vẫn là nền tảng mang lại nhiều lượt xem nhất (39.8%).</li>
            <li>• Đề xuất tập trung vào chủ đề Review công nghệ mới và Du lịch chi tiết trong tuần tới.</li>
            <li>• Cân nhắc tăng tần suất đăng video vào khung giờ 19:00 - 22:00 để tối ưu lượt xem.</li>
          </ul>
        </div>

        {/* Card 2: Dự báo tuần tới */}
        <div className="ui-card overview-forecast-card">
          <div className="card-section-title">
            <ArrowUpRight size={18} className="text-success" />
            <span>Dự báo tuần tới</span>
          </div>

          <div className="forecast-next-week-split">
            <div className="f-nw-stat">
              <span className="f-lbl">Tổng lượt xem dự kiến</span>
              <span className="f-val">15.2M</span>
              <span className="f-growth positive">↗ +18.8%</span>
            </div>
            <div className="f-nw-stat">
              <span className="f-lbl">Tổng video dự kiến</span>
              <span className="f-val">1,450</span>
              <span className="f-growth positive">↗ +15.6%</span>
            </div>
            <div className="f-nw-stat">
              <span className="f-lbl">Tăng trưởng trung bình</span>
              <span className="f-val text-success">+20.1%</span>
            </div>
            <div className="f-nw-sparkline">
              <svg width="100" height="36">
                <path d="M0,30 Q30,24 60,14 T100,4" fill="none" stroke="#10B981" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
