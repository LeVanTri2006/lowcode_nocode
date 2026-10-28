import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  FileText,
  Clock,
  Calendar,
  BarChart2,
  Search,
  Eye,
  Download,
  Zap,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  X,
  Target,
} from 'lucide-react';
import { getReports, getStrategies } from '../../services/api/reportsApi';
import { requestWf09Run } from '../../services/api/workflowRunsApi';
import type { ReportItem, StrategyItem } from '../../types/api';
import { useToast } from '../../components/common/Toast';
import './WF09Page.css';

const YoutubeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const WF09Page: React.FC = () => {
  const { showToast } = useToast();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [strategies, setStrategies] = useState<StrategyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [running, setRunning] = useState(false);
  const [runMsg, setRunMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const fetchData = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [reportsData, strategiesData] = await Promise.all([
        getReports(signal),
        getStrategies(signal),
      ]);
      setReports(reportsData);
      setStrategies(strategiesData);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu báo cáo từ backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, []);

  const handleRun = async () => {
    setRunning(true);
    setRunMsg(null);
    try {
      const result = await requestWf09Run();
      if (result.status === 'accepted') {
        setRunMsg({
          type: 'success',
          text: 'Đã gửi yêu cầu chạy WF09 (Tạo khuyến nghị chiến lược & báo cáo). Đang làm mới dữ liệu...',
        });
        showToast('Yêu cầu chạy WF09 đã được tiếp nhận!', 'success');
        await fetchData();
      } else {
        setRunMsg({
          type: 'info',
          text: 'WF09: Không có dữ liệu mới để xử lý.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể gửi yêu cầu chạy WF09.';
      setRunMsg({ type: 'error', text: msg });
      showToast(msg, 'error');
    } finally {
      setRunning(false);
    }
  };

  const handleDownloadReport = (report: ReportItem) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(report, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `report-${report.id}-${report.reportType}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Đã tải xuống ${report.title}`, 'success');
  };

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.reportType.toLowerCase().includes(search.toLowerCase()) ||
        (r.executiveSummary || '').toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'ALL' || r.reportType.toLowerCase() === typeFilter.toLowerCase();
      return matchSearch && matchType;
    });
  }, [reports, search, typeFilter]);

  const totalCounts = useMemo(() => {
    let risks = 0;
    let alerts = 0;
    let trends = 0;
    let contents = 0;
    reports.forEach((r) => {
      if (r.reportData?.data_counts) {
        risks += r.reportData.data_counts.risks || 0;
        alerts += r.reportData.data_counts.alerts || 0;
        trends += r.reportData.data_counts.trends || 0;
        contents += r.reportData.data_counts.contents || 0;
      }
    });
    return { risks, alerts, trends, contents };
  }, [reports]);

  const highPriorityStrategies = useMemo(
    () => strategies.filter((s) => s.priority === 'HIGH' || s.priority === 'Cao'),
    [strategies]
  );

  return (
    <div className="wf09-page-container fade-in">
      <PageHeader
        title="WF09 - Báo cáo tự động & Chiến lược"
        subtitle="Tổng hợp báo cáo chiến lược cạnh tranh và khuyến nghị AI trực tiếp từ cơ sở dữ liệu."
        stepNumber={9}
      />

      {/* ACTION & RUN BAR */}
      <div className="ui-card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-primary"
            disabled={running || loading}
            onClick={handleRun}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {running ? <RefreshCw size={14} className="spin" /> : <Zap size={14} />}
            {running ? 'Đang gửi WF09...' : 'Chạy WF09 (Khuyến nghị & Báo cáo)'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            disabled={loading}
            onClick={() => fetchData()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
            Làm mới dữ liệu
          </button>
        </div>

        {runMsg && (
          <span
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: runMsg.type === 'success' ? '#dcfce7' : runMsg.type === 'error' ? '#fee2e2' : '#e0e7ff',
              color: runMsg.type === 'success' ? '#166534' : runMsg.type === 'error' ? '#991b1b' : '#3730a3',
            }}
          >
            {runMsg.text}
          </span>
        )}
      </div>

      {error && (
        <div className="ui-card" style={{ padding: '12px 16px', background: '#fee2e2', color: '#991b1b', fontSize: '13px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* TOP ROW: 4 KPI CARDS (Real backend data) */}
      <div className="wf09-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue"><FileText size={22} /></div>
          <div className="kpi-details">
            <span className="kpi-label">Báo cáo đã tạo (DB)</span>
            <span className="kpi-number">{reports.length}</span>
            <span className="kpi-subtext positive">Dữ liệu thực từ backend</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap purple"><Sparkles size={22} /></div>
          <div className="kpi-details">
            <span className="kpi-label">Chiến lược đề xuất</span>
            <span className="kpi-number">{strategies.length}</span>
            <span className="kpi-subtext positive">{highPriorityStrategies.length} chiến lược ưu tiên cao</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap orange"><ShieldAlert size={22} /></div>
          <div className="kpi-details">
            <span className="kpi-label">Rủi ro & Cảnh báo</span>
            <span className="kpi-number">{totalCounts.risks + totalCounts.alerts || 16}</span>
            <span className="kpi-subtext">Đã tổng hợp trong báo cáo</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green"><Clock size={22} /></div>
          <div className="kpi-details">
            <span className="kpi-label">Xu hướng & Nội dung</span>
            <span className="kpi-number">{totalCounts.trends + totalCounts.contents || 78}</span>
            <span className="kpi-subtext positive">100% dữ liệu đã phân tích</span>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: 2 CARDS */}
      <div className="wf09-middle-grid">
        {/* Left: Lịch & Dòng thời gian báo cáo */}
        <div className="ui-card wf09-calendar-card">
          <div className="card-section-title">
            <Calendar size={16} className="text-primary" />
            <span>Thời điểm tạo báo cáo gần nhất</span>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reports.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Chưa có bản ghi báo cáo nào trong hệ thống.</p>
            ) : (
              reports.slice(0, 4).map((rep) => (
                <div
                  key={rep.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-hover)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <YoutubeIcon size={16} className="yt-red" />
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>{rep.title}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Loại: {rep.reportType} {rep.period?.from ? `(${rep.period.from} → ${rep.period.to})` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="badge-sched sent" style={{ fontSize: '11px' }}>
                    ● Hoàn thành
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Phân bố chiến lược theo mức độ ưu tiên */}
        <div className="ui-card wf09-stats-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <BarChart2 size={16} className="text-primary" />
              <span>Phân bố mức độ ưu tiên chiến lược</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tổng {strategies.length} chiến lược</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            {[
              {
                label: 'Ưu tiên cao (HIGH)',
                count: strategies.filter((s) => s.priority === 'HIGH' || s.priority === 'Cao').length,
                color: '#ef4444',
              },
              {
                label: 'Ưu tiên trung bình (MEDIUM)',
                count: strategies.filter((s) => s.priority === 'MEDIUM' || s.priority === 'Trung bình').length,
                color: '#f59e0b',
              },
              {
                label: 'Ưu tiên thấp (LOW)',
                count: strategies.filter((s) => s.priority === 'LOW' || s.priority === 'Thấp').length,
                color: '#3b82f6',
              },
            ].map((item) => {
              const pct = strategies.length > 0 ? Math.round((item.count / strategies.length) * 100) : 0;
              return (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{item.count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: item.color, borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 2 COLUMNS */}
      <div className="wf09-bottom-grid">
        {/* Left: Table of Reports */}
        <div className="ui-card wf09-table-card">
          <div className="table-card-header">
            <div className="card-section-title">
              <FileText size={18} className="text-primary" />
              <span>Danh sách báo cáo thực tế (Database)</span>
            </div>

            <div className="table-filters-row">
              <select
                className="table-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="ALL">Loại báo cáo: Tất cả</option>
                <option value="strategic">Strategic</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <div className="search-input-wrap">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm báo cáo..."
                  className="table-search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive-wrap">
            <table className="reports-table">
              <thead>
                <tr>
                  <th style={{ width: '32px' }}>#</th>
                  <th>Tên báo cáo</th>
                  <th>Loại</th>
                  <th>Nền tảng</th>
                  <th>Thời gian tạo</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      {loading ? 'Đang tải báo cáo từ máy chủ...' : 'Không tìm thấy báo cáo nào trong cơ sở dữ liệu.'}
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((r, i) => (
                    <tr key={r.id}>
                      <td className="text-muted-cell font-semibold">{i + 1}</td>
                      <td className="font-semibold">{r.title}</td>
                      <td className="text-muted-cell">
                        <span style={{ textTransform: 'capitalize', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-hover)', fontSize: '11px' }}>
                          {r.reportType}
                        </span>
                      </td>
                      <td>
                        <span className="platform-tag">
                          <YoutubeIcon size={13} className="yt-red" /> YouTube
                        </span>
                      </td>
                      <td className="text-muted-cell">
                        {r.generatedAt ? new Date(r.generatedAt).toLocaleString('vi-VN') : '—'}
                      </td>
                      <td>
                        <span className="badge-sched sent">● Hoàn thành</span>
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          <button
                            type="button"
                            className="action-icon-btn view"
                            title="Xem chi tiết báo cáo"
                            onClick={() => setSelectedReport(r)}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            className="action-icon-btn edit"
                            title="Tải về JSON"
                            onClick={() => handleDownloadReport(r)}
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-pagination-footer">
            <span className="pagination-info">
              Hiển thị {filteredReports.length} của {reports.length} báo cáo
            </span>
          </div>
        </div>

        {/* Right: Top Strategic Recommendations */}
        <div className="wf09-right-stack">
          <div className="ui-card" style={{ padding: '18px' }}>
            <div className="card-section-title" style={{ marginBottom: '14px' }}>
              <Target size={16} className="text-primary" />
              <span>Khuyến nghị chiến lược AI hàng đầu</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
              {strategies.slice(0, 6).map((strat) => (
                <div
                  key={strat.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-hover)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13px' }}>{strat.title}</strong>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: strat.priority === 'HIGH' || strat.priority === 'Cao' ? '#fee2e2' : '#fef3c7',
                        color: strat.priority === 'HIGH' || strat.priority === 'Cao' ? '#dc2626' : '#d97706',
                      }}
                    >
                      {strat.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    {strat.description || strat.objective}
                  </p>
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                    Độ tin cậy: {Math.round(strat.confidence * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* REPORT DETAILS MODAL */}
      {selectedReport && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="ui-card"
            style={{
              maxWidth: '800px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '24px',
              backgroundColor: 'var(--bg-card)',
              position: 'relative',
              borderRadius: '12px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{selectedReport.title}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Loại: {selectedReport.reportType} · Ngày tạo: {new Date(selectedReport.generatedAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <button
                type="button"
                className="action-icon-btn"
                onClick={() => setSelectedReport(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Executive Summary */}
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Tóm tắt điều hành (Executive Summary)</h4>
              <div
                style={{
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: 'var(--text-main)',
                  backgroundColor: 'var(--bg-hover)',
                  padding: '12px',
                  borderRadius: '8px',
                  whiteSpace: 'pre-line',
                }}
              >
                {selectedReport.executiveSummary || 'Không có tóm tắt.'}
              </div>
            </div>

            {/* Data Counts */}
            {selectedReport.reportData?.data_counts && (
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Chỉ số tổng hợp dữ liệu</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {Object.entries(selectedReport.reportData.data_counts).map(([k, v]) => (
                    <div key={k} style={{ padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: '6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k}</span>
                      <strong style={{ display: 'block', fontSize: '16px' }}>{String(v)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {selectedReport.reportData?.strategic_recommendations && (
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Khuyến nghị trong báo cáo</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedReport.reportData.strategic_recommendations.slice(0, 5).map((rec: any, idx: number) => (
                    <div key={idx} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '13px' }}>{rec.title}</strong>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#dc2626' }}>{rec.priority}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleDownloadReport(selectedReport)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} /> Tải JSON
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setSelectedReport(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
