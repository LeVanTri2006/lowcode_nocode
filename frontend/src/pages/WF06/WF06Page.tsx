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
  RotateCw,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { getTrends } from '../../services/api/trendsApi';
import { getPerformanceData } from '../../services/api/socialContentsApi';
import type { PerformanceData, TrendItem } from '../../types/api';
import './WF06Page.css';

export const WF06Page: React.FC = () => {
  const [platform, setPlatform] = useState('YouTube');
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [videos, setVideos] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [trendRows, videoRows] = await Promise.all([
        getTrends(signal),
        getPerformanceData(signal),
      ]);
      setTrends(trendRows);
      setVideos(videoRows);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Không tải được dữ liệu xu hướng từ API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, []);

  const platformVideos = useMemo(
    () => videos.filter((v) => (v.platform || '').toLowerCase() === platform.toLowerCase()),
    [videos, platform]
  );

  const validTrends = useMemo(
    () =>
      trends.filter(
        (t) =>
          t.direction !== 'insufficient_data' &&
          !String(t.name || '').startsWith('TEST_')
      ),
    [trends]
  );

  const fastGrowthTopics = useMemo(
    () =>
      [...validTrends]
        .filter(
          (t) =>
            t.direction === 'up' ||
            t.direction === 'rising' ||
            Number(t.growthRate || 0) > 0
        )
        .sort((a, b) => Number(b.growthRate || 0) - Number(a.growthRate || 0)),
    [validTrends]
  );

  const keywordCounts = useMemo(() => {
    const counts = new Map<string, number>();

    // Extract keywords from video titles
    for (const video of platformVideos) {
      const words = (video.title || '').toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
      for (const word of words) {
        if (word.length >= 4) counts.set(word, (counts.get(word) || 0) + 1);
      }
    }

    // Also extract keywords from trend names if video titles are limited
    for (const trend of validTrends) {
      const words = (trend.name || '').toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
      for (const word of words) {
        if (word.length >= 4) counts.set(word, (counts.get(word) || 0) + 1);
      }
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword, videoCount], i) => ({ id: i + 1, keyword, videoCount }));
  }, [platformVideos, validTrends]);

  const wordCloudTags = keywordCounts.slice(0, 13).map((item, i) => ({
    text: item.keyword,
    size: Math.max(12, 30 - i * 1.5),
    color: ['#2563EB', '#EF4444', '#10B981', '#EA580C', '#3B82F6', '#6366F1'][i % 6],
    weight: i < 3 ? 800 : 600,
  }));

  const platformDistribution = [
    {
      name: 'YouTube',
      pct: videos.length
        ? Math.round((videos.filter((v) => (v.platform || '').toLowerCase() === 'youtube').length / videos.length) * 100)
        : 100,
      color: '#2563EB',
    },
    {
      name: 'TikTok',
      pct: videos.length
        ? Math.round((videos.filter((v) => (v.platform || '').toLowerCase() === 'tiktok').length / videos.length) * 100)
        : 0,
      color: '#10B981',
    },
  ];

  const totalVideos = platformVideos.length || videos.length;
  const totalTrends = validTrends.length;
  const totalFastGrowth = fastGrowthTopics.length;
  const potentialTopics = validTrends.filter((t) => Number(t.score) >= 50).length;
  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

  return (
    <div className="wf06-page-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <PageHeader
          title="WF06 - Xu hướng thị trường"
          subtitle="Phân tích xu hướng chủ đề, từ khóa và nội dung thịnh hành trong thị trường từ cơ sở dữ liệu."
          stepNumber={6}
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
          <span>Đang tải dữ liệu xu hướng từ máy chủ…</span>
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
      <div className="wf06-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Chủ đề đang thịnh hành</span>
            <span className="kpi-number">{loading ? '…' : fmt(totalTrends)}</span>
            <span className="kpi-subtext">Dữ liệu từ API Backend</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green">
            <Hash size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Từ khóa xu hướng</span>
            <span className="kpi-number">{loading ? '…' : fmt(keywordCounts.length)}</span>
            <span className="kpi-subtext">Tổng hợp từ nội dung & xu hướng</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap red">
            <Play size={22} fill="#EF4444" />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Chủ đề tăng trưởng nhanh</span>
            <span className="kpi-number">{loading ? '…' : fmt(totalFastGrowth)}</span>
            <span className="kpi-subtext">Chiều hướng tăng (rising/up)</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap purple">
            <Target size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Chủ đề tiềm năng</span>
            <span className="kpi-number">{loading ? '…' : fmt(potentialTopics)}</span>
            <span className="kpi-subtext">Điểm đánh giá ≥ 50/100</span>
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
            <div className="chart-legend-row-sm">Theo thời điểm phát hiện</div>
          </div>

          <div className="chart-svg-wrap">
            {loading ? (
              <div className="chart-empty-state">Đang tải dữ liệu…</div>
            ) : validTrends.length === 0 ? (
              <div className="chart-empty-state">Chưa có xu hướng được ghi nhận.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0', maxHeight: 220, overflowY: 'auto' }}>
                {validTrends.slice(0, 5).map((t) => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '6px 10px', background: '#f8fafc', borderRadius: 6 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.name}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {t.detectedAt ? new Date(t.detectedAt).toLocaleDateString('vi-VN') : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
              <div className="donut-center-label">
                <span className="donut-center-number">{loading ? '…' : fmt(totalVideos)}</span>
                <span className="donut-center-sub">Tổng video</span>
              </div>
            </div>

            <div className="donut-legend-stack">
              {fastGrowthTopics.slice(0, 5).map((topic) => (
                <div key={topic.id} className="donut-legend-item">
                  <span className="legend-dot" style={{ backgroundColor: '#2563EB' }} />
                  <div className="legend-meta">
                    <span className="legend-name">{topic.name}</span>
                    <span className="legend-val">{topic.growthRate}%</span>
                  </div>
                </div>
              ))}
              {!loading && fastGrowthTopics.length === 0 && (
                <div className="donut-legend-item">
                  <span className="legend-dot" style={{ backgroundColor: '#94a3b8' }} />
                  <div className="legend-meta">
                    <span className="legend-name">Đang cập nhật...</span>
                    <span className="legend-val">—</span>
                  </div>
                </div>
              )}
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
            {fastGrowthTopics.slice(0, 6).map((t) => (
              <div key={t.id} className="fast-topic-item">
                <div className="topic-thumb" style={{ background: '#2563EB' }} />
                <span className="topic-name">{t.name}</span>
                <span className="topic-growth-pill">
                  {t.growthRate > 0 ? `↗ +${t.growthRate}%` : `↔ ${t.growthRate}%`}
                </span>
              </div>
            ))}
            {!loading && fastGrowthTopics.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: 12 }}>
                Chưa có chủ đề nào thuộc diện tăng trưởng nhanh.
              </p>
            )}
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
                <th>Số lần xuất hiện</th>
                <th>Tăng trưởng</th>
                <th>Độ phổ biến</th>
              </tr>
            </thead>
            <tbody>
              {keywordCounts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>
                    {loading ? 'Đang phân tích từ khóa…' : 'Chưa có từ khóa xu hướng.'}
                  </td>
                </tr>
              ) : (
                keywordCounts.map((k) => (
                  <tr key={k.id}>
                    <td className="text-muted-cell font-semibold">{k.id}</td>
                    <td className="kw-name">{k.keyword}</td>
                    <td className="font-semibold">{k.videoCount}</td>
                    <td className="growth-text">↗ Cao</td>
                    <td>
                      <span className="badge-pop">Thịnh hành</span>
                    </td>
                  </tr>
                ))
              )}
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
            {wordCloudTags.length === 0 ? (
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Chưa có từ khóa để tạo Word Cloud</span>
            ) : (
              wordCloudTags.map((tag, idx) => (
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
              ))
            )}
          </div>

          <div className="insight-bullets-box">
            <div className="insight-bullets-title">
              <Lightbulb size={14} className="text-primary" />
              <span>Nhận định xu hướng</span>
            </div>
            <ul className="insight-bullets-list">
              {validTrends.slice(0, 3).map((t) => (
                <li key={t.id}>
                  <strong>{t.name}</strong> (Điểm: {t.score}/100): {t.reason}
                </li>
              ))}
              {!loading && validTrends.length === 0 && (
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
