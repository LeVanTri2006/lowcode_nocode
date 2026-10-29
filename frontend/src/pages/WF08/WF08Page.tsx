import React, { useEffect, useMemo, useState } from 'react';
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
  CheckCircle2,
  Info,
} from 'lucide-react';
import { getRisks } from '../../services/api/risksApi';
import type { RiskItem } from '../../types/api';
import './WF08Page.css';

export const WF08Page: React.FC = () => {
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedRiskId, setSelectedRiskId] = useState<number | null>(null);

  const fetchData = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRisks(signal);
      setRisks(data);
      if (data.length > 0 && selectedRiskId === null) {
        setSelectedRiskId(data[0].id);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu rủi ro.');
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
        (severityFilter === 'HIGH' && (risk.severity.toUpperCase() === 'HIGH' || risk.severity.toLowerCase().includes('cao')));
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

  const getEvidenceList = (evidence: any): string[] => {
    if (!evidence) return [];
    if (Array.isArray(evidence)) return evidence.map(String);
    if (typeof evidence === 'object') {
      return Object.entries(evidence).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
    }
    return [String(evidence)];
  };

  return (
    <div className="wf08-page-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <PageHeader
          title="WF08 - Phân tích rủi ro chiến lược"
          subtitle="Theo dõi, phát hiện và đánh giá mức độ nghiêm trọng của các rủi ro cạnh tranh từ dữ liệu thực tế."
          stepNumber={8}
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
          <span>Đang tải dữ liệu rủi ro từ máy chủ…</span>
        </div>
      )}

      {error && (
        <div role="alert" className="ui-card" style={{ padding: 16, backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} />
            <span>Không tải được dữ liệu: {error}</span>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => fetchData()} style={{ padding: '4px 10px', fontSize: 12 }}>
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

      {/* MIDDLE SECTION: 2 COLUMNS (TABLE & DETAIL) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginTop: 10 }}>
        {/* Left Column: Risk Table */}
        <div className="ui-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <ShieldAlert size={18} className="text-primary" />
              Danh sách rủi ro cạnh tranh
            </h3>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm rủi ro..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ padding: '6px 12px 6px 30px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </div>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
              >
                <option value="ALL">Mức độ: Tất cả</option>
                <option value="HIGH">Nghiêm trọng (HIGH)</option>
                <option value="MEDIUM">Trung bình (MEDIUM)</option>
                <option value="LOW">Thấp (LOW)</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px 8px', width: 36 }}>#</th>
                  <th style={{ padding: '10px 8px' }}>Tiêu đề rủi ro</th>
                  <th style={{ padding: '10px 8px' }}>Mức độ</th>
                  <th style={{ padding: '10px 8px' }}>Điểm</th>
                  <th style={{ padding: '10px 8px' }}>Ngày phát hiện</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>Xem</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>
                      <Loader2 size={16} className="spin" style={{ display: 'inline', marginRight: 6 }} />
                      Đang tải danh sách rủi ro...
                    </td>
                  </tr>
                ) : filteredRisks.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                      {risks.length === 0
                        ? 'Chưa có bản ghi rủi ro nào trong hệ thống. Hãy chạy n8n workflow WF08 để phân tích.'
                        : 'Không tìm thấy rủi ro phù hợp.'}
                    </td>
                  </tr>
                ) : (
                  filteredRisks.map((item, idx) => {
                    const isSelected = item.id === selectedRisk?.id;
                    const isHigh =
                      item.severity.toUpperCase() === 'HIGH' || item.severity.toLowerCase().includes('cao');
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedRiskId(item.id)}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <td style={{ padding: '10px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '10px 8px', fontWeight: 600, color: 'var(--text-main)' }}>
                          {item.title}
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 700,
                              backgroundColor: isHigh ? '#fee2e2' : '#fef3c7',
                              color: isHigh ? '#b91c1c' : '#b45309',
                            }}
                          >
                            {item.severity}
                          </span>
                        </td>
                        <td style={{ padding: '10px 8px', fontWeight: 700, color: Number(item.score) >= 70 ? '#dc2626' : '#2563eb' }}>
                          {item.score}/100
                        </td>
                        <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--text-muted)' }}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—'}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRiskId(item.id);
                            }}
                          >
                            <Eye size={12} />
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
        <div className="ui-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, margin: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
            <AlertTriangle size={18} className="text-primary" />
            Chi tiết rủi ro chiến lược
          </h3>

          {selectedRisk ? (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                  {selectedRisk.title}
                </h4>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    backgroundColor: selectedRisk.severity.toUpperCase() === 'HIGH' ? '#fee2e2' : '#fef3c7',
                    color: selectedRisk.severity.toUpperCase() === 'HIGH' ? '#b91c1c' : '#b45309',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {selectedRisk.severity}
                </span>
              </div>

              <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <strong>Điểm rủi ro:</strong>{' '}
                <span style={{ fontWeight: 700, color: Number(selectedRisk.score) >= 70 ? '#dc2626' : '#2563eb' }}>
                  {selectedRisk.score}/100
                </span>
                {' · '}
                <span>Phát hiện: {new Date(selectedRisk.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>

              {/* Reason Box */}
              <div style={{ marginTop: 16, padding: 14, background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid #f59e0b' }}>
                <h5 style={{ margin: '0 0 6px 0', fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Info size={14} className="text-primary" />
                  Nguyên nhân & Đánh giá rủi ro
                </h5>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--text-main)' }}>
                  {selectedRisk.reason || 'Chưa có phân tích nguyên nhân cụ thể.'}
                </p>
              </div>

              {/* Evidence Box */}
              <div style={{ marginTop: 16, padding: 14, background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid #3b82f6' }}>
                <h5 style={{ margin: '0 0 6px 0', fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} className="text-primary" />
                  Bằng chứng trích xuất từ thị trường
                </h5>
                {getEvidenceList(selectedRisk.evidence).length === 0 ? (
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Chưa có dữ liệu bằng chứng kèm theo.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
                    {getEvidenceList(selectedRisk.evidence).map((ev, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{ev}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Mitigation Guidance */}
              <div style={{ marginTop: 16, padding: 12, background: '#f0fdf4', borderRadius: 6, border: '1px solid #bbf7d0', fontSize: 13 }}>
                <strong style={{ color: '#166534' }}>Hành động ứng phó đề xuất:</strong>
                <p style={{ margin: '4px 0 0 0', color: '#166534', lineHeight: 1.5 }}>
                  Chuyển rủi ro này sang WF09 để AI xây dựng chiến lược hóa giải và bù đắp khoảng trống nội dung.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              {loading ? 'Đang tải chi tiết...' : 'Chọn một rủi ro từ bảng bên trái để xem chi tiết.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
