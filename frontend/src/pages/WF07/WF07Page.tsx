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
  X,
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

const FIELD_LABELS: Record<string, string> = {
  rank: 'Thứ hạng cơ hội',
  description: 'Mô tả phân tích dữ liệu',
  potential_score: 'Điểm tiềm năng',
  recommended_action: 'Hành động đề xuất triển khai',
  growth_rate: 'Tốc độ tăng trưởng',
  views: 'Lượt xem trung bình',
  likes: 'Lượt thích',
  comments: 'Bình luận',
  shares: 'Lượt chia sẻ',
  topic: 'Chủ đề',
  competitor: 'Đối thủ cạnh tranh',
  competitor_name: 'Tên đối thủ',
  platform: 'Nền tảng',
  target_audience: 'Khán giả mục tiêu',
  content_format: 'Định dạng nội dung gợi ý',
  content_type: 'Loại nội dung',
  difficulty: 'Độ khó thực hiện',
  impact: 'Mức độ tác động',
  source: 'Nguồn dữ liệu',
  created_at: 'Thời điểm ghi nhận',
  createdAt: 'Thời điểm ghi nhận',
  url: 'Đường dẫn liên quan',
  video_id: 'Mã video tham chiếu',
  content_id: 'Mã nội dung',
  tags: 'Từ khóa liên quan',
  keyword: 'Từ khóa',
  keywords: 'Từ khóa liên quan',
};

const formatFieldKey = (key: string): string => {
  const normalized = key.trim().toLowerCase();
  if (FIELD_LABELS[normalized]) return FIELD_LABELS[normalized];
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatPriority = (priority: string | undefined | null): string => {
  if (!priority) return 'Không xác định';
  const p = priority.toLowerCase().trim();
  if (p === 'high' || p === 'cao') return 'Cao';
  if (p === 'medium' || p.includes('trung') || p === 'med') return 'Trung bình';
  if (p === 'low' || p === 'thấp') return 'Thấp';
  return priority;
};

const getPriorityClass = (priority: string | undefined | null): string => {
  const p = (priority || '').toLowerCase().trim();
  if (p === 'high' || p === 'cao') return 'cao';
  if (p === 'medium' || p.includes('trung') || p === 'med') return 'trung-bình';
  return 'thấp';
};

const formatDate = (value: string | null | undefined): string => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(date);
};

