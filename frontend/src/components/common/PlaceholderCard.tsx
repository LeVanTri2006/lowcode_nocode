import React from 'react';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PlaceholderCard.css';

interface PlaceholderCardProps {
  workflowCode: string;
  workflowName: string;
  description: string;
  phaseNumber: number;
  expectedFeatures: string[];
  nextWorkflowPath?: string;
  nextWorkflowLabel?: string;
}

export const PlaceholderCard: React.FC<PlaceholderCardProps> = ({
  workflowCode,
  workflowName,
  description,
  phaseNumber,
  expectedFeatures,
  nextWorkflowPath,
  nextWorkflowLabel,
}) => {
  return (
    <div className="placeholder-wrapper fade-in">
      <div className="placeholder-card ui-card">
        <div className="placeholder-header">
          <div className="placeholder-tag">
            <span className="badge badge-primary">
              <Layers size={13} /> Giai đoạn thiết kế: UI PHASE {phaseNumber + 1}
            </span>
            <span className="badge badge-info">Sẵn sàng triển khai</span>
          </div>
          <h2 className="placeholder-title">
            {workflowCode} — {workflowName}
          </h2>
          <p className="placeholder-desc">{description}</p>
        </div>

        <div className="features-preview-box">
          <h4 className="features-preview-title">
            <Sparkles size={16} className="text-primary" />
            Các phân hệ tính năng UI dự kiến:
          </h4>
          <div className="features-grid">
            {expectedFeatures.map((feat, idx) => (
              <div key={idx} className="feature-item">
                <span className="feature-dot" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="placeholder-footer">
          <div className="placeholder-status-note">
            <span className="info-icon">ℹ</span>
            <span>Khung App Shell đã hoàn tất. Đang chờ lệnh kích hoạt UI Phase tiếp theo.</span>
          </div>

          {nextWorkflowPath && (
            <Link to={nextWorkflowPath} className="btn btn-outline next-step-link">
              <span>Xem {nextWorkflowLabel || 'bước tiếp theo'}</span>
              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
