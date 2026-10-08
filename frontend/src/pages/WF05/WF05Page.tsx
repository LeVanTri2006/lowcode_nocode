import React, { useMemo, useState } from 'react';
import { Bell, Eye, Heart, MessageCircle, X } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { WorkflowExecutionStatus } from '../../components/workflow/WorkflowExecutionStatus';
import { INITIAL_ALERTS, type AlertItem } from '../../mocks/alerts';
import { INITIAL_COMPETITORS } from '../../mocks/competitors';
import { useToast } from '../../components/common/Toast';
import './WF05Page.css';

const alertLabels: Record<AlertItem['alertType'], string> = { views_growth: 'Views Growth', likes_growth: 'Likes Growth', comments_growth: 'Comments Growth' };
const fmtNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(value);
const fmtDate = (value: string) => {
  const parts = new Intl.DateTimeFormat('vi-VN', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('day')}/${part('month')}/${part('year')} ${part('hour')}:${part('minute')}`;
};

export const WF05Page: React.FC = () => {
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [selected, setSelected] = useState<AlertItem | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [competitorFilter, setCompetitorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => alerts.filter((item) =>
    (typeFilter === 'all' || item.alertType === typeFilter) &&
    (competitorFilter === 'all' || item.competitorId === Number(competitorFilter)) &&
    (statusFilter === 'all' || item.status === statusFilter)), [alerts, typeFilter, competitorFilter, statusFilter]);
  const counts = { views: alerts.filter((item) => item.alertType === 'views_growth').length, likes: alerts.filter((item) => item.alertType === 'likes_growth').length, comments: alerts.filter((item) => item.alertType === 'comments_growth').length };
  const daily = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(Date.UTC(2026, 9, 2 + i)).toISOString().slice(0, 10);
    return { date: day, label: `${String(2 + i).padStart(2, '0')}/10`, count: alerts.filter((item) => item.createdAt.startsWith(day)).length };
  });
  const maxCount = Math.max(1, ...daily.map((item) => item.count));
  const markHandled = (id: number) => {
    setAlerts((current) => current.map((item) => item.id === id ? { ...item, status: 'Đã xử lý' } : item));
    setSelected((current) => current?.id === id ? { ...current, status: 'Đã xử lý' } : current);
    showToast(`Cảnh báo #${id} đã xử lý.`, 'success');
  };
  const competitorName = (id: number) => INITIAL_COMPETITORS.find((item) => item.id === id)?.name ?? `Đối thủ #${id}`;
  const selectedRate = (item: AlertItem) => item.alertType === 'views_growth' ? item.viewsGrowthRate : item.alertType === 'likes_growth' ? item.likesGrowthRate : item.commentsGrowthRate;

  return (
    <div className="wf05-page-container fade-in">
      <PageHeader title="WF05 - Giám sát & Cảnh báo" subtitle="Theo dõi thay đổi lượt xem, lượt thích và bình luận trong dữ liệu nội dung mock." stepNumber={5} />
      <WorkflowExecutionStatus workflowCode="WF05" />

      <section className="wf05-kpi-grid">
        {[
          { label: 'Tổng cảnh báo', value: alerts.length, icon: Bell, tint: 'red' },
          { label: 'Views Growth', value: counts.views, icon: Eye, tint: 'blue' },
          { label: 'Likes Growth', value: counts.likes, icon: Heart, tint: 'pink' },
          { label: 'Comments Growth', value: counts.comments, icon: MessageCircle, tint: 'green' },
        ].map(({ label, value, icon: Icon, tint }) => <article className="ui-card wf05-kpi-card" key={label}><span className={`wf05-kpi-icon ${tint}`}><Icon size={18} /></span><div><span>{label}</span><strong>{value}</strong></div></article>)}
      </section>

      <section className="wf05-charts-grid">
        <article className="ui-card wf05-chart-card">
          <div className="wf05-section-heading"><div><h2>Alert Trend</h2><p>Cảnh báo theo ngày</p></div><span className="wf05-chart-caption">Số cảnh báo</span></div>
          <div className="wf05-trend-chart" role="img" aria-label="Số lượng cảnh báo theo ngày">{daily.map((item) => <div className="wf05-trend-column" key={item.date}><strong>{item.count}</strong><div><i style={{ height: `${Math.max(8, item.count / maxCount * 100)}%` }} /></div><span>{item.label}</span></div>)}</div>
        </article>
        <article className="ui-card wf05-chart-card">
          <div className="wf05-section-heading"><div><h2>Alert Type</h2><p>Phân loại theo cấu trúc cảnh báo</p></div></div>
          <div className="wf05-type-bars">{[
            { key: 'views_growth', label: 'Views Growth', count: counts.views, rate: 0, color: '#2563eb' },
            { key: 'likes_growth', label: 'Likes Growth', count: counts.likes, rate: 0, color: '#e11d48' },
            { key: 'comments_growth', label: 'Comments Growth', count: counts.comments, rate: 0, color: '#059669' },
          ].map((item) => <div className="wf05-type-row" key={item.key}><span>{item.label}</span><div><i style={{ width: `${alerts.length ? item.count / alerts.length * 100 : 0}%`, backgroundColor: item.color }} /></div><b>{item.count}</b></div>)}</div>
        </article>
      </section>

      <section className="ui-card wf05-alert-table-card">
        <div className="wf05-section-heading wf05-table-heading"><div><h2>Alert Table</h2><p>{filtered.length} trong tổng số {alerts.length} cảnh báo</p></div>
          <div className="wf05-filters"><select aria-label="Lọc loại cảnh báo" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option value="all">Tất cả loại</option><option value="views_growth">Views Growth</option><option value="likes_growth">Likes Growth</option><option value="comments_growth">Comments Growth</option></select><select aria-label="Lọc đối thủ" value={competitorFilter} onChange={(e) => setCompetitorFilter(e.target.value)}><option value="all">Tất cả đối thủ</option>{INITIAL_COMPETITORS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select aria-label="Lọc trạng thái" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="all">Tất cả trạng thái</option><option value="Mới">Mới</option><option value="Đã xử lý">Đã xử lý</option></select></div>
        </div>
        <div className="wf05-table-scroll"><table className="wf05-alert-table"><thead><tr><th>ID</th><th>Content ID</th><th>Competitor</th><th>Platform</th><th>Alert Type</th><th>Message</th><th>Views Change</th><th>Growth Rate</th><th>Created At</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{filtered.map((item) => <tr key={item.id}><td>#{item.id}</td><td>{item.contentId}</td><td>{competitorName(item.competitorId)}</td><td>YouTube</td><td><span className={`wf05-type-pill ${item.alertType}`}>{alertLabels[item.alertType]}</span></td><td>{item.message}</td><td>+{fmtNumber(item.viewsChange)}</td><td>{selectedRate(item)}%</td><td>{fmtDate(item.createdAt)}</td><td><span className={`wf05-status-pill ${item.status === 'Mới' ? 'new' : 'handled'}`}>{item.status}</span></td><td><button className="wf05-view-button" type="button" onClick={() => setSelected(item)}>Xem</button></td></tr>)}</tbody>
        </table>{filtered.length === 0 && <div className="wf05-empty-state">Không có cảnh báo phù hợp với bộ lọc.</div>}</div>
      </section>

      {selected && <div className="wf05-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="wf05-alert-modal" role="dialog" aria-modal="true" aria-labelledby="wf05-modal-title"><header><div><span>WF05 · Alert #{selected.id}</span><h2 id="wf05-modal-title">Chi tiết cảnh báo</h2></div><button type="button" aria-label="Đóng" onClick={() => setSelected(null)}><X size={19} /></button></header>
        <div className="wf05-modal-identity"><div><span>Competitor</span><strong>{competitorName(selected.competitorId)}</strong></div><div><span>Content ID</span><strong>{selected.contentId}</strong></div><div><span>Platform</span><strong>YouTube</strong></div><div><span>Alert Type</span><strong>{alertLabels[selected.alertType]}</strong></div></div>
        <div className="wf05-message-box"><span>Message</span><strong>{selected.message}</strong></div>
        <div className="wf05-modal-metrics"><div><span>Views Change</span><strong>+{fmtNumber(selected.viewsChange)}</strong></div><div><span>Likes Change</span><strong>+{fmtNumber(selected.likesChange)}</strong></div><div><span>Comments Change</span><strong>+{fmtNumber(selected.commentsChange)}</strong></div><div><span>Views Growth Rate</span><strong>{selected.viewsGrowthRate}%</strong></div><div><span>Likes Growth Rate</span><strong>{selected.likesGrowthRate}%</strong></div><div><span>Comments Growth Rate</span><strong>{selected.commentsGrowthRate}%</strong></div></div>
        <p className="wf05-modal-created">Created At · {fmtDate(selected.createdAt)}</p>
        <footer>{selected.status === 'Mới' && <button className="btn btn-primary" type="button" onClick={() => markHandled(selected.id)}>Đánh dấu đã xử lý</button>}<button className="wf05-close-button" type="button" onClick={() => setSelected(null)}>Đóng</button></footer>
      </section></div>}
    </div>
  );
};
