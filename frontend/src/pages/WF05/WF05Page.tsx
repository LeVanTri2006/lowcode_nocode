import React, { useMemo, useState } from 'react';
import { Bell, Eye, Heart, MessageCircle, RotateCw, X, ExternalLink, Activity } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useApiResource } from '../../hooks/api/useApiResource';
import { getMonitoringAlerts, getMonitoringData } from '../../services/api/monitoringApi';
import type { MonitoringAlert, MonitoringData, MonitoringMetricSnapshot } from '../../types/api';
import { platformLabel } from '../../utils/platformLabel';
import './WF05Page.css';

const EMPTY_ALERTS: MonitoringAlert[] = [];
const EMPTY_MONITORING: MonitoringData[] = [];
const alertLabels: Record<string, string> = {
  views_growth: 'Tăng lượt xem',
  likes_growth: 'Tăng lượt thích',
  comments_growth: 'Tăng bình luận',
};
const safeNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? value : null;
const fmtNumber = (value: unknown) => {
  const number = safeNumber(value);
  return number === null ? '—' : new Intl.NumberFormat('vi-VN').format(number);
};
const fmtStoredRate = (value: unknown) => {
  const number = safeNumber(value);
  return number === null ? '—' : new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 6 }).format(number);
};
const fmtDate = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return 'Chưa có thời gian';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Thời gian không hợp lệ' : date.toLocaleString('vi-VN');
};
const getTypeLabel = (type: string) => alertLabels[type] || type || 'Không rõ loại cảnh báo';
const displayAlertMessage = (message: string | null | undefined) => {
  if (!message) return 'Không có thông điệp';
  return message.replace(/^(Views|Likes|Comments)\s+tăng/i, (_, metric: string) => ({ Views: 'Lượt xem tăng', Likes: 'Lượt thích tăng', Comments: 'Bình luận tăng' }[metric as 'Views' | 'Likes' | 'Comments']));
};
const getContentLabel = (alert: MonitoringAlert) => alert.socialContent?.contentId || `ID nội bộ #${alert.contentId}`;
const getCompetitorLabel = (alert: MonitoringAlert) => alert.competitor?.name || `Đối thủ #${alert.competitorId}`;
const signed = (value: unknown) => {
  const number = safeNumber(value);
  return number === null ? '—' : `${number > 0 ? '+' : ''}${fmtNumber(number)}`;
};
const orderedSnapshots = (metrics: MonitoringMetricSnapshot[] | null | undefined) => [...(Array.isArray(metrics) ? metrics : [])]
  .filter((item) => item && typeof item === 'object')
  .sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());

