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
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Database,
} from 'lucide-react';
import { getReports } from '../../services/api/reportsApi';
import { getStrategies } from '../../services/api/strategiesApi';
import { requestWf09Run } from '../../services/api/workflowRunsApi';
import type { ReportItem, StrategyItem } from '../../types/api';
import { useToast } from '../../components/common/Toast';
import './WF09Page.css';

const YoutubeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const formatReportType = (type?: string): string => {
  if (!type) return 'Chiến lược Cạnh tranh';
  const t = type.toLowerCase().trim();
  if (t === 'competitive_strategy' || t === 'strategic') return 'Chiến lược Cạnh tranh';
  if (t === 'weekly') return 'Báo cáo Tuần';
  if (t === 'monthly') return 'Báo cáo Tháng';
  if (t === 'daily') return 'Báo cáo Ngày';
  if (t === 'market_trend' || t === 'trend') return 'Xu hướng Thị trường';
  if (t === 'performance') return 'Hiệu suất Đối thủ';
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

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
      const formattedType = formatReportType(r.reportType);
      const matchSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.reportType.toLowerCase().includes(search.toLowerCase()) ||
        formattedType.toLowerCase().includes(search.toLowerCase()) ||
        (r.executiveSummary || '').toLowerCase().includes(search.toLowerCase());
      const matchType =
        typeFilter === 'ALL' ||
        r.reportType.toLowerCase() === typeFilter.toLowerCase() ||
        (typeFilter === 'competitive_strategy' && (r.reportType.toLowerCase() === 'competitive_strategy' || r.reportType.toLowerCase() === 'strategic'));
      return matchSearch && matchType;
    });
  }, [reports, search, typeFilter]);

  // Aggregate real data metrics from reports
  const totalCounts = useMemo(() => {
    let risks = 0;
    let alerts = 0;
    let trends = 0;
    let contents = 0;
    let opportunities = 0;

    reports.forEach((r) => {
      const counts = r.reportData?.source_counts || r.reportData?.data_counts;
      if (counts) {
        risks += Number(counts.risks || 0);
        alerts += Number(counts.alerts || 0);
        trends += Number(counts.trends || 0);
        contents += Number(counts.contents || 0);
        opportunities += Number(counts.opportunities || 0);
      }
    });

    return { risks, alerts, trends, contents, opportunities };
  }, [reports]);

  // Priority count with case-insensitive normalization
  const priorityCounts = useMemo(() => {
    let high = 0;
    let medium = 0;
    let low = 0;

    strategies.forEach((s) => {
      const p = (s.priority || '').toLowerCase();
      if (p.includes('high') || p.includes('cao')) {
        high++;
      } else if (p.includes('medium') || p.includes('trung')) {
        medium++;
      } else if (p.includes('low') || p.includes('thấp')) {
        low++;
      } else {
        medium++;
      }
    });

    return { high, medium, low };
  }, [strategies]);

  const priorityStats = useMemo(() => {
    return [
      {
        label: 'Ưu tiên cao (HIGH)',
        count: priorityCounts.high,
        color: '#ef4444',
      },
      {
        label: 'Ưu tiên trung bình (MEDIUM)',
        count: priorityCounts.medium,
        color: '#f59e0b',
      },
      {
        label: 'Ưu tiên thấp (LOW)',
        count: priorityCounts.low,
        color: '#3b82f6',
      },
    ];
  }, [priorityCounts]);

  // Structured recommendations parser for selected report
  const selectedReportRecommendations = useMemo(() => {
    if (!selectedReport?.reportData?.strategic_recommendations) return [];
    const raw = selectedReport.reportData.strategic_recommendations;
    if (!Array.isArray(raw)) return [];

    return raw.map((rec: any, idx: number) => {
      if (typeof rec === 'string') {
        return {
          id: idx + 1,
          title: `Khuyến nghị thực thi #${idx + 1}`,
          description: rec,
          priority: 'Chiến lược đề xuất',
        };
      }
      return {
        id: idx + 1,
        title: rec.title || `Khuyến nghị #${idx + 1}`,
        description: rec.description || rec.action || rec.content || JSON.stringify(rec),
        priority: rec.priority || 'Đề xuất',
      };
    });
  }, [selectedReport]);

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

      {/* TOP ROW: 4 KPI CARDS */}
      <div className="wf09-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue"><FileText size={22} /></div>
          <div className="kpi-details">
            <span className="kpi-label">Báo cáo đã tạo (DB)</span>
            <span className="kpi-number">{loading ? '…' : reports.length}</span>
            <span className="kpi-subtext positive">Dữ liệu thực từ backend</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap purple"><Sparkles size={22} /></div>
          <div className="kpi-details">
            <span className="kpi-label">Chiến lược đề xuất</span>
            <span className="kpi-number">{loading ? '…' : strategies.length}</span>
            <span className="kpi-subtext positive">
              {priorityCounts.high > 0
                ? `${priorityCounts.high} ưu tiên cao`
                : `${priorityCounts.medium} ưu tiên trung bình`}
            </span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap orange"><ShieldAlert size={22} /></div>
          <div className="kpi-details">
            <span className="kpi-label">Rủi ro & Cảnh báo</span>
            <span className="kpi-number">
              {loading ? '…' : totalCounts.risks > 0 ? totalCounts.risks : totalCounts.alerts}
            </span>
            <span className="kpi-subtext">Đã tổng hợp trong báo cáo</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green"><Clock size={22} /></div>
          <div className="kpi-details">
            <span className="kpi-label">Cơ hội & Xu hướng</span>
            <span className="kpi-number">
              {loading ? '…' : totalCounts.opportunities > 0 ? totalCounts.opportunities : strategies.length}
            </span>
            <span className="kpi-subtext positive">100% dữ liệu đã phân tích</span>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: 2 CARDS */}
      <div className="wf09-middle-grid">
        {/* Left: Thời điểm tạo báo cáo gần nhất */}
        <div className="ui-card wf09-calendar-card">
          <div className="card-section-title">
            <Calendar size={16} className="text-primary" />
            <span>Thời điểm tạo báo cáo gần nhất</span>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Đang tải báo cáo gần nhất...</p>
            ) : reports.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Chưa có bản ghi báo cáo nào trong hệ thống.</p>
            ) : (
              reports.slice(0, 4).map((rep) => (
                <div
                  key={rep.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-hover)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <YoutubeIcon size={18} className="yt-red" />
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-main)' }}>
                        {rep.title}
                      </strong>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        Loại:{' '}
                        <strong style={{ color: 'var(--text-secondary)' }}>
                          {formatReportType(rep.reportType)}
                        </strong>
                        {rep.generatedAt ? ` · ${new Date(rep.generatedAt).toLocaleString('vi-VN')}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="badge-sched sent" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
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
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Tổng {strategies.length} chiến lược
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {priorityStats.map((item) => {
              const pct = strategies.length > 0 ? Math.round((item.count / strategies.length) * 100) : 0;
              return (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: item.count > 0 ? item.color : 'var(--text-muted)' }}>
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        backgroundColor: item.color,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                      }}
                    />
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
                <option value="competitive_strategy">Chiến lược Cạnh tranh</option>
                <option value="weekly">Báo cáo Tuần</option>
                <option value="monthly">Báo cáo Tháng</option>
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
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Đang tải danh sách báo cáo...
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Không tìm thấy báo cáo nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((r, i) => (
                    <tr key={r.id}>
                      <td className="text-muted-cell font-semibold">{i + 1}</td>
                      <td className="font-semibold">{r.title}</td>
                      <td>
                        <span className="report-type-badge">
                          {formatReportType(r.reportType)}
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
              {strategies.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Chưa có chiến lược nào từ AI.</p>
              ) : (
                strategies.slice(0, 6).map((strat) => (
                  <div
                    key={strat.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-hover)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>{strat.title}</strong>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor:
                            strat.priority?.toLowerCase() === 'high' ? '#fee2e2' : '#fef3c7',
                          color:
                            strat.priority?.toLowerCase() === 'high' ? '#dc2626' : '#d97706',
                          textTransform: 'uppercase',
                        }}
                      >
                        {strat.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                      {strat.description || strat.objective}
                    </p>
                    <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                      Độ tin cậy: {Math.round((strat.confidence || 0.7) * 100)}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FULL REPORT DETAILS MODAL */}
      {selectedReport && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
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
              maxWidth: '840px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              backgroundColor: 'var(--bg-card)',
              position: 'relative',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {selectedReport.title}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Loại: <strong style={{ color: 'var(--primary)' }}>{formatReportType(selectedReport.reportType)}</strong>
                  {' · '}
                  Ngày tạo: {new Date(selectedReport.generatedAt).toLocaleString('vi-VN')}
                </div>
              </div>
              <button
                type="button"
                className="action-icon-btn"
                onClick={() => setSelectedReport(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                title="Đóng hộp thoại"
              >
                <X size={20} />
              </button>
            </div>

            {/* 1. Executive Summary */}
            <div style={{ marginTop: '18px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} className="text-primary" />
                <span>Tóm tắt điều hành (Executive Summary)</span>
              </h4>
              <div
                style={{
                  fontSize: '13px',
                  lineHeight: '1.65',
                  color: 'var(--text-main)',
                  backgroundColor: '#F8FAFC',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  borderLeft: '4px solid #3B82F6',
                }}
              >
                {selectedReport.executiveSummary || 'Không có bản tóm tắt điều hành.'}
              </div>
            </div>

            {/* 2. Source Counts (Chỉ số dữ liệu tổng hợp) */}
            {selectedReport.reportData?.source_counts && (
              <div style={{ marginTop: '18px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database size={16} className="text-primary" />
                  <span>Dữ liệu thị trường đã tổng hợp</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#991B1B', fontWeight: 600 }}>RỦI RO THỊ TRƯỜNG</span>
                    <strong style={{ display: 'block', fontSize: '18px', color: '#DC2626', marginTop: 2 }}>
                      {selectedReport.reportData.source_counts.risks ?? 0}
                    </strong>
                  </div>
                  <div style={{ padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>CƠ HỘI NỘI DUNG</span>
                    <strong style={{ display: 'block', fontSize: '18px', color: '#16A34A', marginTop: 2 }}>
                      {selectedReport.reportData.source_counts.opportunities ?? 0}
                    </strong>
                  </div>
                  <div style={{ padding: '10px 14px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#1E40AF', fontWeight: 600 }}>CHIẾN LƯỢC ĐỀ XUẤT</span>
                    <strong style={{ display: 'block', fontSize: '18px', color: '#2563EB', marginTop: 2 }}>
                      {selectedReport.reportData.source_counts.strategies ?? 0}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Strategic Recommendations (Fixed: No empty boxes!) */}
            <div style={{ marginTop: '18px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={16} className="text-primary" />
                <span>Khuyến nghị chiến lược trong báo cáo ({selectedReportRecommendations.length})</span>
              </h4>

              {selectedReportRecommendations.length === 0 ? (
                <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Không có khuyến nghị cụ thể trong báo cáo này.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedReportRecommendations.map((rec) => (
                    <div
                      key={rec.id}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderLeft: '4px solid #10B981',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '13px', color: '#047857', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle size={14} />
                          <span>{rec.title}</span>
                        </strong>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#ECFDF5',
                            color: '#047857',
                          }}
                        >
                          {rec.priority}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'var(--text-main)' }}>
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Key Findings (Phát hiện trọng tâm) */}
            {selectedReport.reportData?.key_findings && selectedReport.reportData.key_findings.length > 0 && (
              <div style={{ marginTop: '18px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} style={{ color: '#D97706' }} />
                  <span>Những phát hiện trọng tâm từ AI (Key Findings)</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedReport.reportData.key_findings.map((finding: string, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #FDE68A',
                        fontSize: '12.5px',
                        lineHeight: '1.55',
                        color: '#92400E',
                      }}
                    >
                      <strong>#{idx + 1}:</strong> {finding}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Opportunities (Cơ hội thị trường) */}
            {selectedReport.reportData?.opportunities && selectedReport.reportData.opportunities.length > 0 && (
              <div style={{ marginTop: '18px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lightbulb size={16} style={{ color: '#059669' }} />
                  <span>Cơ hội thị trường được phát hiện</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedReport.reportData.opportunities.slice(0, 4).map((opp: string, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        fontSize: '12.5px',
                        color: '#166534',
                        lineHeight: 1.5,
                      }}
                    >
                      • {opp}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Risks (Rủi ro cảnh báo) */}
            {selectedReport.reportData?.risks && selectedReport.reportData.risks.length > 0 && (
              <div style={{ marginTop: '18px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} style={{ color: '#DC2626' }} />
                  <span>Cảnh báo rủi ro liên quan</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedReport.reportData.risks.map((risk: string, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        fontSize: '12.5px',
                        color: '#991B1B',
                        lineHeight: 1.5,
                      }}
                    >
                      ⚠️ {risk}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
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
