import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  Lightbulb,
  Flame,
  Target,
  BarChart2,
  Search,
  Eye,
  Edit2,
  MoreVertical,
  Check,
  Copy,
  TrendingUp,
  PieChart,
} from 'lucide-react';
import { getList } from '../../services/api/client';
import { useToast } from '../../components/common/Toast';
import './WF07Page.css';

const YoutubeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const WF07Page: React.FC = () => {
  const { showToast } = useToast();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedOppId, setSelectedOppId] = useState<number | string | null>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'keywords' | 'competitors' | 'ideas'>('ai');

  useEffect(() => {
    const controller = new AbortController();

    getList<any>('/api/opportunities', controller.signal)
      .then((data) => {
        setOpportunities(data);
        setSelectedOppId(data[0]?.id ?? null);
        setApiError('');
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        setApiError(error instanceof Error ? error.message : 'Không thể tải dữ liệu cơ hội.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const filteredOpportunities = opportunities.filter((item) =>
    String(item.title ?? item.name ?? '')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );
  const selectedOpp = filteredOpportunities.find((item) => item.id === selectedOppId)
    ?? filteredOpportunities[0]
    ?? null;
  const highPotentialCount = opportunities.filter((item) =>
    String(item.potentialLevel ?? item.level ?? item.severity ?? '').toLowerCase().includes('cao')
  ).length;
  const uniqueKeywords = new Set(
    opportunities.flatMap((item) => Array.isArray(item.keywords) ? item.keywords : [])
  ).size;

  const potentialKeywords: any[] = [];

  const copyTitle = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`Đã sao chép tiêu đề: "${text}"`, 'success');
  };

  return (
    <div className="wf07-page-container fade-in">
      <PageHeader
        title="WF07 - Cơ hội nội dung"
        subtitle="Tìm kiếm và gợi ý các chủ đề, từ khóa và ý tưởng nội dung tiềm năng dựa trên phân tích dữ liệu."
        stepNumber={7}
      />

      {/* TOP ROW: 4 KPI CARDS */}
      <div className="wf07-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap purple">
            <Lightbulb size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng cơ hội nội dung</span>
            <span className="kpi-number">{opportunities.length}</span>
            <span className="kpi-subtext">Số cơ hội hiện có từ API</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap orange">
            <Flame size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Cơ hội tiềm năng cao</span>
            <span className="kpi-number">{highPotentialCount}</span>
            <span className="kpi-subtext">Theo mức tiềm năng trong dữ liệu</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue">
            <Target size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Chủ đề đang hot</span>
            <span className="kpi-number">—</span>
            <span className="kpi-subtext">Chưa có dữ liệu xu hướng</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green">
            <BarChart2 size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Từ khóa đề xuất</span>
            <span className="kpi-number">{uniqueKeywords}</span>
            <span className="kpi-subtext">Từ khóa trong danh sách cơ hội</span>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: 2 COLUMNS */}
      <div className="wf07-middle-grid">
        {/* Left Column: Table */}
        <div className="ui-card wf07-table-card">
          <div className="table-card-header">
            <div className="card-section-title">
              <Lightbulb size={18} className="text-primary" />
              <span>Danh sách cơ hội nội dung</span>
            </div>

            <div className="table-filters-row">
              <div className="search-input-wrap">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm chủ đề, từ khóa..."
                  className="table-search-input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <select className="table-select">
                <option>Nền tảng: Tất cả</option>
                <option>YouTube</option>
                <option>TikTok</option>
                <option>Facebook</option>
              </select>

              <select className="table-select">
                <option>Mức độ tiềm năng: Tất cả</option>
                <option>Cao</option>
                <option>Trung bình</option>
              </select>

              <select className="table-select">
                <option>Danh mục: Tất cả</option>
                <option>Du lịch</option>
                <option>Ẩm thực</option>
              </select>
            </div>
          </div>

          <div className="table-responsive-wrap">
            <table className="opp-table">
              <thead>
                <tr>
                  <th style={{ width: '32px' }}><input type="checkbox" /></th>
                  <th style={{ width: '32px' }}>#</th>
                  <th style={{ width: '60px' }}>Thumbnail</th>
                  <th>Chủ đề / Ý tưởng nội dung</th>
                  <th>Nền tảng</th>
                  <th>Từ khóa chính</th>
                  <th>Mức độ tiềm năng</th>
                  <th>Lượt xem dự kiến</th>
                  <th style={{ textAlign: 'center' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24 }}>Đang tải cơ hội từ máy chủ...</td></tr>
                ) : apiError ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24 }}>Không tải được dữ liệu: {apiError}</td></tr>
                ) : filteredOpportunities.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24 }}>
                    {searchText ? 'Không tìm thấy cơ hội phù hợp.' : 'Chưa có cơ hội nội dung. Hãy chạy workflow phân tích để tạo dữ liệu.'}
                  </td></tr>
                ) : filteredOpportunities.map((item, idx) => {
                  const isCurrent = item.id === selectedOpp?.id;
                  return (
                    <tr
                      key={item.id}
                      className={`opp-row ${isCurrent ? 'row-active' : ''}`}
                      onClick={() => setSelectedOppId(item.id)}
                    >
                      <td onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={isCurrent} readOnly /></td>
                      <td className="text-muted-cell font-semibold">{idx + 1}</td>
                      <td>
                        <div className="opp-thumb-box" style={{ background: (item.thumbnailGradient || 'linear-gradient(135deg, #64748b, #334155)') }}>
                          <span className="opp-dur">12:45</span>
                        </div>
                      </td>
                      <td><span className="opp-title-text">{(item.title ?? item.name ?? 'Chưa có tiêu đề')}</span></td>
                      <td>
                        <span className="opp-platform-tag">
                          {(item.platform ?? 'YouTube') === 'YouTube' && <YoutubeIcon size={14} className="yt-red" />}
                          {item.platform === 'TikTok' && <span className="tt-icon">🎵</span>}
                          {item.platform === 'Facebook' && <span className="fb-icon">🔵</span>}
                        </span>
                      </td>
                      <td>
                        <div className="opp-tags-stack">
                          {(Array.isArray(item.keywords) ? item.keywords : []).map((kw: string, i: number) => (
                            <span key={i} className="kw-mini-tag">{kw}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge-level ${String(item.potentialLevel ?? item.level ?? 'Chưa xác định').toLowerCase()}`}>
                          {item.potentialLevel ?? item.level ?? 'Chưa xác định'}
                        </span>
                      </td>
                      <td className="font-bold">{item.expectedViews ?? 'Chưa có dữ liệu'}</td>
                      <td>
                        <div className="table-actions-cell">
                          <button type="button" className="action-icon-btn view" title="Xem chi tiết"><Eye size={14} /></button>
                          <button type="button" className="action-icon-btn edit" title="Lưu ý tưởng"><Edit2 size={14} /></button>
                          <button type="button" className="action-icon-btn more"><MoreVertical size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="table-pagination-footer">
            <span className="pagination-info">Hiển thị {filteredOpportunities.length} / {opportunities.length} cơ hội</span>
            <div className="pagination-nav">
              <button className="page-nav-btn">&lt;</button>
              <button className="page-num-btn active">1</button>
              <button className="page-num-btn">2</button>
              <button className="page-num-btn">3</button>
              <button className="page-num-btn">4</button>
              <button className="page-num-btn">5</button>
              <span className="page-dots">...</span>
              <button className="page-num-btn">25</button>
              <button className="page-nav-btn">&gt;</button>
            </div>
          </div>
        </div>

        {/* Right Column: Detail Panel */}
        <div className="ui-card wf07-detail-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <Lightbulb size={18} className="text-primary" />
              <span>Chi tiết cơ hội nội dung</span>
            </div>
            <div className="detail-nav-arrows">
              <button
                type="button"
                className="detail-arrow-btn"
                onClick={() => { const i = filteredOpportunities.findIndex((o) => o.id === selectedOpp?.id); if (i > 0) setSelectedOppId(filteredOpportunities[i - 1].id); }}
                title="Cơ hội trước"
              >
                &lt;
              </button>
              <button
                type="button"
                className="detail-arrow-btn"
                onClick={() => { const i = filteredOpportunities.findIndex((o) => o.id === selectedOpp?.id); if (i >= 0 && i < filteredOpportunities.length - 1) setSelectedOppId(filteredOpportunities[i + 1].id); }}
                title="Cơ hội tiếp theo"
              >
                &gt;
              </button>
            </div>
          </div>

          {selectedOpp ? <>
          {/* Hero Banner */}
          <div className="opp-hero-banner" style={{ background: selectedOpp.thumbnailGradient || "linear-gradient(135deg, #64748b, #334155)" }}>
            <div className="banner-badge-top">
              <span className="badge-tag-banner">TOP 10 ĐẢO ĐẸP NHẤT VIỆT NAM</span>
            </div>
            <span className="banner-duration">12:45</span>
          </div>

          <div className="opp-meta-row">
            <h3 className="opp-detail-title">{selectedOpp.title}</h3>
            <div className="opp-platform-badge-line">
              <span className="platform-pill-red">
                <YoutubeIcon size={13} className="yt-icon" /> YouTube
              </span>
              <span className="badge-opp-high">
                <Flame size={12} /> Cơ hội tiềm năng cao
              </span>
            </div>
          </div>

          <div className="detail-tabs-nav">
            <button className={`detail-tab-btn ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
              Phân tích AI
            </button>
            <button className={`detail-tab-btn ${activeTab === 'keywords' ? 'active' : ''}`} onClick={() => setActiveTab('keywords')}>
              Từ khóa liên quan
            </button>
            <button className={`detail-tab-btn ${activeTab === 'competitors' ? 'active' : ''}`} onClick={() => setActiveTab('competitors')}>
              Đối thủ tham khảo
            </button>
            <button className={`detail-tab-btn ${activeTab === 'ideas' ? 'active' : ''}`} onClick={() => setActiveTab('ideas')}>
              Gợi ý nội dung
            </button>
          </div>

          {/* Details 2-box row */}
          <div className="opp-insights-split">
            <div className="opp-box">
              <h5 className="opp-box-header">
                <Check size={14} className="text-success" /> Vì sao đây là cơ hội tốt?
              </h5>
              <ul className="opp-check-list">
                <li><span className="check-mark">✔</span> Chủ đề đang có xu hướng tăng mạnh (+120%)</li>
                <li><span className="check-mark">✔</span> Ít video chất lượng cao trong 30 ngày qua</li>
                <li><span className="check-mark">✔</span> Nhu cầu tìm kiếm cao và ổn định</li>
                <li><span className="check-mark">✔</span> Phù hợp với xu hướng du lịch 2024</li>
              </ul>
            </div>

            <div className="opp-box">
              <h5 className="opp-box-header">
                <Target size={14} className="text-primary" /> Dự đoán hiệu suất
              </h5>
              <div className="pred-stats-list">
                <div className="pred-stat-item">
                  <span className="p-lbl">Lượt xem dự kiến:</span>
                  <span className="p-val">1.2M - 2.1M</span>
                </div>
                <div className="pred-stat-item">
                  <span className="p-lbl">Tỷ lệ tương tác:</span>
                  <span className="p-val">6.5% - 8.2%</span>
                </div>
                <div className="pred-stat-item">
                  <span className="p-lbl">Thời gian tối ưu:</span>
                  <span className="p-val">2 - 4 tuần</span>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Titles */}
          <div className="suggested-titles-box">
            <div className="suggested-title-header">
              <Lightbulb size={14} className="text-primary" />
              <span>Gợi ý tiêu đề</span>
            </div>

            <div className="titles-copy-list">
              {[
                'Top 10 hòn đảo đẹp nhất Việt Nam 2024 | Thiên đường biển đảo',
                'Khám phá 10 hòn đảo hoang sơ đẹp nhất Việt Nam',
                'Du lịch biển đảo Việt Nam 2024 | 10 điểm đến không thể bỏ qua',
              ].map((title, i) => (
                <div key={i} className="title-copy-item">
                  <span className="title-txt">• {title}</span>
                  <button type="button" className="copy-btn" onClick={() => copyTitle(title)} title="Sao chép tiêu đề">
                    <Copy size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          </> : <div style={{ padding: 24, textAlign: 'center' }}>
            {loading ? 'Đang tải chi tiết...' : 'Chưa có dữ liệu chi tiết cho cơ hội nội dung.'}
          </div>}
        </div>
      </div>

      {/* BOTTOM ROW: 3 CARDS */}
      <div className="wf07-bottom-grid">
        {/* Card 1: Xu hướng tìm kiếm */}
        <div className="ui-card wf07-trend-chart-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <TrendingUp size={16} className="text-primary" />
              <span>Xu hướng tìm kiếm theo thời gian</span>
            </div>
            <div className="chart-legend-row">
              <span className="legend-item"><span className="legend-dot blue" /> Tổng tìm kiếm</span>
              <span className="legend-item"><span className="legend-dot green" /> Cơ hội nội dung</span>
            </div>
          </div>

          <div className="chart-svg-wrap">
            <p style={{ padding: 24, textAlign: "center" }}>Chưa có dữ liệu lịch sử tìm kiếm từ API.</p>
            <svg style={{ display: "none" }} viewBox="0 0 450 170" className="trend-svg-chart">
              <line x1="30" y1="20" x2="430" y2="20" stroke="#F1F5F9" />
              <text x="22" y="24" fill="#94A3B8" fontSize="9" textAnchor="end">80K</text>
              <line x1="30" y1="60" x2="430" y2="60" stroke="#F1F5F9" />
              <text x="22" y="64" fill="#94A3B8" fontSize="9" textAnchor="end">60K</text>
              <line x1="30" y1="100" x2="430" y2="100" stroke="#F1F5F9" />
              <text x="22" y="104" fill="#94A3B8" fontSize="9" textAnchor="end">40K</text>
              <line x1="30" y1="140" x2="430" y2="140" stroke="#F1F5F9" />
              <text x="22" y="144" fill="#94A3B8" fontSize="9" textAnchor="end">20K</text>
              <line x1="30" y1="160" x2="430" y2="160" stroke="#E2E8F0" />
              <text x="22" y="164" fill="#94A3B8" fontSize="9" textAnchor="end">0</text>

              {['02/10', '03/10', '04/10', '05/10', '06/10', '07/10', '08/10'].map((d, i) => (
                <text key={i} x={45 + i * 60} y="169" fill="#64748B" fontSize="9" textAnchor="middle">
                  {d}
                </text>
              ))}

              <polyline fill="none" stroke="#2563EB" strokeWidth="2.5" points="45,145 105,130 165,105 225,95 285,88 345,82 405,74" />
              <polyline fill="none" stroke="#10B981" strokeWidth="2" points="45,155 105,148 165,142 225,135 285,130 345,124 405,115" />
              <circle cx="405" cy="74" r="3.5" fill="#2563EB" />
              <circle cx="405" cy="115" r="3.5" fill="#10B981" />
            </svg>
          </div>
        </div>

        {/* Card 2: Từ khóa tiềm năng */}
        <div className="ui-card wf07-kw-card">
          <div className="card-section-title">
            <Target size={16} className="text-primary" />
            <span>Từ khóa tiềm năng</span>
          </div>

          <table className="kw-table">
            <thead>
              <tr>
                <th style={{ width: '28px' }}>#</th>
                <th>Từ khóa</th>
                <th>Lượt tìm kiếm/tháng</th>
                <th>Xu hướng</th>
                <th>Mức độ</th>
              </tr>
            </thead>
            <tbody>
              {potentialKeywords.map((k) => (
                <tr key={k.rank}>
                  <td className="text-muted-cell font-semibold">{k.rank}</td>
                  <td className="font-semibold">{k.kw}</td>
                  <td>{k.searches}</td>
                  <td className="growth-text">{k.trend}</td>
                  <td>
                    <span className={`badge-pop ${k.level.toLowerCase()}`}>
                      {k.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card 3: Danh mục cơ hội nội dung */}
        <div className="ui-card wf07-cat-donut-card">
          <div className="card-section-title">
            <PieChart size={16} className="text-primary" />
            <span>Danh mục cơ hội nội dung</span>
          </div>

          <div className="donut-content-row">
            <div className="donut-svg-wrap">
              <svg viewBox="0 0 160 160" className="donut-svg">
                <circle cx="80" cy="80" r="56" fill="none" stroke="#2563EB" strokeWidth="24" strokeDasharray="105 377" strokeDashoffset="0" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#10B981" strokeWidth="24" strokeDasharray="84 377" strokeDashoffset="-105" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#EF4444" strokeWidth="24" strokeDasharray="66 377" strokeDashoffset="-189" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#8B5CF6" strokeWidth="24" strokeDasharray="54 377" strokeDashoffset="-255" />
                <circle cx="80" cy="80" r="56" fill="none" stroke="#F59E0B" strokeWidth="24" strokeDasharray="66 377" strokeDashoffset="-309" />
              </svg>
              <div className="donut-center-label">
                <span className="donut-center-number">{opportunities.length}</span>
                <span className="donut-center-sub">Cơ hội</span>
              </div>
            </div>

            <div className="donut-legend-stack">
              <div className="donut-legend-item">
                <span className="legend-dot blue" />
                <div className="legend-meta"><span className="legend-name">Du lịch & Khám phá</span><span className="legend-val">35 (28.0%)</span></div>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot green" />
                <div className="legend-meta"><span className="legend-name">Ẩm thực & Lifestyle</span><span className="legend-val">28 (22.4%)</span></div>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot red" />
                <div className="legend-meta"><span className="legend-name">Công nghệ & AI</span><span className="legend-val">22 (17.6%)</span></div>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot purple" />
                <div className="legend-meta"><span className="legend-name">Giáo dục & Hướng dẫn</span><span className="legend-val">18 (14.4%)</span></div>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot orange" />
                <div className="legend-meta"><span className="legend-name">Khác</span><span className="legend-val">22 (17.6%)</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
