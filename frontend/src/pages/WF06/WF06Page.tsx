import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  TrendingUp,
  Hash,
  Play,
  Target,
  PieChart,
  Lightbulb,
  BarChart2,
} from 'lucide-react';
import { getList } from '../../services/api/client';
import type { PerformanceData } from '../../types/api';
import './WF06Page.css';

export const WF06Page: React.FC = () => {
  const [platform, setPlatform] = useState('YouTube');
  const [trends, setTrends] = useState<any[]>([]);
  const [videos, setVideos] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      getList<any>('/api/trends', controller.signal),
      getList<PerformanceData>('/api/performance-data', controller.signal),
    ])
      .then(([trendRows, videoRows]) => {
        setTrends(trendRows);
        setVideos(videoRows);
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Không tải được dữ liệu API.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const platformVideos = useMemo(
    () => videos.filter(v => (v.platform || '').toLowerCase() === platform.toLowerCase()),
    [videos, platform]
  );

  const validTrends = useMemo(
    () => trends.filter(t =>
      t.direction !== 'insufficient_data' &&
      !String(t.name || '').startsWith('TEST_')
    ),
    [trends]
  );

  const fastGrowthTopics = useMemo(
    () => validTrends
      .filter(t => t.direction === 'up')
      .sort((a, b) => Number(b.growthRate || 0) - Number(a.growthRate || 0)),
    [validTrends]
  );

  const keywordCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const video of platformVideos) {
      const words = (video.title || '').toLocaleLowerCase()
        .match(/[\\p{L}\\p{N}]+/gu) || [];
      for (const word of words) {
        if (word.length >= 4) counts.set(word, (counts.get(word) || 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword, videoCount], i) => ({ id: i + 1, keyword, videoCount }));
  }, [platformVideos]);

  const wordCloudTags = keywordCounts.slice(0, 13).map((item, i) => ({
    text: item.keyword,
    size: Math.max(12, 30 - i * 1.5),
    color: ['#2563EB', '#EF4444', '#10B981', '#EA580C', '#3B82F6', '#6366F1'][i % 6],
    weight: i < 3 ? 800 : 600,
  }));

  const platformDistribution = [{
    name: platform,
    pct: videos.length ? Math.round(platformVideos.length / videos.length * 100) : 0,
    color: '#2563EB',
  }];

  const totalVideos = platformVideos.length;
  const totalTrends = validTrends.length;
  const totalFastGrowth = fastGrowthTopics.length;
  const potentialTopics = validTrends.filter(t => Number(t.score) >= 50).length;
  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

  return (
    <div className="wf06-page-container fade-in">
      <PageHeader
        title="WF06 - Xu hướng thị trường"
        subtitle="Phân tích xu hướng chủ đề, từ khóa và nội dung thịnh hành trong thị trường."
        stepNumber={6}
      />

      {loading && <div role="status" className="ui-card">Đang tải dữ liệu từ API…</div>}
      {error && <div role="alert" className="ui-card">Không tải được dữ liệu: {error}</div>}

      {/* TOP ROW: 4 KPI CARDS */}
      <div className="wf06-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Chủ đề đang thịnh hành</span>
            <span className="kpi-number">{loading ? "…" : fmt(totalTrends)}</span>
            <span className="kpi-subtext">Theo dữ liệu API hiện có</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green">
            <Hash size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Từ khóa xu hướng</span>
            <span className="kpi-number">{loading ? "…" : fmt(keywordCounts.length)}</span>
            <span className="kpi-subtext">Theo dữ liệu API hiện có</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap red">
            <Play size={22} fill="#EF4444" />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Chủ đề tăng trưởng nhanh</span>
            <span className="kpi-number">{loading ? "…" : fmt(totalFastGrowth)}</span>
            <span className="kpi-subtext">Theo dữ liệu API hiện có</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap purple">
            <Target size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Chủ đề tiềm năng</span>
            <span className="kpi-number">{loading ? "…" : fmt(potentialTopics)}</span>
            <span className="kpi-subtext">Theo dữ liệu API hiện có</span>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: 3 CARDS */}
      <div className="wf06-middle-grid">
        {/* Card 1: Xu hướng chủ đề theo thời gian */}
        <div className="ui-card wf06-line-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <TrendingUp size={16} className="text-primary" />
              <span>Xu hướng chủ đề theo thời gian</span>
            </div>
            <div className="chart-legend-row-sm">Chưa có chuỗi dữ liệu lịch sử</div>
          </div>

          <div className="chart-svg-wrap">
            <div className="chart-empty-state">
              {loading ? 'Đang tải dữ liệu…' : 'API chưa cung cấp dữ liệu lịch sử để vẽ biểu đồ.'}
            </div>
          </div>
        </div>

        {/* Card 2: Tỷ lệ chủ đề trong thị trường (Donut) */}
        <div className="ui-card wf06-donut-card">
          <div className="card-section-title">
            <PieChart size={16} className="text-primary" />
            <span>Tỷ lệ chủ đề trong thị trường</span>
          </div>

          <div className="donut-content-row">
            <div className="donut-svg-wrap">
              <div className="chart-empty-state">
                {loading ? 'Đang tải…' : `${fmt(totalVideos)} video trong dữ liệu API`}
              </div>
              <div className="donut-center-label">
                <span className="donut-center-number">{fmt(totalVideos)}</span>
                <span className="donut-center-sub">Tổng video</span>
              </div>
            </div>

            <div className="donut-legend-stack">
              {fastGrowthTopics.slice(0, 5).map((topic: any) => (
                <div key={topic.id} className="donut-legend-item">
                  <span className="legend-dot" style={{ backgroundColor: '#2563EB' }} />
                  <div className="legend-meta">
                    <span className="legend-name">{topic.name}</span>
                    <span className="legend-val">{topic.growthRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Chủ đề tăng trưởng nhanh nhất */}
        <div className="ui-card wf06-fast-growth-card">
          <div className="card-section-title">
            <TrendingUp size={16} className="text-success" />
            <span>Chủ đề tăng trưởng nhanh nhất</span>
          </div>

          <div className="fast-growth-list">
            {fastGrowthTopics.map((t: any) => (
              <div key={t.id} className="fast-topic-item">
                <div className="topic-thumb" style={{ background: "#2563EB" }} />
                <span className="topic-name">{t.name}</span>
                <span className="topic-growth-pill">↗ {t.growthRate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: 3 CARDS */}
      <div className="wf06-bottom-grid">
        {/* Card 1: Từ khóa xu hướng */}
        <div className="ui-card wf06-keywords-card">
          <div className="card-section-title">
            <Hash size={16} className="text-primary" />
            <span>Từ khóa xu hướng</span>
          </div>

          <table className="kw-table">
            <thead>
              <tr>
                <th style={{ width: '28px' }}>#</th>
                <th>Từ khóa</th>
                <th>Số video</th>
                <th>Tăng trưởng</th>
                <th>Độ phổ biến</th>
                <th>Xu hướng</th>
              </tr>
            </thead>
            <tbody>
              {keywordCounts.map((k) => (
                <tr key={k.id}>
                  <td className="text-muted-cell font-semibold">{k.id}</td>
                  <td className="kw-name">{k.keyword}</td>
                  <td className="font-semibold">{k.videoCount}</td>
                  <td className="growth-text">—</td>
                  <td>
                    <span className="badge-pop">Chưa có dữ liệu</span>
                  </td>
                  <td>
                    <span>—</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card 2: Word Cloud & Insight */}
        <div className="ui-card wf06-cloud-card">
          <div className="card-section-title">
            <Lightbulb size={16} className="text-primary" />
            <span>Word Cloud - Từ khóa phổ biến</span>
          </div>

          <div className="word-cloud-canvas">
            {wordCloudTags.map((tag, idx) => (
              <span
                key={idx}
                className="cloud-word"
                style={{
                  fontSize: `${tag.size}px`,
                  color: tag.color,
                  fontWeight: tag.weight,
                }}
              >
                {tag.text}
              </span>
            ))}
          </div>

          <div className="insight-bullets-box">
            <div className="insight-bullets-title">
              <Lightbulb size={14} className="text-primary" />
              <span>Nhận định xu hướng</span>
            </div>
            <ul className="insight-bullets-list">
              {fastGrowthTopics.slice(0, 3).map((t: any) => (
                <li key={t.id}>{t.name}: mức tăng trưởng API ghi nhận {t.growthRate}%. {t.reason}</li>
              ))}
              {!loading && fastGrowthTopics.length === 0 && (
                <li>Chưa có đủ dữ liệu để xác định chủ đề tăng trưởng.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Card 3: Xu hướng theo nền tảng */}
        <div className="ui-card wf06-platform-card">
          <div className="analytics-card-header">
            <div className="card-section-title">
              <BarChart2 size={16} className="text-primary" />
              <span>Xu hướng theo nền tảng</span>
            </div>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="period-select-sm"
            >
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
            </select>
          </div>

          <div className="platform-bars-list">
            {platformDistribution.map((item, idx) => (
              <div key={idx} className="platform-bar-row">
                <span className="p-bar-name">{item.name}</span>
                <div className="p-bar-track">
                  <div
                    className="p-bar-fill"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  />
                </div>
                <span className="p-bar-pct">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