export const WF05Page: React.FC = () => {
  const monitoringResource = useApiResource(getMonitoringData, []);
  const alertsResource = useApiResource(getMonitoringAlerts, []);
  const [typeFilter, setTypeFilter] = useState('all');
  const [competitorFilter, setCompetitorFilter] = useState('all');
  const [selected, setSelected] = useState<MonitoringAlert | null>(null);
  const [now] = useState(() => Date.now());

  const monitoring = monitoringResource.data ?? EMPTY_MONITORING;
  const alerts = alertsResource.data ?? EMPTY_ALERTS;
  const alertTypes = useMemo(() => [...new Set(alerts.map((item) => item.alertType).filter(Boolean))].sort(), [alerts]);
  const competitors = useMemo(() => {
    const names = new Map<number, string>();
    monitoring.forEach((item) => names.set(item.competitorId, item.competitorName || `Đối thủ #${item.competitorId}`));
    alerts.forEach((item) => names.set(item.competitorId, item.competitor?.name || names.get(item.competitorId) || `Đối thủ #${item.competitorId}`));
    return [...names.entries()].sort((a, b) => a[1].localeCompare(b[1], 'vi'));
  }, [monitoring, alerts]);
  const filteredAlerts = useMemo(() => [...alerts]
    .filter((item) => (typeFilter === 'all' || item.alertType === typeFilter) && (competitorFilter === 'all' || item.competitorId === Number(competitorFilter)))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [alerts, typeFilter, competitorFilter]);
  const filteredMonitoring = useMemo(() => monitoring.filter((item) => competitorFilter === 'all' || item.competitorId === Number(competitorFilter)), [monitoring, competitorFilter]);
  const counts = useMemo(() => ({
    views: filteredAlerts.filter((item) => item.alertType === 'views_growth').length,
    likes: filteredAlerts.filter((item) => item.alertType === 'likes_growth').length,
    comments: filteredAlerts.filter((item) => item.alertType === 'comments_growth').length,
  }), [filteredAlerts]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - 6 + index);
    const key = date.toISOString().slice(0, 10);
    return { key, label: date.toLocaleDateString('vi-VN', { timeZone: 'UTC', day: '2-digit', month: '2-digit' }), count: filteredAlerts.filter((item) => typeof item.createdAt === 'string' && item.createdAt.slice(0, 10) === key).length };
  }), [filteredAlerts, now]);
  const maxCount = Math.max(1, ...days.map((item) => item.count));

  const retryBoth = () => { monitoringResource.refresh(); alertsResource.refresh(); };

  return (
    <div className="wf05-page-container fade-in">
      <PageHeader title="WF05 - Giám sát & Cảnh báo" subtitle="Các lần ghi nhận giám sát và cảnh báo đã lưu trong máy chủ; trang này chỉ đọc dữ liệu, không tạo cảnh báo hoặc kích hoạt n8n." stepNumber={5} />

      <div className="wf05-toolbar">
        <label>Đối thủ<select aria-label="Lọc đối thủ" value={competitorFilter} onChange={(event) => setCompetitorFilter(event.target.value)}><option value="all">Tất cả đối thủ</option>{competitors.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
        <label>Loại cảnh báo<select aria-label="Lọc loại cảnh báo" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="all">Tất cả loại</option>{alertTypes.map((type) => <option key={type} value={type}>{getTypeLabel(type)}</option>)}</select></label>
        <button type="button" className="btn btn-primary wf05-refresh-button" onClick={retryBoth} disabled={monitoringResource.loading || alertsResource.loading}><RotateCw size={14} />{monitoringResource.loading || alertsResource.loading ? 'Đang tải…' : 'Làm mới dữ liệu'}</button>
      </div>

      {monitoringResource.loading && monitoringResource.data === null && <div className="ui-card wf05-state" role="status">Đang tải dữ liệu giám sát…</div>}
      {monitoringResource.error && <div className="ui-card wf05-error" role="alert"><div><strong>Không tải được dữ liệu giám sát.</strong><p>{monitoringResource.error}</p></div><button className="btn btn-secondary" type="button" onClick={monitoringResource.refresh}>Thử tải lại monitoring</button></div>}
      {alertsResource.loading && alertsResource.data === null && <div className="ui-card wf05-state" role="status">Đang tải cảnh báo đã lưu…</div>}
      {alertsResource.error && <div className="ui-card wf05-error" role="alert"><div><strong>Không tải được danh sách cảnh báo.</strong><p>{alertsResource.error}</p></div><button className="btn btn-secondary" type="button" onClick={alertsResource.refresh}>Thử tải lại cảnh báo</button></div>}

      <section className="wf05-kpi-grid">
        {[
          { label: 'Tổng cảnh báo', value: filteredAlerts.length, icon: Bell, tint: 'red' },
          { label: 'Tăng lượt xem', value: counts.views, icon: Eye, tint: 'blue' },
          { label: 'Tăng lượt thích', value: counts.likes, icon: Heart, tint: 'pink' },
          { label: 'Tăng bình luận', value: counts.comments, icon: MessageCircle, tint: 'green' },
        ].map(({ label, value, icon: Icon, tint }) => <article className="ui-card wf05-kpi-card" key={label}><span className={`wf05-kpi-icon ${tint}`}><Icon size={18} /></span><div><span>{label}</span><strong>{alertsResource.error && alertsResource.data === null ? '—' : value}</strong></div></article>)}
      </section>

      <section className="wf05-charts-grid">
        <article className="ui-card wf05-chart-card">
          <div className="wf05-section-heading"><div><h2>Xu hướng cảnh báo</h2><p>Số cảnh báo theo ngày tạo · 7 ngày gần nhất</p></div><span className="wf05-chart-caption">Các cảnh báo đang lọc</span></div>
          {alertsResource.error && alertsResource.data === null ? <div className="wf05-state">Biểu đồ không khả dụng khi API cảnh báo lỗi.</div> : filteredAlerts.length === 0 ? <div className="wf05-state">Chưa có cảnh báo trong bộ lọc.</div> : <div className="wf05-trend-chart" role="img" aria-label="Số cảnh báo theo ngày tạo trong 7 ngày gần nhất">{days.map((item) => <div className="wf05-trend-column" key={item.key}><strong>{item.count}</strong><div><i style={{ height: `${Math.max(8, item.count / maxCount * 100)}%` }} /></div><span>{item.label}</span></div>)}</div>}
        </article>
        <article className="ui-card wf05-chart-card">
          <div className="wf05-section-heading"><div><h2>Loại cảnh báo</h2><p>Phân bố từ bản ghi đã lưu</p></div></div>
          {alertsResource.error && alertsResource.data === null ? <div className="wf05-state">Phân loại không khả dụng khi API cảnh báo lỗi.</div> : filteredAlerts.length === 0 ? <div className="wf05-state">Chưa có cảnh báo để phân loại.</div> : <div className="wf05-type-bars">{[
            { key: 'views_growth', label: getTypeLabel('views_growth'), count: counts.views, color: '#2563eb' },
            { key: 'likes_growth', label: getTypeLabel('likes_growth'), count: counts.likes, color: '#e11d48' },
            { key: 'comments_growth', label: getTypeLabel('comments_growth'), count: counts.comments, color: '#059669' },
            ...alertTypes.filter((type) => !alertLabels[type]).map((type) => ({ key: type, label: getTypeLabel(type), count: filteredAlerts.filter((item) => item.alertType === type).length, color: '#64748b' })),
          ].map((item) => <div className="wf05-type-row" key={item.key}><span>{item.label}</span><div><i style={{ width: `${filteredAlerts.length ? item.count / filteredAlerts.length * 100 : 0}%`, backgroundColor: item.color }} /></div><b>{item.count}</b></div>)}</div>}
        </article>
      </section>

      <section className="ui-card wf05-monitoring-card">
        <div className="wf05-section-heading wf05-table-heading"><div><h2><Activity size={16} /> Nội dung đang được giám sát</h2><p>{filteredMonitoring.length} nội dung theo dữ liệu máy chủ</p></div></div>
        {monitoringResource.loading && monitoringResource.data === null ? <div className="wf05-state">Đang tải dữ liệu giám sát…</div> : monitoringResource.error ? <div className="wf05-state">Không thể hiển thị dữ liệu giám sát.</div> : filteredMonitoring.length === 0 ? <div className="wf05-empty-state">máy chủ chưa có nội dung giám sát phù hợp.</div> : <div className="wf05-table-scroll"><table className="wf05-monitoring-table"><thead><tr><th>Mã nội dung</th><th>Nội dung</th><th>Đối thủ</th><th>Nền tảng</th><th>Lần ghi nhận mới nhất</th><th>Lần ghi nhận trước</th></tr></thead><tbody>{filteredMonitoring.map((item) => <MonitoringRow item={item} key={item.socialContentId} />)}</tbody></table></div>}
        <p className="wf05-monitoring-note">Mỗi nội dung có tối đa hai lần ghi nhận mới nhất, sắp xếp giảm dần theo thời điểm ghi nhận. Bảng không tự tính mức tăng giữa các lần ghi nhận.</p>
      </section>

      <section className="ui-card wf05-alert-table-card">
        <div className="wf05-section-heading wf05-table-heading"><div><h2>Danh sách cảnh báo</h2><p>{filteredAlerts.length} trong {alerts.length} cảnh báo đã lưu</p></div></div>
        {alertsResource.loading && alertsResource.data === null ? <div className="wf05-state">Đang tải cảnh báo…</div> : alertsResource.error ? <div className="wf05-state">Cảnh báo chưa tải được. Dữ liệu giám sát phía trên vẫn dùng độc lập.</div> : filteredAlerts.length === 0 ? <div className="wf05-empty-state">máy chủ chưa có cảnh báo phù hợp với bộ lọc.</div> : <div className="wf05-table-scroll"><table className="wf05-alert-table"><thead><tr><th>ID</th><th>Mã video</th><th>Nội dung</th><th>Đối thủ</th><th>Nền tảng</th><th>Loại cảnh báo</th><th>Thông điệp</th><th>Lượt xem Δ</th><th>Lượt thích Δ</th><th>Bình luận Δ</th><th>Tỷ lệ lượt xem · dữ liệu gốc</th><th>Thời điểm tạo</th><th>Chi tiết</th></tr></thead><tbody>{filteredAlerts.map((item) => <tr key={item.id}><td>#{item.id}</td><td>{getContentLabel(item)}</td><td className="wf05-alert-title">{item.socialContent?.title || 'Không có nội dung liên kết'}</td><td>{getCompetitorLabel(item)}</td><td>{platformLabel(item.platform || item.socialContent?.platform)}</td><td><span className={`wf05-type-pill ${knownAlertClass(item.alertType)}`}>{getTypeLabel(item.alertType)}</span></td><td className="wf05-alert-message">{displayAlertMessage(item.message)}</td><td>{signed(item.viewsChange)}</td><td>{signed(item.likesChange)}</td><td>{signed(item.commentsChange)}</td><td>{fmtStoredRate(item.viewsGrowthRate)}</td><td>{fmtDate(item.createdAt)}</td><td><button className="wf05-view-button" type="button" onClick={() => setSelected(item)}>Xem</button></td></tr>)}</tbody></table></div>}
      </section>

      {selected && <AlertDetails alert={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

function knownAlertClass(type: string) {
  return Object.hasOwn(alertLabels, type) ? type : 'other';
}

const MonitoringRow: React.FC<{ item: MonitoringData }> = ({ item }) => {
  const snapshots = orderedSnapshots(item.metrics);
  return <tr><td>{item.contentId || `#${item.socialContentId}`}</td><td className="wf05-alert-title">{item.title || 'Chưa có tiêu đề'}</td><td>{item.competitorName || `Đối thủ #${item.competitorId}`}</td><td>{platformLabel(item.platform)}</td><td><SnapshotSummary snapshot={snapshots[0]} /></td><td><SnapshotSummary snapshot={snapshots[1]} /></td></tr>;
};

const SnapshotSummary: React.FC<{ snapshot?: MonitoringMetricSnapshot }> = ({ snapshot }) => snapshot ? (
  <div className="wf05-snapshot-summary"><span>Lượt xem {fmtNumber(snapshot.views)} · Lượt thích {fmtNumber(snapshot.likes)} · Bình luận {fmtNumber(snapshot.comments)}</span><span>Lượt chia sẻ {fmtNumber(snapshot.shares)}</span><time>{fmtDate(snapshot.capturedAt)}</time></div>
) : <span className="wf05-no-snapshot">Chưa có lần ghi nhận</span>;

const AlertDetails: React.FC<{ alert: MonitoringAlert; onClose: () => void }> = ({ alert, onClose }) => {
  const content = alert.socialContent;
  return <div className="wf05-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="wf05-alert-modal" role="dialog" aria-modal="true" aria-labelledby="wf05-modal-title"><header><div><span>WF05 · Cảnh báo #{alert.id}</span><h2 id="wf05-modal-title">Chi tiết cảnh báo đã lưu</h2></div><button type="button" aria-label="Đóng" onClick={onClose}><X size={19} /></button></header>
    <div className="wf05-modal-identity"><div><span>Đối thủ</span><strong>{getCompetitorLabel(alert)}</strong></div><div><span>Mã video</span><strong>{getContentLabel(alert)}</strong></div><div><span>Nền tảng</span><strong>{platformLabel(alert.platform || content?.platform)}</strong></div><div><span>Loại cảnh báo</span><strong>{getTypeLabel(alert.alertType)}</strong></div></div>
    <div className="wf05-message-box"><span>Nội dung liên kết</span><strong>{content?.title || 'Không có nội dung liên kết'}</strong>{content?.url && <a href={content.url} target="_blank" rel="noreferrer">Mở nội dung <ExternalLink size={13} /></a>}</div>
    <div className="wf05-message-box"><span>Thông điệp</span><strong>{displayAlertMessage(alert.message)}</strong></div>
    <div className="wf05-modal-metrics"><div><span>Thay đổi lượt xem</span><strong>{signed(alert.viewsChange)}</strong></div><div><span>Thay đổi lượt thích</span><strong>{signed(alert.likesChange)}</strong></div><div><span>Thay đổi bình luận</span><strong>{signed(alert.commentsChange)}</strong></div><div><span>Tỷ lệ tăng lượt xem · dữ liệu gốc</span><strong>{fmtStoredRate(alert.viewsGrowthRate)}</strong></div><div><span>Tỷ lệ tăng lượt thích · dữ liệu gốc</span><strong>{fmtStoredRate(alert.likesGrowthRate)}</strong></div><div><span>Tỷ lệ tăng bình luận · dữ liệu gốc</span><strong>{fmtStoredRate(alert.commentsGrowthRate)}</strong></div></div>
    <p className="wf05-modal-created">Thời điểm tạo · {fmtDate(alert.createdAt)}</p>
    <footer><button className="wf05-close-button" type="button" onClick={onClose}>Đóng</button></footer>
  </section></div>;
};
