import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Bell, Database, Eye, Sparkles, Users, Video } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { getAiAnalyses } from '../../services/api/aiAnalysesApi';
import { getCompetitors } from '../../services/api/competitorsApi';
import { getHealth } from '../../services/api/healthApi';
import { getMonitoringAlerts } from '../../services/api/monitoringApi';
import { getPerformanceAnalyses } from '../../services/api/performanceApi';
import { getSocialContents } from '../../services/api/socialContentsApi';
import { useApiResource } from '../../hooks/api/useApiResource';
import './DashboardPage.css';

const shortcuts = [
  { label: 'Xem đối thủ', path: '/wf01', icon: Users },
  { label: 'Xem nội dung', path: '/wf02', icon: Video },
  { label: 'Xem phân tích AI', path: '/wf03', icon: Sparkles },
  { label: 'Xem hiệu suất', path: '/wf04', icon: Eye },
  { label: 'Xem cảnh báo', path: '/wf05', icon: Bell },
  { label: 'Mở bảng điều khiển tổng hợp', path: '/wf10', icon: Activity },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const competitors = useApiResource((signal) => getCompetitors(undefined, signal), []);
  const contents = useApiResource(getSocialContents, []);
  const analyses = useApiResource(getAiAnalyses, []);
  const performance = useApiResource(getPerformanceAnalyses, []);
  const alerts = useApiResource(getMonitoringAlerts, []);
  const health = useApiResource(getHealth, []);

  const stats = [
    { label: 'Đối thủ', data: competitors, icon: Users, color: 'blue' },
    { label: 'Nội dung mạng xã hội', data: contents, icon: Database, color: 'green' },
    { label: 'Kết quả phân tích AI', data: analyses, icon: Sparkles, color: 'purple' },
    { label: 'Bản ghi hiệu suất', data: performance, icon: Eye, color: 'blue' },
    { label: 'Cảnh báo', data: alerts, icon: Bell, color: 'orange' },
  ];
  const allEmpty = [competitors, contents, analyses, performance, alerts].every(
    (resource) => !resource.loading && !resource.error && resource.data?.length === 0,
  );
  const backendConnected = !health.loading && !health.error && health.data?.success === true;

  return (
    <div className="system-overview-page fade-in">
      <PageHeader title="Tổng quan hệ thống" subtitle="Số liệu được tải trực tiếp từ API máy chủ." showStepper={false} />

      <section className="system-overview-kpis" aria-label="Số liệu từ API máy chủ">
        {stats.map(({ label, data, icon: Icon, color }) => {
          const value = data.error ? '—' : data.loading && data.data === null ? '…' : data.data?.length ?? '—';
          return (
            <article className="ui-card system-overview-kpi" key={label}>
              <span className={`system-overview-icon ${color}`}><Icon size={19} /></span>
              <div>
                <span className="system-overview-label">{label}</span>
                <strong aria-live="polite">{value}</strong>
                {data.error && <div className="system-kpi-error" role="alert">
                  <span>{data.error}</span>
                  <button type="button" onClick={data.refresh}>Thử lại</button>
                </div>}
                {!data.error && data.loading && data.data === null && <small>Đang tải…</small>}
                {!data.error && !data.loading && data.data?.length === 0 && <small>Chưa có dữ liệu.</small>}
              </div>
            </article>
          );
        })}
      </section>

      <section className={`system-summary-strip ui-card ${backendConnected ? '' : 'disconnected'}`} aria-live="polite">
        <span className={`system-online-dot ${backendConnected ? '' : 'offline'}`} />
        <div>
          <strong>{health.loading ? 'API máy chủ: Đang kết nối…' : backendConnected ? 'API máy chủ: Đã kết nối' : 'API máy chủ: Mất kết nối'}</strong>
          <span>
            {health.error
              ? `${health.error} `
              : 'API chưa cung cấp trạng thái chạy n8n.'}
            {health.error && <button className="system-inline-retry" type="button" onClick={health.refresh}>Thử lại</button>}
          </span>
        </div>
      </section>

      {allEmpty && <p className="system-empty-state" role="status">Máy chủ đã phản hồi thành công nhưng hiện chưa có dữ liệu.</p>}

      <section className="system-quick-actions ui-card">
        <div className="system-section-heading"><div><h2>Thao tác nhanh</h2><p>Mở nhanh các khu vực làm việc.</p></div></div>
        <div className="system-shortcut-grid">
          {shortcuts.map(({ label, path, icon: Icon }) => (
            <button type="button" className="system-shortcut" key={path} onClick={() => navigate(path)}>
              <Icon size={17} /><span>{label}</span><span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
