import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  TrendingUp,
  Hash,
  Play,
  Target,
  PieChart,
  Lightbulb,
  BarChart2,
} from 'lucide-react';
import {
  MARKET_TOPICS,
  FAST_GROWTH_TOPICS,
  TRENDING_KEYWORDS,
} from '../../mocks/marketTrends';
import './WF06Page.css';

export const WF06Page: React.FC = () => {
  const [platform, setPlatform] = useState('YouTube');

  const wordCloudTags = [
    { text: 'AI', size: 32, color: '#2563EB', weight: 800 },
    { text: 'iPhone', size: 28, color: '#EF4444', weight: 800 },
    { text: 'Technology', size: 24, color: '#10B981', weight: 700 },
    { text: 'Smart Home', size: 20, color: '#EA580C', weight: 700 },
    { text: 'Review', size: 22, color: '#3B82F6', weight: 700 },
    { text: 'ChatGPT', size: 14, color: '#6366F1', weight: 600 },
    { text: 'Camera', size: 16, color: '#059669', weight: 600 },
    { text: 'Electric Vehicle', size: 13, color: '#64748B', weight: 500 },
    { text: 'Apple', size: 14, color: '#DC2626', weight: 600 },
    { text: 'Education', size: 15, color: '#2563EB', weight: 600 },
    { text: 'Guide', size: 12, color: '#94A3B8', weight: 500 },
    { text: 'Tools', size: 13, color: '#84CC16', weight: 600 },
    { text: 'Gaming', size: 16, color: '#8B5CF6', weight: 600 },
  ];

  const platformDistribution = [
    { name: 'AI & Technology', pct: 32, color: '#EF4444' },
    { name: 'Product Review', pct: 24, color: '#3B82F6' },
    { name: 'Science & Education', pct: 18, color: '#10B981' },
    { name: 'Gaming', pct: 14, color: '#8B5CF6' },
    { name: 'Smartphone', pct: 12, color: '#F59E0B' },
  ];

  return (
    <div className="wf06-page-container fade-in">
      <PageHeader
        title="WF06 - Xu hướng thị trường"
        subtitle="Phân tích xu hướng chủ đề, từ khóa và nội dung thịnh hành trong thị trường."
        stepNumber={6}
      />

      {/* TOP ROW: 4 KPI CARDS */}
      <div className="wf06-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Chủ đề đang thịnh hành</span>
            <span className="kpi-number">25</span>
            <span className="kpi-subtext positive">↗ +31.6% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green">
            <Hash size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Từ khóa xu hướng</span>
            <span className="kpi-number">132</span>
            <span className="kpi-subtext positive">↗ +18.9% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap red">
            <Play size={22} fill="#EF4444" />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Chủ đề tăng trưởng nhanh</span>
            <span className="kpi-number">8</span>
            <span className="kpi-subtext positive">↗ +60.0% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap purple">
            <Target size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Chủ đề tiềm năng</span>
            <span className="kpi-number">12</span>
            <span className="kpi-subtext positive">↗ +33.3% so với tuần trước</span>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: 3 CARDS */}
      <div className="wf06-middle-grid">
        {/* Card 1: Xu hướng chủ đề theo thời gian */}
        <div className="ui-card wf06-line-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <TrendingUp size={16} className="text-primary" />
              <span>Xu hướng chủ đề theo thời gian</span>
            </div>
            <div className="chart-legend-row-sm">
              <span className="legend-item"><span className="legend-dot blue" /> AI & Tech</span>
              <span className="legend-item"><span className="legend-dot green" /> Review</span>
              <span className="legend-item"><span className="legend-dot red" /> Science</span>
              <span className="legend-item"><span className="legend-dot purple" /> Gaming</span>
              <span className="legend-item"><span className="legend-dot orange" /> Smartphone</span>
            </div>
          </div>

          <div className="chart-svg-wrap">
            <svg viewBox="0 0 500 180" className="trend-svg-chart">
              <line x1="30" y1="15" x2="480" y2="15" stroke="#F1F5F9" strokeWidth="1" />
              <text x="22" y="19" fill="#94A3B8" fontSize="9" textAnchor="end">200</text>
              <line x1="30" y1="55" x2="480" y2="55" stroke="#F1F5F9" strokeWidth="1" />
              <text x="22" y="59" fill="#94A3B8" fontSize="9" textAnchor="end">150</text>
              <line x1="30" y1="95" x2="480" y2="95" stroke="#F1F5F9" strokeWidth="1" />
              <text x="22" y="99" fill="#94A3B8" fontSize="9" textAnchor="end">100</text>
              <line x1="30" y1="135" x2="480" y2="135" stroke="#F1F5F9" strokeWidth="1" />
              <text x="22" y="139" fill="#94A3B8" fontSize="9" textAnchor="end">50</text>
              <line x1="30" y1="165" x2="480" y2="165" stroke="#E2E8F0" strokeWidth="1" />
              <text x="22" y="169" fill="#94A3B8" fontSize="9" textAnchor="end">0</text>

              {['02/10', '03/10', '04/10', '05/10', '06/10', '07/10', '08/10'].map((d, i) => (
                <text key={i} x={45 + i * 68} y="176" fill="#64748B" fontSize="9" textAnchor="middle">
                  {d}
                </text>
              ))}

              {/* Lines */}
              <polyline fill="none" stroke="#2563EB" strokeWidth="2.5" points="45,130 113,115 181,102 249,94 317,86 385,82 453,72" />
              <polyline fill="none" stroke="#10B981" strokeWidth="2" points="45,145 113,138 181,130 249,122 317,114 385,110 453,100" />
              <polyline fill="none" stroke="#EF4444" strokeWidth="2" points="45,155 113,150 181,146 249,142 317,138 385,135 453,130" />
              <polyline fill="none" stroke="#8B5CF6" strokeWidth="2" points="45,160 113,158 181,154 249,150 317,148 385,145 453,142" />
              <polyline fill="none" stroke="#F59E0B" strokeWidth="2" points="45,165 113,162 181,160 249,156 317,154 385,150 453,148" />

              <circle cx="453" cy="72" r="3.5" fill="#2563EB" />
              <circle cx="453" cy="100" r="3.5" fill="#10B981" />
            </svg>
          </div>
        </div>

        {/* Card 2: Tỷ lệ chủ đề trong thị trường (Donut) */}
        <div className="ui-card wf06-donut-card">
          <div className="card-section-title">
            <PieChart size={16} className="text-primary" />
            <span>Tỷ lệ chủ đề trong thị trường</span>
          </div>

          <div className="donut-content-row">
            <div className="donut-svg-wrap">
              <svg viewBox="0 0 160 160" className="donut-svg">
                <circle cx="80" cy="80" r="56" fill="none" stroke="#2563EB" strokeWidth="24" strokeDasharray="107 377" strokeDashoffset="0" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#10B981" strokeWidth="24" strokeDasharray="83 377" strokeDashoffset="-107" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#EF4444" strokeWidth="24" strokeDasharray="70 377" strokeDashoffset="-190" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#8B5CF6" strokeWidth="24" strokeDasharray="58 377" strokeDashoffset="-260" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#F59E0B" strokeWidth="24" strokeDasharray="58 377" strokeDashoffset="-318" />
              </svg>
              <div className="donut-center-label">
                <span className="donut-center-number">754</span>
                <span className="donut-center-sub">Tổng video</span>
              </div>
            </div>

            <div className="donut-legend-stack">
              {MARKET_TOPICS.map((topic, i) => (
                <div key={i} className="donut-legend-item">
                  <span className="legend-dot" style={{ backgroundColor: topic.color }} />
                  <div className="legend-meta">
                    <span className="legend-name">{topic.name}</span>
                    <span className="legend-val">{topic.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Chủ đề tăng trưởng nhanh nhất */}
        <div className="ui-card wf06-fast-growth-card">
          <div className="card-section-title">
            <TrendingUp size={16} className="text-success" />
            <span>Chủ đề tăng trưởng nhanh nhất</span>
          </div>

          <div className="fast-growth-list">
            {FAST_GROWTH_TOPICS.map((t) => (
              <div key={t.id} className="fast-topic-item">
                <div className="topic-thumb" style={{ background: t.gradient }} />
                <span className="topic-name">{t.name}</span>
                <span className="topic-growth-pill">↗ {t.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: 3 CARDS */}
      <div className="wf06-bottom-grid">
        {/* Card 1: Từ khóa xu hướng */}
        <div className="ui-card wf06-keywords-card">
          <div className="card-section-title">
            <Hash size={16} className="text-primary" />
            <span>Từ khóa xu hướng</span>
          </div>

          <table className="kw-table">
            <thead>
              <tr>
                <th style={{ width: '28px' }}>#</th>
                <th>Từ khóa</th>
                <th>Số video</th>
                <th>Tăng trưởng</th>
                <th>Độ phổ biến</th>
                <th>Xu hướng</th>
              </tr>
            </thead>
            <tbody>
              {TRENDING_KEYWORDS.map((k) => (
                <tr key={k.id}>
                  <td className="text-muted-cell font-semibold">{k.id}</td>
                  <td className="kw-name">{k.keyword}</td>
                  <td className="font-semibold">{k.videoCount}</td>
                  <td className="growth-text">{k.growth}</td>
                  <td>
                    <span className={`badge-pop ${k.popularity.toLowerCase()}`}>
                      {k.popularity}
                    </span>
                  </td>
                  <td>
                    <svg width="60" height="18">
                      <path d={k.sparklinePath} fill="none" stroke={k.sparklineColor} strokeWidth="2" />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card 2: Word Cloud & Insight */}
        <div className="ui-card wf06-cloud-card">
          <div className="card-section-title">
            <Lightbulb size={16} className="text-primary" />
            <span>Word Cloud - Từ khóa phổ biến</span>
          </div>

          <div className="word-cloud-canvas">
            {wordCloudTags.map((tag, idx) => (
              <span
                key={idx}
                className="cloud-word"
                style={{
                  fontSize: `${tag.size}px`,
                  color: tag.color,
                  fontWeight: tag.weight,
                }}
              >
                {tag.text}
              </span>
            ))}
          </div>

          <div className="insight-bullets-box">
            <div className="insight-bullets-title">
              <Lightbulb size={14} className="text-primary" />
              <span>Nhận định xu hướng</span>
            </div>
            <ul className="insight-bullets-list">
              <li>Chủ đề về AI Tools đang tăng trưởng mạnh (+120%) và là xu hướng chính của thị trường.</li>
              <li>Nội dung liên quan đến iPhone 17 có mức quan tâm cao, đặc biệt là các video review và so sánh.</li>
              <li>Smart Home và Sustainable Tech là các chủ đề tiềm năng, phù hợp để tạo nội dung trong thời gian tới.</li>
            </ul>
          </div>
        </div>

        {/* Card 3: Xu hướng theo nền tảng */}
        <div className="ui-card wf06-platform-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <BarChart2 size={16} className="text-primary" />
              <span>Xu hướng theo nền tảng</span>
            </div>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="period-select-sm"
            >
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
            </select>
          </div>

          <div className="platform-bars-list">
            {platformDistribution.map((item, idx) => (
              <div key={idx} className="platform-bar-row">
                <span className="p-bar-name">{item.name}</span>
                <div className="p-bar-track">
                  <div
                    className="p-bar-fill"
                    style={{ width: `${item.pct * 2.8}%`, backgroundColor: item.color }}
                  />
                </div>
                <span className="p-bar-pct">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
