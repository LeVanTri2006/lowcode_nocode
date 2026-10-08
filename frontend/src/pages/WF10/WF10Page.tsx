import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Bell, Eye, Lightbulb, MessageSquare, Play, Sparkles, ThumbsUp, TrendingUp } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { MOCK_COMPETITOR_PERFORMANCE, MOCK_VIEWS_TREND } from '../../mocks/performance';
import { INITIAL_CONTENTS } from '../../mocks/contents';
import { MARKET_TOPICS, TRENDING_KEYWORDS } from '../../mocks/marketTrends';
import { INITIAL_OPPORTUNITIES } from '../../mocks/opportunities';
import { INITIAL_FORECASTS } from '../../mocks/forecasts';
import { INITIAL_ALERTS } from '../../mocks/alerts';
import './WF10Page.css';

const fmt = (value: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
const competitorIdByName: Record<string, number> = { TED: 1, 'Marques Brownlee': 2, Veritasium: 3 };

export const WF10Page: React.FC = () => {
  const navigate = useNavigate();
  const totalViews = MOCK_COMPETITOR_PERFORMANCE.reduce((sum, item) => sum + item.totalViewsNumeric, 0);
  const totalVideos = MOCK_COMPETITOR_PERFORMANCE.reduce((sum, item) => sum + item.videoCount, 0);
  const latestAlerts = INITIAL_ALERTS.slice(0, 4);
  const topVideos = [...INITIAL_CONTENTS].sort((a, b) => b.viewsNumeric - a.viewsNumeric).slice(0, 5);
  const highPotential = INITIAL_FORECASTS.filter((item) => ['Cao', 'Rất cao'].includes(item.potential)).slice(0, 3);

  return (
    <div className="wf10-page-container fade-in">
      <PageHeader title="WF10 - Bảng điều khiển tổng hợp" subtitle="Hiệu suất, thị trường, cơ hội và dự báo trên cùng một màn hình." stepNumber={10} />

      <section className="wf10-kpi-grid">
        {[
          { label: 'Tổng video', value: fmt(totalVideos), icon: Play, tint: 'blue' },
          { label: 'Tổng lượt xem', value: fmt(totalViews), icon: Eye, tint: 'green' },
          { label: 'Tổng lượt thích', value: '595K', icon: ThumbsUp, tint: 'red' },
          { label: 'Tổng bình luận', value: '32.7K', icon: MessageSquare, tint: 'purple' },
          { label: 'Tổng cảnh báo', value: INITIAL_ALERTS.length, icon: Bell, tint: 'orange' },
        ].map(({ label, value, icon: Icon, tint }) => <article key={label} className="ui-card wf10-kpi-card"><span className={`wf10-kpi-icon ${tint}`}><Icon size={18} /></span><div><span>{label}</span><strong>{value}</strong></div></article>)}
      </section>

      <section className="wf10-main-grid">
        <article className="ui-card wf10-panel wf10-trend-panel">
          <div className="wf10-panel-heading"><div><h2><TrendingUp size={17} /> Performance trend</h2><p>Lượt xem theo đối thủ · 7 ngày gần nhất</p></div><span className="wf10-tag">Mock data</span></div>
          <div className="wf10-chart-legend"><span><i className="ted" /> TED</span><span><i className="mkbhd" /> Marques Brownlee</span><span><i className="veritasium" /> Veritasium</span></div>
          <div className="wf10-chart-scroll"><svg viewBox="0 0 640 220" role="img" aria-label="Biểu đồ lượt xem theo ngày">
            {[35, 80, 125, 170].map((y) => <line key={y} x1="45" x2="620" y1={y} y2={y} stroke="#e9eef5" />)}
            {MOCK_VIEWS_TREND.map((point, index) => <text key={point.date} x={55 + index * 90} y="205" textAnchor="middle" fill="#7b8797" fontSize="11">{point.date}</text>)}
            {(['ted', 'mkbhd', 'veritasium'] as const).map((key) => {
              const vals = MOCK_VIEWS_TREND.map((point) => point[key]);
              const max = Math.max(...MOCK_VIEWS_TREND.flatMap((point) => [point.ted, point.mkbhd, point.veritasium]));
              const points = vals.map((v, i) => `${55 + i * 90},${180 - (v / max) * 145}`).join(' ');
              return <polyline key={key} points={points} fill="none" stroke={key === 'ted' ? '#e11d48' : key === 'mkbhd' ? '#2563eb' : '#10b981'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />;
            })}
          </svg></div>
        </article>

        <article className="ui-card wf10-panel">
          <div className="wf10-panel-heading"><div><h2><TrendingUp size={17} /> Competitor ranking</h2><p>Xếp hạng từ cùng bộ dữ liệu WF04</p></div></div>
          <div className="wf10-ranking-list">{MOCK_COMPETITOR_PERFORMANCE.map((item) => <div className="wf10-ranking-row" key={item.competitor}><b>{item.rank}</b><div className="wf10-rank-name"><strong>{item.competitor}</strong><span>{item.videoCount} video · {item.engagementRate} tương tác</span></div><strong>{item.totalViews}</strong></div>)}</div>
        </article>

        <article className="ui-card wf10-panel wf10-videos-panel">
          <div className="wf10-panel-heading"><div><h2><Play size={17} /> Top videos</h2><p>Nội dung lấy từ danh sách WF02 / WF03</p></div></div>
          <div className="wf10-table-scroll"><table><thead><tr><th>Video</th><th>Đối thủ</th><th>Lượt xem</th><th>Trạng thái</th></tr></thead><tbody>{topVideos.map((item) => <tr key={item.id}><td>{item.title}</td><td>{item.competitorName}</td><td>{item.views}</td><td>{item.aiStatus}</td></tr>)}</tbody></table></div>
        </article>

        <article className="ui-card wf10-panel">
          <div className="wf10-panel-heading"><div><h2><Sparkles size={17} /> Market trends</h2><p>Chủ đề và từ khóa phổ biến</p></div></div>
          <div className="wf10-topic-list">{MARKET_TOPICS.slice(0, 4).map((item) => <div className="wf10-topic-row" key={item.name}><span>{item.name}</span><div><i style={{ width: `${item.percentage * 2.5}%`, background: item.color }} /></div><b>{item.percentage}%</b></div>)}</div>
          <div className="wf10-keywords">{TRENDING_KEYWORDS.slice(0, 5).map((item) => <span key={item.id}>#{item.keyword} <b>{item.growth}</b></span>)}</div>
        </article>

        <article className="ui-card wf10-panel">
          <div className="wf10-panel-heading"><div><h2><Lightbulb size={17} /> Content opportunities</h2><p>Điểm cơ hội dựa trên mức tiềm năng mock</p></div></div>
          <div className="wf10-opportunity-list">{INITIAL_OPPORTUNITIES.slice(0, 4).map((item) => { const score = item.potentialLevel === 'Cao' ? 88 : item.potentialLevel === 'Trung bình' ? 64 : 42; return <div key={item.id} className="wf10-opportunity-row"><span>{item.title}</span><div className="wf10-score-track"><i style={{ width: `${score}%` }} /></div><b>{score}</b></div>; })}</div>
        </article>

        <article className="ui-card wf10-panel">
          <div className="wf10-panel-heading"><div><h2><ArrowUpRight size={17} /> Forecast</h2><p>Dự báo video tiềm năng cao</p></div></div>
          {highPotential.map((item) => <div className="wf10-forecast-row" key={item.id}><div><strong>{item.title}</strong><span>{item.competitor} · Hiện tại {item.currentViews}</span></div><b>{item.forecast7d}</b></div>)}
        </article>

        <article className="ui-card wf10-panel">
          <div className="wf10-panel-heading"><div><h2><Bell size={17} /> Alerts</h2><p>Cảnh báo gần đây · liên kết WF05</p></div></div>
          {latestAlerts.map((alert) => { const competitor = MOCK_COMPETITOR_PERFORMANCE.find((item) => competitorIdByName[item.competitor] === alert.competitorId); return <div className="wf10-alert-row" key={alert.id}><span className="wf10-alert-dot" /><div><strong>{competitor?.competitor ?? `Đối thủ #${alert.competitorId}`}</strong><span>{alert.message} · Content #{alert.contentId}</span></div><time>{new Date(alert.createdAt).toLocaleDateString('vi-VN')}</time></div>; })}
        </article>

        <article className="ui-card wf10-panel wf10-insight-panel">
          <div className="wf10-panel-heading"><div><h2><Sparkles size={17} /> AI Insight</h2><p>Tóm tắt và đề xuất từ dữ liệu mock</p></div></div>
          <p className="wf10-ai-summary">Marques Brownlee dẫn đầu tổng lượt xem trong nhóm theo dõi; Veritasium có tỷ lệ tương tác cao nhất. Chủ đề công nghệ tiếp tục có nhiều từ khóa tăng trưởng.</p>
          <ul><li>Ưu tiên thử nghiệm nội dung review công nghệ và AI.</li><li>Theo dõi nhóm video có lượt xem tăng tại WF05.</li><li>So sánh hiệu quả theo đối thủ trước khi lập lịch nội dung.</li></ul>
          <div className="wf10-next-actions"><b>Next actions</b><button type="button" onClick={() => navigate('/wf07')}>Xem cơ hội <ArrowUpRight size={14} /></button><button type="button" onClick={() => navigate('/wf05')}>Mở cảnh báo <ArrowUpRight size={14} /></button></div>
        </article>
      </section>
    </div>
  );
};