export const WF07Page: React.FC = () => {
  const { showToast } = useToast();
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedOppId, setSelectedOppId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'evidence'>('ai');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const p = item.priority.toLowerCase();
      const matchPriority =
        priorityFilter === 'ALL' ||
        (priorityFilter === 'HIGH' && (p.includes('high') || p.includes('cao'))) ||
        (priorityFilter === 'MEDIUM' && (p.includes('med') || p.includes('trung'))) ||
        (priorityFilter === 'LOW' && (p.includes('low') || p.includes('thap') || p.includes('thấp')));
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

  const handleOpenModalFor = (oppId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedOppId(oppId);
    setIsModalOpen(true);
  };

  const renderEvidenceContent = (evidence: any) => {
    if (!evidence) {
      return <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Chưa có dữ liệu bằng chứng kèm theo.</p>;
    }

    let parsedEvidence = evidence;
    if (typeof evidence === 'string') {
      try {
        parsedEvidence = JSON.parse(evidence);
      } catch {
        return <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-main)' }}>{evidence}</p>;
      }
    }

    if (typeof parsedEvidence === 'object' && parsedEvidence !== null && !Array.isArray(parsedEvidence)) {
      const obj = parsedEvidence as Record<string, any>;
      const entries = Object.entries(obj);
      if (entries.length === 0) {
        return <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Chưa có dữ liệu bằng chứng kèm theo.</p>;
      }

      return (
        <div className="wf07-evidence-container">
          {/* Quick metrics pills */}
          {(obj.rank !== undefined || obj.potential_score !== undefined) && (
            <div className="wf07-evidence-metric-pills">
              {obj.rank !== undefined && (
                <div className="wf07-ev-pill blue">
                  <span className="ev-pill-label">Xếp hạng:</span>
                  <span className="ev-pill-value">#{obj.rank}</span>
                </div>
              )}
              {obj.potential_score !== undefined && (
                <div className="wf07-ev-pill green">
                  <span className="ev-pill-label">Điểm tiềm năng:</span>
                  <span className="ev-pill-value">{obj.potential_score}/100</span>
                </div>
              )}
            </div>
          )}

          {/* Description: Chỉ hiển thị nếu khác với lý do phân tích chính để tránh trùng lặp nội dung */}
          {obj.description && (!selectedOpp?.reason || obj.description.trim() !== selectedOpp.reason.trim()) && (
            <div className="wf07-ev-card desc-card">
              <div className="wf07-ev-card-title">
                <ShieldCheck size={14} className="text-primary" />
                <span>Mô tả phân tích dữ liệu</span>
              </div>
              <p className="wf07-ev-card-text">{String(obj.description)}</p>
            </div>
          )}

          {/* Recommended action */}
          {obj.recommended_action && (
            <div className="wf07-ev-card action-card">
              <div className="wf07-ev-card-title text-success">
                <Target size={14} />
                <span>Hành động đề xuất triển khai</span>
              </div>
              <p className="wf07-ev-card-text">{String(obj.recommended_action)}</p>
            </div>
          )}

          {/* Other fields */}
          {entries.filter(([k]) => !['rank', 'potential_score', 'description', 'recommended_action'].includes(k)).length > 0 && (
            <div className="wf07-ev-other-grid">
              {entries
                .filter(([k]) => !['rank', 'potential_score', 'description', 'recommended_action'].includes(k))
                .map(([k, v]) => (
                  <div key={k} className="wf07-ev-field-row">
                    <span className="wf07-ev-field-label">{formatFieldKey(k)}:</span>
                    <span className="wf07-ev-field-val">
                      {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      );
    }

    if (Array.isArray(parsedEvidence)) {
      return (
        <ul style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
          {parsedEvidence.map((ev, i) => (
            <li key={i} style={{ marginBottom: 6 }}>{String(ev)}</li>
          ))}
        </ul>
      );
    }

    return <p style={{ fontSize: 13, lineHeight: 1.6 }}>{String(parsedEvidence)}</p>;
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
                <option value="HIGH">Ưu tiên cao (Cao)</option>
                <option value="MEDIUM">Ưu tiên trung bình</option>
                <option value="LOW">Ưu tiên thấp</option>
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
                            className={`badge-level ${getPriorityClass(item.priority)}`}
                          >
                            {formatPriority(item.priority)}
                          </span>
                        </td>
                        <td className="font-bold">
                          <span style={{ color: Number(item.score) >= 70 ? '#16a34a' : '#2563eb' }}>
                            {item.score}/100
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {formatDate(item.createdAt)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="action-icon-btn view"
                            title="Xem chi tiết đầy đủ trong hộp thoại"
                            onClick={(e) => handleOpenModalFor(item.id, e)}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {selectedOpp && (
                <button
                  type="button"
                  className="action-icon-btn view"
                  title="Mở hộp thoại xem chi tiết đầy đủ"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Eye size={14} />
                </button>
              )}
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
                  <span className={`badge-opp-${getPriorityClass(selectedOpp.priority)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Flame size={12} /> Ưu tiên: {formatPriority(selectedOpp.priority)}
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
                    <h5 className="opp-box-header" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      <ShieldCheck size={15} className="text-primary" /> Bằng chứng trích xuất từ dữ liệu:
                    </h5>
                    {renderEvidenceContent(selectedOpp.evidence)}
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

      {/* FULL COMPREHENSIVE DETAIL MODAL */}
      {isModalOpen && selectedOpp && (
        <div className="opp-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="opp-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="opp-modal-header">
              <div className="opp-modal-header-left">
                <div className="kpi-icon-wrap purple" style={{ width: 36, height: 36 }}>
                  <Lightbulb size={18} />
                </div>
                <div>
                  <h3 className="opp-modal-title">Chi tiết cơ hội nội dung</h3>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mã định danh: #{selectedOpp.id}</span>
                </div>
              </div>
              <button
                type="button"
                className="opp-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                title="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="opp-modal-body">
              {/* Stat Bar */}
              <div className="opp-modal-stat-bar">
                <div className="opp-modal-stat-item">
                  <span className="opp-modal-stat-label">Điểm tiềm năng</span>
                  <span className="opp-modal-stat-val" style={{ color: Number(selectedOpp.score) >= 70 ? '#16A34A' : '#2563EB' }}>
                    {selectedOpp.score}/100
                  </span>
                </div>
                <div className="opp-modal-stat-item">
                  <span className="opp-modal-stat-label">Mức ưu tiên</span>
                  <span className={`badge-level ${getPriorityClass(selectedOpp.priority)}`} style={{ alignSelf: 'flex-start', marginTop: 2 }}>
                    {formatPriority(selectedOpp.priority)}
                  </span>
                </div>
                <div className="opp-modal-stat-item">
                  <span className="opp-modal-stat-label">Ngày phát hiện</span>
                  <span className="opp-modal-stat-val">{formatDate(selectedOpp.createdAt)}</span>
                </div>
                <div className="opp-modal-stat-item">
                  <span className="opp-modal-stat-label">Nền tảng phân tích</span>
                  <span className="opp-modal-stat-val" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#DC2626' }}>
                    <YoutubeIcon size={14} /> YouTube
                  </span>
                </div>
              </div>

              {/* Title Section */}
              <div className="opp-modal-section">
                <div className="opp-modal-section-title">
                  <Lightbulb size={15} className="text-primary" />
                  <span>Chủ đề / Ý tưởng nội dung đề xuất</span>
                </div>
                <div className="opp-modal-section-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{selectedOpp.title}</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => copyTitle(selectedOpp.title)}
                    style={{ padding: '6px 12px', fontSize: 12, flexShrink: 0 }}
                    title="Sao chép tiêu đề"
                  >
                    <Copy size={13} /> Sao chép
                  </button>
                </div>
              </div>

              {/* Analysis Reason Section */}
              <div className="opp-modal-section">
                <div className="opp-modal-section-title">
                  <Check size={15} className="text-success" />
                  <span>Tại sao đây là cơ hội tiềm năng? (Lý do phân tích)</span>
                </div>
                <div className="opp-modal-section-content">
                  <p style={{ margin: 0, lineHeight: 1.6 }}>{selectedOpp.reason || 'Chưa có thông tin lý do phân tích.'}</p>
                </div>
              </div>

              {/* Evidence Section */}
              <div className="opp-modal-section">
                <div className="opp-modal-section-title">
                  <ShieldCheck size={15} className="text-primary" />
                  <span>Bằng chứng trích xuất từ dữ liệu</span>
                </div>
                <div className="opp-modal-section-content" style={{ background: '#FFFFFF' }}>
                  {renderEvidenceContent(selectedOpp.evidence)}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="opp-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
