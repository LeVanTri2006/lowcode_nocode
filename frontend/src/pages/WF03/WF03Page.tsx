import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  Video,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Folder,
  FileText,
  Smile,
  Target,
  Users,
} from 'lucide-react';
import { INITIAL_CONTENTS, type VideoContentItem } from '../../mocks/contents';
import { MOCK_AI_ANALYSES, type AiAnalysisDetail } from '../../mocks/aiAnalyses';
import { useToast } from '../../components/common/Toast';
import './WF03Page.css';

export const WF03Page: React.FC = () => {
  const { showToast } = useToast();
  const [contents] = useState<VideoContentItem[]>(INITIAL_CONTENTS);
  const [selectedVideoId, setSelectedVideoId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'result' | 'keywords' | 'audience' | 'summary' | 'transcript'>('result');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [compFilter, setCompFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Video & Analysis Detail
  const selectedVideo = contents.find((c) => c.id === selectedVideoId) || contents[0];
  const aiDetail: AiAnalysisDetail =
    MOCK_AI_ANALYSES[selectedVideo.id] || MOCK_AI_ANALYSES[1];

  const filteredList = contents.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.competitorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesComp = compFilter === 'all' || c.competitorName === compFilter;
    const matchesStatus = statusFilter === 'all' || c.aiStatus === statusFilter;
    return matchesSearch && matchesComp && matchesStatus;
  });

  const handleBatchAnalyze = () => {
    showToast('Đang tiến hành phân tích AI hàng loạt cho 10 video mới...', 'info');
    setTimeout(() => {
      showToast('Phân tích AI hàng loạt hoàn tất! Độ chính xác trung bình 93.4%', 'success');
    }, 1500);
  };

  const handlePrevVideo = () => {
    const idx = contents.findIndex((c) => c.id === selectedVideoId);
    if (idx > 0) setSelectedVideoId(contents[idx - 1].id);
  };

  const handleNextVideo = () => {
    const idx = contents.findIndex((c) => c.id === selectedVideoId);
    if (idx < contents.length - 1) setSelectedVideoId(contents[idx + 1].id);
  };

  return (
    <div className="wf03-page-container fade-in">
      <PageHeader
        title="WF03 - Phân tích AI nội dung"
        subtitle="Sử dụng AI để phân tích chủ đề, danh mục, cảm xúc và thông tin chi tiết của từng video."
        stepNumber={3}
      />

      {/* TOP ROW: 4 KPI CARDS */}
      <div className="wf03-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue">
            <Video size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng video đã phân tích</span>
            <span className="kpi-number">689</span>
            <span className="kpi-subtext positive">↗ +28.5% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Phân tích thành công</span>
            <span className="kpi-number">652</span>
            <span className="kpi-subtext neutral">94.6%</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap red">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Phân tích thất bại</span>
            <span className="kpi-number">27</span>
            <span className="kpi-subtext danger">3.9%</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap orange">
            <Clock size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Đang xử lý</span>
            <span className="kpi-number">10</span>
            <span className="kpi-subtext warning">1.5%</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS: Left List & Right Detail Panel */}
      <div className="wf03-columns-grid">
        {/* LEFT COLUMN */}
        <div className="ui-card wf03-list-card">
          <div className="list-card-header">
            <div className="card-section-title">
              <Video size={18} className="text-primary" />
              <span>Danh sách video cần phân tích AI (WF03)</span>
            </div>
          </div>

          {/* Search, Filters & Batch Button */}
          <div className="list-controls-bar">
            <div className="search-wrap">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm tiêu đề, đối thủ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="list-search-input"
              />
            </div>

            <select
              value={compFilter}
              onChange={(e) => setCompFilter(e.target.value)}
              className="list-select"
            >
              <option value="all">Đối thủ: Tất cả</option>
              <option value="Marques Brownlee">Marques Brownlee</option>
              <option value="TED">TED</option>
              <option value="Veritasium">Veritasium</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="list-select"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="Đã phân tích">Đã phân tích</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Thất bại">Thất bại</option>
            </select>

            <button
              type="button"
              className="btn btn-primary btn-batch-analyze"
              onClick={handleBatchAnalyze}
            >
              <Sparkles size={14} />
              <span>Phân tích AI hàng loạt</span>
            </button>
          </div>

          {/* Video Table */}
          <div className="table-responsive-wrap">
            <table className="ai-video-table">
              <thead>
                <tr>
                  <th style={{ width: '32px' }}>
                    <input type="checkbox" />
                  </th>
                  <th style={{ width: '32px' }}>#</th>
                  <th style={{ width: '64px' }}>Thumbnail</th>
                  <th>Tiêu đề</th>
                  <th>Đối thủ</th>
                  <th>Ngày đăng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((video, idx) => {
                  const isCurrent = video.id === selectedVideo.id;
                  return (
                    <tr
                      key={video.id}
                      className={`video-row ${isCurrent ? 'row-active' : ''}`}
                      onClick={() => setSelectedVideoId(video.id)}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isCurrent} readOnly />
                      </td>
                      <td className="text-muted-cell font-semibold">{idx + 1}</td>
                      <td>
                        <div
                          className="video-thumb-mini"
                          style={{ background: video.thumbnailGradient }}
                        >
                          <span className="duration-tag">{video.duration}</span>
                        </div>
                      </td>
                      <td>
                        <span className="video-title-truncate">{video.title}</span>
                      </td>
                      <td>
                        <div className="comp-mini-cell">
                          <div
                            className="comp-mini-avatar"
                            style={{ backgroundColor: video.competitorAvatarBg }}
                          >
                            {video.competitorAvatarText}
                          </div>
                          <div className="comp-mini-meta">
                            <span className="comp-mini-name">{video.competitorName}</span>
                            <span className="comp-mini-handle">{video.competitorHandle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted-cell">{video.publishedAt}</td>
                      <td>
                        {video.aiStatus === 'Đã phân tích' && (
                          <span className="badge badge-success">Đã phân tích</span>
                        )}
                        {video.aiStatus === 'Đang xử lý' && (
                          <span className="badge badge-primary">Đang xử lý</span>
                        )}
                        {video.aiStatus === 'Thất bại' && (
                          <span className="badge badge-danger">Thất bại</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="table-pagination-footer">
            <span className="pagination-info">Hiển thị 1 - 8 của 689 video</span>
            <div className="pagination-nav">
              <button className="page-nav-btn">&lt;</button>
              <button className="page-num-btn active">1</button>
              <button className="page-num-btn">2</button>
              <button className="page-num-btn">3</button>
              <button className="page-num-btn">4</button>
              <button className="page-num-btn">5</button>
              <span className="page-dots">...</span>
              <button className="page-num-btn">87</button>
              <button className="page-nav-btn">&gt;</button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Detail Panel */}
        <div className="ui-card wf03-detail-card">
          <div className="detail-card-header">
            <div className="card-section-title">
              <Sparkles size={18} className="text-primary" />
              <span>Chi tiết phân tích AI</span>
            </div>

            <div className="detail-header-actions">
              <div className="nav-arrows-group">
                <button
                  type="button"
                  className="arrow-btn"
                  onClick={handlePrevVideo}
                  aria-label="Previous video"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="arrow-btn"
                  onClick={handleNextVideo}
                  aria-label="Next video"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <a
                href={selectedVideo.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-yt-external"
              >
                <span>Xem video trên YouTube</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Video Preview Banner */}
          <div className="video-hero-preview">
            <div
              className="preview-thumbnail"
              style={{ background: selectedVideo.thumbnailGradient }}
            >
              <div className="play-circle-center">
                <div className="play-triangle" />
              </div>
              <span className="preview-duration">{selectedVideo.duration}</span>
            </div>

            <div className="preview-info-box">
              <h3 className="preview-video-title">{selectedVideo.title}</h3>
              <div className="preview-author-row">
                <div
                  className="author-avatar"
                  style={{ backgroundColor: selectedVideo.competitorAvatarBg }}
                >
                  {selectedVideo.competitorAvatarText}
                </div>
                <div className="author-details">
                  <span className="author-name">{selectedVideo.competitorName}</span>
                  <span className="author-handle">{selectedVideo.competitorHandle}</span>
                </div>
              </div>
              <div className="preview-stats-line">
                <span className="yt-badge">▶ {selectedVideo.views} lượt xem</span>
                <span className="dot-sep">•</span>
                <span>{selectedVideo.publishedAt}</span>
              </div>
            </div>
          </div>

          {/* Detail Tabs */}
          <div className="detail-tabs-nav">
            <button
              className={`detail-tab-btn ${activeTab === 'result' ? 'active' : ''}`}
              onClick={() => setActiveTab('result')}
            >
              Kết quả phân tích AI
            </button>
            <button
              className={`detail-tab-btn ${activeTab === 'keywords' ? 'active' : ''}`}
              onClick={() => setActiveTab('keywords')}
            >
              Từ khóa & Chủ đề
            </button>
            <button
              className={`detail-tab-btn ${activeTab === 'audience' ? 'active' : ''}`}
              onClick={() => setActiveTab('audience')}
            >
              Đối tượng
            </button>
            <button
              className={`detail-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              Tóm tắt
            </button>
            <button
              className={`detail-tab-btn ${activeTab === 'transcript' ? 'active' : ''}`}
              onClick={() => setActiveTab('transcript')}
            >
              Transcript
            </button>
          </div>

          {/* TAB 1: KẾT QUẢ PHÂN TÍCH AI (DEFAULT) */}
          {activeTab === 'result' && (
            <div className="tab-pane-result fade-in">
              {/* 4 Attributes Grid */}
              <div className="ai-attributes-grid">
                <div className="ai-attr-card">
                  <div className="attr-top">
                    <div className="attr-title-group">
                      <Lightbulb size={16} className="attr-icon text-danger" />
                      <span className="attr-label">Chủ đề chính (Topic)</span>
                    </div>
                    <span className="badge-confidence">Độ tin cậy: {aiDetail.topicConfidence}%</span>
                  </div>
                  <div className="attr-value-bold">{aiDetail.topic}</div>
                </div>

                <div className="ai-attr-card">
                  <div className="attr-top">
                    <div className="attr-title-group">
                      <Folder size={16} className="attr-icon text-primary" />
                      <span className="attr-label">Danh mục (Category)</span>
                    </div>
                    <span className="badge-confidence">Độ tin cậy: {aiDetail.categoryConfidence}%</span>
                  </div>
                  <div className="attr-value-bold">{aiDetail.category}</div>
                </div>

                <div className="ai-attr-card">
                  <div className="attr-top">
                    <div className="attr-title-group">
                      <FileText size={16} className="attr-icon text-primary" />
                      <span className="attr-label">Loại nội dung (Content Type)</span>
                    </div>
                    <span className="badge-confidence">Độ tin cậy: {aiDetail.contentTypeConfidence}%</span>
                  </div>
                  <div className="attr-value-bold">{aiDetail.contentType}</div>
                </div>

                <div className="ai-attr-card">
                  <div className="attr-top">
                    <div className="attr-title-group">
                      <Smile size={16} className="attr-icon text-success" />
                      <span className="attr-label">Cảm xúc (Sentiment)</span>
                    </div>
                    <span className="badge-confidence">Độ tin cậy: {aiDetail.sentimentConfidence}%</span>
                  </div>
                  <div className="attr-value-bold">{aiDetail.sentiment}</div>
                </div>
              </div>

              {/* Text Insights Cards */}
              <div className="ai-text-insights-list">
                <div className="ai-insight-box">
                  <div className="insight-box-title">
                    <FileText size={16} className="text-primary" />
                    <span>Tóm tắt nội dung (AI)</span>
                  </div>
                  <p className="insight-box-body">{aiDetail.summary}</p>
                </div>

                <div className="ai-insight-box">
                  <div className="insight-box-title">
                    <Target size={16} className="text-danger" />
                    <span>Thông điệp chính (Key Message)</span>
                  </div>
                  <p className="insight-box-body">{aiDetail.keyMessage}</p>
                </div>

                <div className="ai-insight-box">
                  <div className="insight-box-title">
                    <Users size={16} className="text-primary" />
                    <span>Đối tượng mục tiêu (Target Audience)</span>
                  </div>
                  <p className="insight-box-body">{aiDetail.targetAudience}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TỪ KHÓA & CHỦ ĐỀ */}
          {activeTab === 'keywords' && (
            <div className="tab-pane-keywords fade-in">
              <h5 className="sub-tab-title">Từ khóa cốt lõi trích xuất tự động:</h5>
              <div className="keywords-cloud">
                {aiDetail.keywords.map((kw, i) => (
                  <span key={i} className="keyword-tag">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ĐỐI TƯỢNG */}
          {activeTab === 'audience' && (
            <div className="tab-pane-box fade-in">
              <h5 className="sub-tab-title">Chân dung đối tượng người xem:</h5>
              <p className="audience-paragraph">{aiDetail.targetAudience}</p>
            </div>
          )}

          {/* TAB 4: TÓM TẮT */}
          {activeTab === 'summary' && (
            <div className="tab-pane-box fade-in">
              <h5 className="sub-tab-title">Bản tóm tắt chuyên sâu từ mô hình AI:</h5>
              <p className="summary-paragraph">{aiDetail.summary}</p>
            </div>
          )}

          {/* TAB 5: TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div className="tab-pane-box fade-in">
              <h5 className="sub-tab-title">Trích đoạn phụ đề (Transcript):</h5>
              <blockquote className="transcript-quote">{aiDetail.transcriptExcerpt}</blockquote>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
