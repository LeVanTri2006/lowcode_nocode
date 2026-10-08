import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Bell, CheckCircle2, Database, Users, Video, Eye, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { WorkflowExecutionStatus } from '../../components/workflow/WorkflowExecutionStatus';
import { INITIAL_COMPETITORS } from '../../mocks/competitors';
import { INITIAL_CONTENTS } from '../../mocks/contents';
import { INITIAL_ALERTS } from '../../mocks/alerts';
import './DashboardPage.css';

const shortcuts = [
  { label: 'Xem đối thủ', path: '/wf01', icon: Users },
  { label: 'Xem nội dung', path: '/wf02', icon: Video },
  { label: 'Xem AI Analysis', path: '/wf03', icon: Sparkles },
  { label: 'Xem Performance', path: '/wf04', icon: Eye },
  { label: 'Xem Alerts', path: '/wf05', icon: Bell },
  { label: 'Mở Dashboard tổng hợp', path: '/wf10', icon: Activity },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const stats = [
    { label: 'Đối thủ đang theo dõi', value: INITIAL_COMPETITORS.length, icon: Users, color: 'blue' },
    { label: 'Nội dung đã thu thập', value: INITIAL_CONTENTS.length, icon: Database, color: 'green' },
    { label: 'Workflow hoàn thành', value: '4 / 10', icon: CheckCircle2, color: 'purple' },
    { label: 'Cảnh báo mới', value: INITIAL_ALERTS.filter((item) => item.status === 'Mới').length, icon: Bell, color: 'orange' },
  ];

  return (
    <div className="system-overview-page fade-in">
      <PageHeader title="Tổng quan hệ thống" subtitle="Trạng thái hệ thống, tiến độ workflow và lối tắt đến các khu vực chính." showStepper={false} />

      <section className="system-overview-kpis" aria-label="System KPIs">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <article className="ui-card system-overview-kpi" key={label}>
            <span className={`system-overview-icon ${color}`}><Icon size={19} /></span>
            <div><span className="system-overview-label">{label}</span><strong>{value}</strong></div>
          </article>
        ))}
      </section>

      <section className="system-summary-strip ui-card">
        <span className="system-online-dot" />
        <div><strong>Hệ thống sẵn sàng</strong><span>Dữ liệu và trạng thái trong trang này là mô phỏng cục bộ.</span></div>
      </section>

      <WorkflowExecutionStatus />

      <section className="system-quick-actions ui-card">
        <div className="system-section-heading"><div><h2>Quick Actions</h2><p>Mở nhanh các khu vực làm việc.</p></div></div>
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
