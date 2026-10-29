import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  Lightbulb,
  Flame,
  Target,
  BarChart2,
  Search,
  Eye,
  Check,
  Copy,
  TrendingUp,
  PieChart,
  RotateCw,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { getOpportunities } from '../../services/api/opportunitiesApi';
import type { OpportunityItem } from '../../types/api';
import { useToast } from '../../components/common/Toast';
import './WF07Page.css';

const YoutubeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const WF07Page: React.FC = () => {
  const { showToast } = useToast();
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedOppId, setSelectedOppId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'evidence' | 'reason'>('ai');

  const fetchData = async (signal?: AbortSignal) => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await getOpportunities(signal);
      setOpportunities(data);
      if (data.length > 0 && selectedOppId === null) {
        setSelectedOppId(data[0].id);
      }
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setApiError(error instanceof Error ? error.message : 'Không thể tải dữ liệu cơ hội.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchText.toLowerCase());
      const matchPriority =
        priorityFilter === 'ALL' ||
        item.priority.toLowerCase() === priorityFilter.toLowerCase() ||
        (priorityFilter === 'HIGH' && (item.priority.toLowerCase() === 'cao' || item.priority === 'HIGH'));
      return matchSearch && matchPriority;
    });
  }, [opportunities, searchText, priorityFilter]);

  const selectedOpp = useMemo(() => {
    return (
      filteredOpportunities.find((item) => item.id === selectedOppId) ||
      filteredOpportunities[0] ||
      null
    );
  }, [filteredOpportunities, selectedOppId]);

  const highPotentialCount = useMemo(() => {
    return opportunities.filter(
      (item) =>
        item.priority.toLowerCase().includes('cao') ||
        item.priority.toUpperCase() === 'HIGH' ||
        Number(item.score) >= 70
    ).length;
  }, [opportunities]);

  const averageScore = useMemo(() => {
    if (opportunities.length === 0) return 0;
    const sum = opportunities.reduce((acc, curr) => acc + Number(curr.score || 0), 0);
    return Math.round(sum / opportunities.length);
  }, [opportunities]);

  // Priority distribution for donut chart
  const priorityStats = useMemo(() => {
    const high = opportunities.filter((o) => o.priority.toLowerCase().includes('cao') || o.priority.toUpperCase() === 'HIGH').length;
    const med = opportunities.filter((o) => o.priority.toLowerCase().includes('trung') || o.priority.toUpperCase() === 'MEDIUM').length;
    const low = opportunities.length - high - med;
    return { high, med, low };
  }, [opportunities]);

  const copyTitle = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`Đã sao chép: "${text}"`, 'success');
  };

  const getEvidenceList = (evidence: any): string[] => {
    if (!evidence) return [];
    if (Array.isArray(evidence)) return evidence.map(String);
    if (typeof evidence === 'object') {
      return Object.entries(evidence).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
    }
    return [String(evidence)];
  };

  return (
    <div className="wf07-page-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <PageHeader
          title="WF07 - Cơ hội nội dung"
          subtitle="Gợi ý các chủ đề, ý tưởng nội dung tiềm năng và cơ hội tăng trưởng từ cơ sở dữ liệu."
          stepNumber={7}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => fetchData()}
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8 }}
        >
          {loading ? <Loader2 size={14} className="spin" /> : <RotateCw size={14} />}
          <span>{loading ? 'Đang tải...' : 'Làm mới dữ liệu'}</span>
        </button>
      </div>

      {loading && (
        <div role="status" className="ui-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 16 }}>
          <Loader2 size={18} className="spin text-primary" />
          <span>Đang tải dữ liệu cơ hội từ API…</span>
        </div>
      )}

      {apiError && (
        <div role="alert" className="ui-card" style={{ padding: 16, backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} />
            <span>Không tải được dữ liệu: {apiError}</span>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => fetchData()} style={{ padding: '4px 10px', fontSize: 12 }}>
            Thử lại
          </button>
        </div>
      )}

      {/* TOP ROW: 4 KPI CARDS */}
      <div className="wf07-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap purple">
            <Lightbulb size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng cơ hội nội dung</span>
            <span className="kpi-number">{loading ? '…' : opportunities.length}</span>
            <span className="kpi-subtext">Dữ liệu từ API Backend</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap orange">
            <Flame size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Cơ hội ưu tiên cao</span>
            <span className="kpi-number">{loading ? '…' : highPotentialCount}</span>
            <span className="kpi-subtext">Mức độ ưu tiên High/Cao</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue">
            <Target size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Điểm cơ hội TB</span>
            <span className="kpi-number">{loading ? '…' : `${averageScore}/100`}</span>
            <span className="kpi-subtext">Điểm đánh giá tiềm năng</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green">
            <BarChart2 size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Cơ hội đã lọc</span>
            <span className="kpi-number">{loading ? '…' : filteredOpportunities.length}</span>
            <span className="kpi-subtext">Phù hợp tiêu chí tìm kiếm</span>
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
                  placeholder="Tìm kiếm chủ đề, lý do..."
                  className="table-search-input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              <select
                className="table-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="ALL">Mức độ: Tất cả</option>
                <option value="HIGH">Ưu tiên cao (HIGH)</option>
                <option value="MEDIUM">Trung bình (MEDIUM)</option>
                <option value="LOW">Thấp (LOW)</option>
              </select>
            </div>
          </div>

          <div className="table-responsive-wrap">
            <table className="opp-table">
              <thead>
                <tr>
                  <th style={{ width: '32px' }}>#</th>
                  <th>Chủ đề / Ý tưởng nội dung</th>
                  <th>Mức ưu tiên</th>
                  <th>Điểm tiềm năng</th>
                  <th>Ngày tạo</th>
                  <th style={{ textAlign: 'center' }}>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>
                      <Loader2 size={16} className="spin" style={{ display: 'inline', marginRight: 6 }} />
                      Đang tải cơ hội từ máy chủ...
                    </td>
                  </tr>
                ) : filteredOpportunities.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                      {opportunities.length === 0
                        ? 'Chưa có bản ghi cơ hội nào trong database. Hãy kích hoạt n8n workflow WF07 để phát hiện cơ hội.'
                        : 'Không tìm thấy cơ hội nào phù hợp với bộ lọc.'}
                    </td>
                  </tr>
                ) : (
                  filteredOpportunities.map((item, idx) => {
                    const isCurrent = item.id === selectedOpp?.id;
                    const isHigh =
                      item.priority.toLowerCase().includes('cao') || item.priority.toUpperCase() === 'HIGH';
                    return (
                      <tr
                        key={item.id}
                        className={`opp-row ${isCurrent ? 'row-active' : ''}`}
                        onClick={() => setSelectedOppId(item.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td className="text-muted-cell font-semibold">{idx + 1}</td>
                        <td>
                          <span className="opp-title-text" style={{ fontWeight: 600 }}>
                            {item.title}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge-level ${isHigh ? 'cao' : 'trung bình'}`}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td className="font-bold">
                          <span style={{ color: Number(item.score) >= 70 ? '#16a34a' : '#2563eb' }}>
                            {item.score}/100
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—'}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="action-icon-btn view"
                            title="Xem chi tiết"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOppId(item.id);
                            }}
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="table-pagination-footer">
            <span className="pagination-info">
              Hiển thị {filteredOpportunities.length} / {opportunities.length} cơ hội
            </span>
          </div>
        </div>

        {/* Right Column: Detail Panel */}
        <div className="ui-card wf07-detail-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <Lightbulb size={18} className="text-primary" />
              <span>Chi tiết cơ hội nội dung</span>
            </div>
            {filteredOpportunities.length > 1 && (
              <div className="detail-nav-arrows">
                <button
                  type="button"
                  className="detail-arrow-btn"
                  onClick={() => {
                    const i = filteredOpportunities.findIndex((o) => o.id === selectedOpp?.id);
                    if (i > 0) setSelectedOppId(filteredOpportunities[i - 1].id);
                  }}
                  title="Cơ hội trước"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  className="detail-arrow-btn"
                  onClick={() => {
                    const i = filteredOpportunities.findIndex((o) => o.id === selectedOpp?.id);
                    if (i >= 0 && i < filteredOpportunities.length - 1) {
                      setSelectedOppId(filteredOpportunities[i + 1].id);
                    }
                  }}
                  title="Cơ hội tiếp theo"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>

          {selectedOpp ? (
            <>
              <div className="opp-meta-row" style={{ marginTop: 12 }}>
                <h3 className="opp-detail-title" style={{ fontSize: 17, fontWeight: 700 }}>
                  {selectedOpp.title}
                </h3>
                <div className="opp-platform-badge-line" style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="platform-pill-red" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <YoutubeIcon size={13} className="yt-icon" /> YouTube
                  </span>
                  <span className="badge-opp-high" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Flame size={12} /> Ưu tiên: {selectedOpp.priority}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Điểm: {selectedOpp.score}/100
                  </span>
                </div>
              </div>

              <div className="detail-tabs-nav" style={{ marginTop: 14 }}>
                <button
                  className={`detail-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ai')}
                >
                  Lý do phân tích
                </button>
                <button
                  className={`detail-tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
                  onClick={() => setActiveTab('evidence')}
                >
                  Bằng chứng dữ liệu
                </button>
              </div>

              {/* Details Content */}
              <div style={{ marginTop: 14 }}>
                {activeTab === 'ai' && (
                  <div className="opp-box" style={{ padding: 14, background: '#f8fafc', borderRadius: 8 }}>
                    <h5 className="opp-box-header" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      <Check size={14} className="text-success" /> Tại sao đây là cơ hội tiềm năng?
                    </h5>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-main)' }}>
                      {selectedOpp.reason || 'Chưa có thông tin lý do phân tích.'}
                    </p>
                  </div>
                )}

                {activeTab === 'evidence' && (
                  <div className="opp-box" style={{ padding: 14, background: '#f8fafc', borderRadius: 8 }}>
                    <h5 className="opp-box-header" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      <ShieldCheck size={14} className="text-primary" /> Bằng chứng trích xuất từ dữ liệu:
                    </h5>
                    {getEvidenceList(selectedOpp.evidence).length === 0 ? (
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Chưa có dữ liệu bằng chứng kèm theo.</p>
                    ) : (
                      <ul style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
                        {getEvidenceList(selectedOpp.evidence).map((ev, i) => (
                          <li key={i} style={{ marginBottom: 6 }}>{ev}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Action Box: Copy Title */}
              <div className="suggested-titles-box" style={{ marginTop: 16 }}>
                <div className="suggested-title-header">
                  <Lightbulb size={14} className="text-primary" />
                  <span>Tiêu đề cơ hội</span>
                </div>
                <div className="titles-copy-list" style={{ marginTop: 8 }}>
                  <div className="title-copy-item">
                    <span className="title-txt">• {selectedOpp.title}</span>
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={() => copyTitle(selectedOpp.title)}
                      title="Sao chép tiêu đề"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
              {loading ? 'Đang tải chi tiết...' : 'Chọn một cơ hội từ danh sách bên trái để xem phân tích chi tiết.'}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ROW: 2 PANELS */}
      <div className="wf07-bottom-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Card 1: Phân bố mức độ ưu tiên */}
        <div className="ui-card wf07-cat-donut-card">
          <div className="card-section-title">
            <PieChart size={16} className="text-primary" />
            <span>Phân bố mức độ ưu tiên</span>
          </div>

          <div className="donut-content-row" style={{ marginTop: 16 }}>
            <div className="donut-svg-wrap">
              <div className="donut-center-label">
                <span className="donut-center-number">{opportunities.length}</span>
                <span className="donut-center-sub">Cơ hội</span>
              </div>
            </div>

            <div className="donut-legend-stack">
              <div className="donut-legend-item">
                <span className="legend-dot red" style={{ background: '#ef4444' }} />
                <div className="legend-meta">
                  <span className="legend-name">Ưu tiên cao</span>
                  <span className="legend-val">{priorityStats.high}</span>
                </div>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot orange" style={{ background: '#f59e0b' }} />
                <div className="legend-meta">
                  <span className="legend-name">Ưu tiên trung bình</span>
                  <span className="legend-val">{priorityStats.med}</span>
                </div>
              </div>
              <div className="donut-legend-item">
                <span className="legend-dot blue" style={{ background: '#3b82f6' }} />
                <div className="legend-meta">
                  <span className="legend-name">Khác / Thấp</span>
                  <span className="legend-val">{priorityStats.low}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Hướng dẫn hành động từ cơ hội */}
        <div className="ui-card" style={{ padding: 20 }}>
          <div className="card-section-title">
            <TrendingUp size={16} className="text-primary" />
            <span>Khuyến nghị từ hệ thống</span>
          </div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, lineHeight: 1.6 }}>
            <p>
              • <strong>Tập trung vào cơ hội điểm cao</strong>: Các cơ hội có điểm từ 70 trở lên phản ánh khoảng trống thị trường lớn hoặc đối thủ chưa khai thác triệt để.
            </p>
            <p>
              • <strong>Kiểm tra bằng chứng dữ liệu</strong>: Xem xét kỹ các tiêu đề, mô tả và chỉ số đối thủ trong tab &quot;Bằng chứng dữ liệu&quot; trước khi lập kế hoạch sản xuất.
            </p>
            <p>
              • <strong>Liên kết sang WF09</strong>: Tích hợp các cơ hội này vào chiến lược tổng thể và lên lịch xuất báo cáo định kỳ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
