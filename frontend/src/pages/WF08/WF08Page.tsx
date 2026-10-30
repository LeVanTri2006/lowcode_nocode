import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  Search,
  Eye,
  RotateCw,
  Loader2,
  AlertCircle,
  FileCheck,
  Info,
  X,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { getRisks } from '../../services/api/risksApi';
import type { RiskItem } from '../../types/api';
import './WF08Page.css';

interface ParsedEvidence {
  rawEvidence?: string;
  impactAnalysis?: string;
  mitigationStrategy?: string;
  recommendedAction?: string;
  description?: string;
  rank?: number | string;
  score?: number | string;
  otherItems: { label: string; value: string }[];
}

export const WF08Page: React.FC = () => {
  const navigate = useNavigate();
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedRiskId, setSelectedRiskId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRisks(signal);
      setRisks(data);
      if (data.length > 0) {
        setSelectedRiskId((prev) => (prev !== null && data.some((r) => r.id === prev) ? prev : data[0].id));
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu rủi ro từ máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredRisks = useMemo(() => {
    return risks.filter((risk) => {
      const matchSearch =
        risk.title.toLowerCase().includes(search.toLowerCase()) ||
        risk.reason.toLowerCase().includes(search.toLowerCase());
      const matchSeverity =
        severityFilter === 'ALL' ||
        risk.severity.toLowerCase() === severityFilter.toLowerCase() ||
        (severityFilter === 'HIGH' &&
          (risk.severity.toUpperCase() === 'HIGH' || risk.severity.toLowerCase().includes('cao')));
      return matchSearch && matchSeverity;
    });
  }, [risks, search, severityFilter]);

  const selectedRisk = useMemo(() => {
    return (
      filteredRisks.find((r) => r.id === selectedRiskId) ||
      filteredRisks[0] ||
      null
    );
  }, [filteredRisks, selectedRiskId]);

  const selectedRiskIndex = useMemo(() => {
    if (!selectedRisk) return -1;
    return filteredRisks.findIndex((r) => r.id === selectedRisk.id);
  }, [filteredRisks, selectedRisk]);

  const highSeverityCount = useMemo(() => {
    return risks.filter(
      (r) =>
        r.severity.toUpperCase() === 'HIGH' ||
        r.severity.toLowerCase().includes('cao') ||
        Number(r.score) >= 70
    ).length;
  }, [risks]);

  const averageRiskScore = useMemo(() => {
    if (risks.length === 0) return 0;
    const sum = risks.reduce((acc, r) => acc + Number(r.score || 0), 0);
    return Math.round(sum / risks.length);
  }, [risks]);

  // Helper to parse DB JSON evidence into human-friendly Vietnamese sections
  const parseEvidence = (evidence: any): ParsedEvidence => {
    if (!evidence) {
      return { otherItems: [] };
    }

    if (typeof evidence === 'object' && !Array.isArray(evidence)) {
      const rawEvidence = evidence.raw_evidence || evidence.rawEvidence || evidence.evidence;
      const impactAnalysis = evidence.impact_analysis || evidence.impactAnalysis || evidence.impact;
      const mitigationStrategy = evidence.mitigation_strategy || evidence.mitigationStrategy;
      const recommendedAction = evidence.recommended_action || evidence.recommendedAction || evidence.action;
      const description = evidence.description || evidence.desc;
      const rank = evidence.rank;
      const score = evidence.score;

      const standardKeys = new Set([
        'raw_evidence',
        'rawEvidence',
        'evidence',
        'impact_analysis',
        'impactAnalysis',
        'impact',
        'mitigation_strategy',
        'mitigationStrategy',
        'recommended_action',
        'recommendedAction',
        'action',
        'description',
        'desc',
        'rank',
        'score',
      ]);

      const vietnameseKeyMap: Record<string, string> = {
        detected_at: 'Thời điểm ghi nhận',
        detectedAt: 'Thời điểm ghi nhận',
        platform: 'Nền tảng mạng xã hội',
        competitor: 'Đối thủ cạnh tranh liên quan',
        competitors: 'Các đối thủ cạnh tranh',
        growth_rate: 'Tốc độ tăng trưởng',
        growthRate: 'Tốc độ tăng trưởng',
        metrics: 'Chỉ số đo lường',
        source: 'Nguồn phát hiện',
        status: 'Trạng thái xử lý',
        channel: 'Kênh theo dõi',
        views: 'Lượt xem liên quan',
        keywords: 'Từ khóa liên quan',
      };

      const otherItems: { label: string; value: string }[] = [];
      for (const [key, value] of Object.entries(evidence)) {
        if (!standardKeys.has(key) && value !== undefined && value !== null) {
          const label = vietnameseKeyMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          const stringVal = typeof value === 'object' ? JSON.stringify(value) : String(value);
          otherItems.push({ label, value: stringVal });
        }
      }

      return {
        rawEvidence: rawEvidence ? String(rawEvidence) : undefined,
        impactAnalysis: impactAnalysis ? String(impactAnalysis) : undefined,
        mitigationStrategy: mitigationStrategy ? String(mitigationStrategy) : undefined,
        recommendedAction: recommendedAction ? String(recommendedAction) : undefined,
        description: description ? String(description) : undefined,
        rank,
        score,
        otherItems,
      };
    }

    if (Array.isArray(evidence)) {
      return {
        rawEvidence: evidence.join('; '),
        otherItems: [],
      };
    }

    return {
      rawEvidence: String(evidence),
      otherItems: [],
    };
  };

  const parsedEvidence = useMemo(() => {
    return parseEvidence(selectedRisk?.evidence);
  }, [selectedRisk]);

  const handleOpenModalFor = (riskId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedRiskId(riskId);
    setIsModalOpen(true);
  };

  const handlePrevRisk = () => {
    if (selectedRiskIndex > 0) {
      setSelectedRiskId(filteredRisks[selectedRiskIndex - 1].id);
    }
  };

  const handleNextRisk = () => {
    if (selectedRiskIndex < filteredRisks.length - 1) {
      setSelectedRiskId(filteredRisks[selectedRiskIndex + 1].id);
    }
  };

  const getSeverityPillClass = (sev: string) => {
    const s = sev.toLowerCase();
    if (s.includes('high') || s.includes('cao')) return 'severity-pill high';
    if (s.includes('medium') || s.includes('trung')) return 'severity-pill medium';
    return 'severity-pill low';
  };

  return (
    <div className="wf08-page-container fade-in">
      <PageHeader
        title="WF08 - Phân tích rủi ro chiến lược"
        subtitle="Theo dõi, phát hiện và đánh giá mức độ nghiêm trọng của các rủi ro cạnh tranh từ dữ liệu thực tế."
        stepNumber={8}
        actions={
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fetchData()}
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            {loading ? <Loader2 size={14} className="spin" /> : <RotateCw size={14} />}
            <span>{loading ? 'Đang tải...' : 'Làm mới dữ liệu'}</span>
          </button>
        }
      />

      {loading && (
        <div role="status" className="ui-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14 }}>
          <Loader2 size={18} className="spin text-primary" />
          <span>Đang tải dữ liệu rủi ro chiến lược từ máy chủ…</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="ui-card"
          style={{
            padding: 14,
            backgroundColor: '#fef2f2',
            borderLeft: '4px solid #ef4444',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} />
            <span>Không tải được dữ liệu: {error}</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fetchData()}
            style={{ padding: '4px 10px', fontSize: 12 }}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* TOP ROW: 4 KPI CARDS */}
      <div className="wf08-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap red">
            <ShieldAlert size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng rủi ro phát hiện</span>
            <span className="kpi-number">{loading ? '…' : risks.length}</span>
            <span className="kpi-subtext">Dữ liệu từ API Backend</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap orange">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Rủi ro mức độ cao</span>
            <span className="kpi-number">{loading ? '…' : highSeverityCount}</span>
            <span className="kpi-subtext">Cần hành động ứng phó ngay</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap purple">
            <Flame size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Điểm rủi ro trung bình</span>
            <span className="kpi-number">{loading ? '…' : `${averageRiskScore}/100`}</span>
            <span className="kpi-subtext">Chỉ số rủi ro toàn hệ thống</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green">
            <FileCheck size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Rủi ro trong bộ lọc</span>
            <span className="kpi-number">{loading ? '…' : filteredRisks.length}</span>
            <span className="kpi-subtext">Theo từ khóa & tiêu chí</span>
          </div>
        </div>
      </div>

      {/* MAIN SECTION: 2 COLUMNS (TABLE & DETAIL) */}
      <div className="wf08-main-grid">
        {/* Left Column: Risk Table */}
        <div className="ui-card wf08-table-card">
          <div className="risk-filter-row">
            <div className="card-section-title" style={{ margin: 0 }}>
              <ShieldAlert size={18} className="text-primary" />
              <span>Danh sách rủi ro cạnh tranh</span>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="risk-search-box">
                <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm rủi ro..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="risk-search-input"
                />
              </div>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="risk-select"
              >
                <option value="ALL">Mức độ: Tất cả</option>
                <option value="HIGH">Nghiêm trọng (HIGH)</option>
                <option value="MEDIUM">Trung bình (MEDIUM)</option>
                <option value="LOW">Thấp (LOW)</option>
              </select>
            </div>
          </div>

          <div className="risk-table-wrap">
            <table className="risk-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Tiêu đề rủi ro</th>
                  <th>Mức độ</th>
                  <th>Điểm</th>
                  <th>Ngày phát hiện</th>
                  <th style={{ textAlign: 'center', width: 56 }}>Xem</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 28 }}>
                      <Loader2 size={16} className="spin" style={{ display: 'inline', marginRight: 6 }} />
                      Đang tải danh sách rủi ro...
                    </td>
                  </tr>
                ) : filteredRisks.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 28, color: 'var(--text-muted)' }}>
                      {risks.length === 0
                        ? 'Chưa có bản ghi rủi ro nào trong hệ thống.'
                        : 'Không tìm thấy rủi ro phù hợp với bộ lọc.'}
                    </td>
                  </tr>
                ) : (
                  filteredRisks.map((item, idx) => {
                    const isSelected = item.id === selectedRisk?.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedRiskId(item.id)}
                        className={`risk-table-row ${isSelected ? 'is-active' : ''}`}
                      >
                        <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          <div style={{ wordBreak: 'break-word', lineHeight: 1.4 }}>{item.title}</div>
                        </td>
                        <td>
                          <span className={getSeverityPillClass(item.severity)}>{item.severity}</span>
                        </td>
                        <td
                          style={{
                            fontWeight: 700,
                            color: Number(item.score) >= 70 ? '#dc2626' : '#2563eb',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.score}/100
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—'}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="risk-action-eye-btn"
                            title="Nhấn để mở xem chi tiết rủi ro toàn diện"
                            onClick={(e) => handleOpenModalFor(item.id, e)}
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Risk Detail Card */}
        <div className="ui-card wf08-detail-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: 12,
              gap: 10,
            }}
          >
            <div className="card-section-title" style={{ margin: 0 }}>
              <AlertTriangle size={18} className="text-primary" />
              <span>Chi tiết rủi ro chiến lược</span>
            </div>

            {selectedRisk && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '5px 10px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                onClick={() => setIsModalOpen(true)}
                title="Mở toàn màn hình xem đầy đủ thông tin"
              >
                <Maximize2 size={13} />
                <span>Xem chi tiết</span>
              </button>
            )}
          </div>

          {selectedRisk ? (
            <div className="risk-detail-content">
              {/* Header Info */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {selectedRisk.title}
                  </h4>
                  <span className={getSeverityPillClass(selectedRisk.severity)}>
                    {selectedRisk.severity}
                  </span>
                </div>

                <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  <strong>Điểm rủi ro:</strong>{' '}
                  <span
                    style={{
                      fontWeight: 800,
                      color: Number(selectedRisk.score) >= 70 ? '#dc2626' : '#2563eb',
                    }}
                  >
                    {selectedRisk.score}/100
                  </span>
                  {' · '}
                  <span>Phát hiện: {new Date(selectedRisk.createdAt).toLocaleDateString('vi-VN')}</span>
                  {parsedEvidence.rank && (
                    <>
                      {' · '}
                      <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        Thứ hạng ưu tiên: #{parsedEvidence.rank}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* 1. Reason Box */}
              <div className="risk-evidence-block reason">
                <div className="risk-evidence-title">
                  <Info size={16} style={{ color: '#9333EA' }} />
                  <span>Nguyên nhân & Đánh giá rủi ro</span>
                </div>
                <div className="risk-evidence-body">
                  {selectedRisk.reason || 'Chưa có phân tích nguyên nhân cụ thể.'}
                </div>
              </div>

              {/* 2. Market Evidence Box (Dữ liệu thực tế thị trường) */}
              <div className="risk-evidence-block market">
                <div className="risk-evidence-title">
                  <TrendingUp size={16} style={{ color: '#0284C7' }} />
                  <span>Bằng chứng & Số liệu thực tế từ thị trường</span>
                </div>
                <div className="risk-evidence-body">
                  {parsedEvidence.rawEvidence ? (
                    parsedEvidence.rawEvidence
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Chưa có số liệu cảnh báo kèm theo.</span>
                  )}
                </div>
              </div>

              {/* 3. Impact Analysis Box (Đánh giá mức độ tác động) */}
              {parsedEvidence.impactAnalysis && (
                <div className="risk-evidence-block impact">
                  <div className="risk-evidence-title">
                    <AlertTriangle size={16} style={{ color: '#D97706' }} />
                    <span>Đánh giá mức độ tác động cạnh tranh</span>
                  </div>
                  <div className="risk-evidence-body">{parsedEvidence.impactAnalysis}</div>
                </div>
              )}

              {/* 4. Strategy & Action Box (Chiến lược hóa giải & Hành động đề xuất) */}
              {(parsedEvidence.mitigationStrategy || parsedEvidence.recommendedAction) && (
                <div className="risk-evidence-block strategy">
                  <div className="risk-evidence-title">
                    <ShieldCheck size={16} style={{ color: '#16A34A' }} />
                    <span>Chiến lược hóa giải & Hành động ứng phó đề xuất</span>
                  </div>
                  <div className="risk-evidence-body">
                    {parsedEvidence.mitigationStrategy || parsedEvidence.recommendedAction}
                  </div>
                </div>
              )}

              {/* Other Extracted Market Fields */}
              {parsedEvidence.otherItems.length > 0 && (
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Thông tin trích xuất mở rộng
                  </span>
                  <div className="risk-evidence-extra-grid">
                    {parsedEvidence.otherItems.map((item, idx) => (
                      <div key={idx} className="risk-extra-pill">
                        <span className="risk-extra-label">{item.label}</span>
                        <span className="risk-extra-val">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Banner to WF09 */}
              <div
                style={{
                  marginTop: 6,
                  padding: 14,
                  backgroundColor: '#F0FDF4',
                  borderRadius: 10,
                  border: '1px solid #BBF7D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>
                    Sẵn sàng ứng phó rủi ro này?
                  </div>
                  <div style={{ fontSize: 12, color: '#15803D', marginTop: 2 }}>
                    Chuyển sang WF09 để tạo chiến lược nội dung hóa giải ngay.
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate('/wf09')}
                  style={{ fontSize: 12, padding: '7px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <span>Chuyển sang WF09</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              {loading ? 'Đang tải chi tiết...' : 'Chọn một rủi ro từ bảng bên trái hoặc nhấn icon con mắt để xem chi tiết.'}
            </div>
          )}
        </div>
      </div>

      {/* FULL COMPREHENSIVE DETAIL MODAL */}
      {isModalOpen && selectedRisk && (
        <div className="risk-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="risk-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="risk-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                    Chi tiết rủi ro chiến lược #{selectedRisk.id}
                  </h3>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    Dữ liệu phân tích chuyên sâu thị trường
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                title="Đóng hộp thoại"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="risk-modal-body">
              {/* Risk Title & Severity */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.35 }}>
                  {selectedRisk.title}
                </h2>
                <span className={getSeverityPillClass(selectedRisk.severity)} style={{ padding: '4px 12px', fontSize: 12 }}>
                  Mức độ: {selectedRisk.severity}
                </span>
              </div>

              {/* Stat Bar */}
              <div className="modal-stat-bar">
                <div className="modal-stat-item">
                  <span className="modal-stat-label">Điểm rủi ro</span>
                  <span
                    className="modal-stat-val"
                    style={{ color: Number(selectedRisk.score) >= 70 ? '#dc2626' : '#2563eb' }}
                  >
                    {selectedRisk.score}/100
                  </span>
                </div>
                <div className="modal-stat-item">
                  <span className="modal-stat-label">Mức ưu tiên</span>
                  <span className="modal-stat-val" style={{ color: '#D97706' }}>
                    {parsedEvidence.rank ? `Top #${parsedEvidence.rank}` : 'Ưu tiên cao'}
                  </span>
                </div>
                <div className="modal-stat-item">
                  <span className="modal-stat-label">Ngày phát hiện</span>
                  <span className="modal-stat-val">
                    {new Date(selectedRisk.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="modal-stat-item">
                  <span className="modal-stat-label">Hệ thống ghi nhận</span>
                  <span className="modal-stat-val" style={{ color: '#059669' }}>
                    API Backend
                  </span>
                </div>
              </div>

              {/* 1. Reason */}
              <div className="risk-evidence-block reason">
                <div className="risk-evidence-title">
                  <Info size={16} style={{ color: '#9333EA' }} />
                  <span>Nguyên nhân & Đánh giá rủi ro</span>
                </div>
                <div className="risk-evidence-body">
                  {selectedRisk.reason || 'Chưa có phân tích nguyên nhân cụ thể.'}
                </div>
              </div>

              {/* 2. Market Evidence */}
              <div className="risk-evidence-block market">
                <div className="risk-evidence-title">
                  <TrendingUp size={16} style={{ color: '#0284C7' }} />
                  <span>Bằng chứng & Số liệu thực tế từ thị trường</span>
                </div>
                <div className="risk-evidence-body">
                  {parsedEvidence.rawEvidence ? (
                    parsedEvidence.rawEvidence
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Chưa có số liệu cảnh báo kèm theo.</span>
                  )}
                </div>
              </div>

              {/* 3. Impact Analysis */}
              {parsedEvidence.impactAnalysis && (
                <div className="risk-evidence-block impact">
                  <div className="risk-evidence-title">
                    <AlertTriangle size={16} style={{ color: '#D97706' }} />
                    <span>Đánh giá mức độ tác động cạnh tranh</span>
                  </div>
                  <div className="risk-evidence-body">{parsedEvidence.impactAnalysis}</div>
                </div>
              )}

              {/* 4. Strategy */}
              {(parsedEvidence.mitigationStrategy || parsedEvidence.recommendedAction) && (
                <div className="risk-evidence-block strategy">
                  <div className="risk-evidence-title">
                    <ShieldCheck size={16} style={{ color: '#16A34A' }} />
                    <span>Chiến lược hóa giải & Hành động đề xuất</span>
                  </div>
                  <div className="risk-evidence-body">
                    {parsedEvidence.mitigationStrategy || parsedEvidence.recommendedAction}
                  </div>
                </div>
              )}

              {/* Other Extracted Market Fields */}
              {parsedEvidence.otherItems.length > 0 && (
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Thông tin trích xuất mở rộng
                  </span>
                  <div className="risk-evidence-extra-grid">
                    {parsedEvidence.otherItems.map((item, idx) => (
                      <div key={idx} className="risk-extra-pill">
                        <span className="risk-extra-label">{item.label}</span>
                        <span className="risk-extra-val">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="risk-modal-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handlePrevRisk}
                  disabled={selectedRiskIndex <= 0}
                  style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  <ChevronLeft size={14} />
                  <span>Trước</span>
                </button>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {selectedRiskIndex + 1} / {filteredRisks.length}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleNextRisk}
                  disabled={selectedRiskIndex >= filteredRisks.length - 1}
                  style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  <span>Tiếp</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '6px 14px', fontSize: 12 }}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setIsModalOpen(false);
                    navigate('/wf09');
                  }}
                  style={{ padding: '6px 14px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Layers size={14} />
                  <span>Sang WF09 (Chiến lược)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
