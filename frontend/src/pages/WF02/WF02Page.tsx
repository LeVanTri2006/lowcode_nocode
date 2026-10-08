import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Filter,
  Layers,
  Video,
  Download,
  Eye,
  Edit2,
  MoreVertical,
  RotateCcw,
} from 'lucide-react';
import { INITIAL_CONTENTS, type VideoContentItem } from '../../mocks/contents';
import { useToast } from '../../components/common/Toast';
import { WorkflowExecutionStatus } from '../../components/workflow/WorkflowExecutionStatus';
import './WF02Page.css';

export const WF02Page: React.FC = () => {
  const { showToast } = useToast();
  const [contents, setContents] = useState<VideoContentItem[]>(INITIAL_CONTENTS);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Filter States
  const [competitorFilter, setCompetitorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Toggle selection
  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === contents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contents.map((c) => c.id));
    }
  };

  // Bulk actions
  const handleBulkStatus = (newStatus: VideoContentItem['status']) => {
    if (selectedIds.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 nội dung để thao tác', 'warning');
      return;
    }
    setContents((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id) ? { ...c, status: newStatus, reason: '-' } : c
      )
    );
    showToast(`Đã cập nhật ${selectedIds.length} nội dung sang "${newStatus}"`, 'success');
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 nội dung để xóa', 'warning');
      return;
    }
    setContents((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    showToast(`Đã xóa ${selectedIds.length} nội dung`, 'info');
    setSelectedIds([]);
  };

  const handleResetFilters = () => {
    setCompetitorFilter('all');
    setStatusFilter('all');
    setKeywordFilter('');
    setStartDate('');
    setEndDate('');
    showToast('Đã đặt lại bộ lọc dữ liệu', 'info');
  };

  // Filtered contents
  const filteredContents = contents.filter((c) => {
    const matchesComp = competitorFilter === 'all' || c.competitorName === competitorFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesKeyword =
      !keywordFilter || c.title.toLowerCase().includes(keywordFilter.toLowerCase());
    return matchesComp && matchesStatus && matchesKeyword;
  });

  // Export
  const handleExport = () => {
    showToast('Đang xuất danh sách 754 nội dung sang file CSV/Excel...', 'success');
  };

  return (
    <div className="wf02-page-container fade-in">
      <PageHeader
        title="WF02 - Quản lý nội dung & Làm sạch dữ liệu"
        subtitle="Loại bỏ nội dung trùng lặp, không hợp lệ và chuẩn hóa dữ liệu video từ YouTube."
        stepNumber={2}
      />
      <WorkflowExecutionStatus workflowCode="WF02" />

      {/* TOP ROW: 4 KPI CARDS */}
      <div className="wf02-kpi-grid">
        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap blue">
            <FileText size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng số nội dung</span>
            <span className="kpi-number">754</span>
            <span className="kpi-subtext positive">↗ +12.5% so với tuần trước</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap green">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Nội dung hợp lệ</span>
            <span className="kpi-number">689</span>
            <span className="kpi-subtext neutral">91.4%</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap red">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Nội dung trùng lặp</span>
            <span className="kpi-number">48</span>
            <span className="kpi-subtext danger">6.4%</span>
          </div>
        </div>

        <div className="ui-card kpi-card-clean">
          <div className="kpi-icon-wrap orange">
            <ShieldAlert size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Nội dung không hợp lệ</span>
            <span className="kpi-number">17</span>
            <span className="kpi-subtext warning">2.2%</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: Left Sidebar + Right Table */}
      <div className="wf02-main-layout">
        {/* LEFT COLUMN: Filters & Bulk Actions */}
        <div className="wf02-left-col">
          {/* Filter Card */}
          <div className="ui-card wf02-filter-card">
            <div className="card-section-title">
              <Filter size={16} className="text-primary" />
              <span>Bộ lọc dữ liệu</span>
            </div>

            <div className="filter-group">
              <label className="filter-field-label">Đối thủ</label>
              <select
                className="filter-select"
                value={competitorFilter}
                onChange={(e) => setCompetitorFilter(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="Marques Brownlee">Marques Brownlee</option>
                <option value="TED">TED</option>
                <option value="Veritasium">Veritasium</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-field-label">Trạng thái</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="Hợp lệ">Hợp lệ</option>
                <option value="Trùng lặp">Trùng lặp</option>
                <option value="Không hợp lệ">Không hợp lệ</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-field-label">Từ khóa</label>
              <input
                type="text"
                placeholder="Tìm kiếm tiêu đề..."
                className="filter-text-input"
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-field-label">Ngày đăng</label>
              <div className="date-range-box">
                <input
                  type="date"
                  className="date-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="date-sep">→</span>
                <input
                  type="date"
                  className="date-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-actions-row">
              <button
                type="button"
                className="btn btn-primary btn-apply-filter"
                onClick={() => showToast('Đã áp dụng bộ lọc!', 'success')}
              >
                🔍 Lọc dữ liệu
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-reset-filter"
                onClick={handleResetFilters}
              >
                <RotateCcw size={13} /> Đặt lại
              </button>
            </div>
          </div>

          {/* Bulk Actions Card */}
          <div className="ui-card wf02-bulk-card">
            <div className="card-section-title">
              <Layers size={16} className="text-primary" />
              <span>Thao tác hàng loạt</span>
            </div>

            <div className="selected-counter">
              <span className="plus-icon">+</span>
              <span>Đã chọn {selectedIds.length} nội dung</span>
            </div>

            <div className="bulk-buttons-list">
              <button
                type="button"
                className="bulk-btn mark-valid"
                onClick={() => handleBulkStatus('Hợp lệ')}
              >
                <span className="dot valid" /> Đánh dấu hợp lệ
              </button>
              <button
                type="button"
                className="bulk-btn mark-dup"
                onClick={() => handleBulkStatus('Trùng lặp')}
              >
                <span className="dot dup" /> Đánh dấu trùng lặp
              </button>
              <button
                type="button"
                className="bulk-btn mark-invalid"
                onClick={() => handleBulkStatus('Không hợp lệ')}
              >
                <span className="dot invalid" /> Đánh dấu không hợp lệ
              </button>
              <button
                type="button"
                className="bulk-btn bulk-del"
                onClick={handleBulkDelete}
              >
                🗑 Xóa đã chọn
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Table */}
        <div className="ui-card wf02-right-col">
          <div className="content-table-header">
            <div className="card-section-title">
              <Video size={18} className="text-primary" />
              <span>Danh sách nội dung</span>
            </div>

            <button type="button" className="btn btn-outline export-btn" onClick={handleExport}>
              <Download size={14} />
              <span>Xuất dữ liệu</span>
            </button>
          </div>

          <div className="table-responsive-wrap">
            <table className="content-data-table">
              <thead>
                <tr>
                  <th style={{ width: '36px' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === contents.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ width: '36px' }}>ID</th>
                  <th style={{ width: '80px' }}>Thumbnail</th>
                  <th>Tiêu đề</th>
                  <th>Đối thủ</th>
                  <th>Ngày đăng</th>
                  <th>Lượt xem</th>
                  <th>Trạng thái</th>
                  <th>Lý do</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredContents.map((row) => {
                  const isChecked = selectedIds.includes(row.id);
                  return (
                    <tr key={row.id} className={isChecked ? 'row-selected' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(row.id)}
                        />
                      </td>
                      <td className="text-muted-cell font-semibold">{row.id}</td>
                      <td>
                        <div
                          className="video-thumb-cell"
                          style={{ background: row.thumbnailGradient }}
                        >
                          <span className="duration-tag">{row.duration}</span>
                        </div>
                      </td>
                      <td>
                        <span className="video-title-text" title={row.title}>
                          {row.title}
                        </span>
                      </td>
                      <td>
                        <div className="comp-mini-cell">
                          <div
                            className="comp-mini-avatar"
                            style={{ backgroundColor: row.competitorAvatarBg }}
                          >
                            {row.competitorAvatarText}
                          </div>
                          <div className="comp-mini-meta">
                            <span className="comp-mini-name">{row.competitorName}</span>
                            <span className="comp-mini-handle">{row.competitorHandle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted-cell">{row.publishedAt}</td>
                      <td className="font-semibold">{row.views}</td>
                      <td>
                        {row.status === 'Hợp lệ' && (
                          <span className="badge badge-success">Hợp lệ</span>
                        )}
                        {row.status === 'Trùng lặp' && (
                          <span className="badge badge-danger">Trùng lặp</span>
                        )}
                        {row.status === 'Không hợp lệ' && (
                          <span className="badge badge-warning">Không hợp lệ</span>
                        )}
                      </td>
                      <td className="text-subtle-cell">{row.reason || '-'}</td>
                      <td>
                        <div className="table-actions-cell">
                          <button
                            type="button"
                            className="action-icon-btn view"
                            title="Xem chi tiết"
                            onClick={() => showToast(`Xem nội dung: ${row.title}`, 'info')}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            className="action-icon-btn edit"
                            title="Chỉnh sửa"
                            onClick={() => showToast(`Chỉnh sửa ${row.title}`, 'info')}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="action-icon-btn more"
                            title="Tùy chọn khác"
                          >
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="table-pagination-footer">
            <span className="pagination-info">Hiển thị 1 - 10 của 754 nội dung</span>

            <div className="pagination-nav">
              <button className="page-nav-btn" disabled={currentPage === 1}>
                &lt;
              </button>
              <button
                className={`page-num-btn ${currentPage === 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              <button className="page-num-btn" onClick={() => setCurrentPage(2)}>
                2
              </button>
              <button className="page-num-btn" onClick={() => setCurrentPage(3)}>
                3
              </button>
              <button className="page-num-btn" onClick={() => setCurrentPage(4)}>
                4
              </button>
              <button className="page-num-btn" onClick={() => setCurrentPage(5)}>
                5
              </button>
              <span className="page-dots">...</span>
              <button className="page-num-btn" onClick={() => setCurrentPage(76)}>
                76
              </button>
              <button className="page-nav-btn">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
