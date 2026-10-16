import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { getPerformanceData } from '../../services/api/socialContentsApi';
import type { PerformanceData } from '../../types/api';
import { ExternalLink, RefreshCw } from 'lucide-react';
import './WF08Page.css';

export const WF08Page: React.FC = () => {
  const [videos, setVideos] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    getPerformanceData(controller.signal)
      .then(setVideos)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const filtered = videos.filter((video) =>
    `${video.title} ${video.competitorName} ${video.platform}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const number = (value: number) =>
    new Intl.NumberFormat('vi-VN').format(value);

  return (
    <div className="wf08-page-container fade-in">
      <PageHeader
        title="WF08 - Dự báo hiệu suất"
        subtitle="Theo dõi hiệu suất video từ dữ liệu đã lưu. Dự báo AI chưa được kết nối."
        stepNumber={8}
      />

      <div className="wf08-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-details">
            <span className="kpi-label">Tổng số video</span>
            <span className="kpi-number">{videos.length}</span>
            <span className="kpi-subtext">Dữ liệu từ API</span>
          </div>
        </div>
        <div className="ui-card kpi-card-clean">
          <div className="kpi-details">
            <span className="kpi-label">Video tìm thấy</span>
            <span className="kpi-number">{filtered.length}</span>
            <span className="kpi-subtext">Theo từ khóa</span>
          </div>
        </div>
        <div className="ui-card kpi-card-clean">
          <div className="kpi-details">
            <span className="kpi-label">Mô hình dự báo</span>
            <span className="kpi-number">Chưa có</span>
            <span className="kpi-subtext">Chưa kết nối AI</span>
          </div>
        </div>
        <div className="ui-card kpi-card-clean">
          <div className="kpi-details">
            <span className="kpi-label">Độ chính xác dự báo</span>
            <span className="kpi-number">—</span>
            <span className="kpi-subtext">Chưa có dữ liệu đánh giá</span>
          </div>
        </div>
      </div>

      <div className="ui-card" style={{ padding: 20, marginTop: 20 }}>
        <h3>Danh sách video và hiệu suất</h3>
        <input
          type="search"
          placeholder="Tìm theo tiêu đề hoặc đối thủ..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ padding: 10, width: '100%', maxWidth: 400, marginBottom: 16 }}
        />

        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p>Chưa có video trong database hoặc không tìm thấy kết quả.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['#', 'Tiêu đề', 'Đối thủ', 'Nền tảng', 'Lượt xem', 'Lượt thích', 'Bình luận', 'Dự báo', 'Liên kết'].map((title) => (
                    <th key={title} style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #ddd' }}>{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((video, index) => (
                  <tr key={video.id}>
                    <td style={{ padding: 12 }}>{index + 1}</td>
                    <td style={{ padding: 12 }}>{video.title}</td>
                    <td style={{ padding: 12 }}>{video.competitorName || '—'}</td>
                    <td style={{ padding: 12 }}>{video.platform}</td>
                    <td style={{ padding: 12 }}>{number(video.views)}</td>
                    <td style={{ padding: 12 }}>{number(video.likes)}</td>
                    <td style={{ padding: 12 }}>{number(video.comments)}</td>
                    <td style={{ padding: 12 }}>Chưa có</td>
                    <td style={{ padding: 12 }}>
                      {video.url && (
                        <a href={video.url} target="_blank" rel="noreferrer" aria-label="Mở video">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{ marginTop: 16, padding: '8px 12px', cursor: 'pointer' }}
        >
          <RefreshCw size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Tải lại dữ liệu
        </button>
      </div>
    </div>
  );
};
