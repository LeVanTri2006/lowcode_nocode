import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Activity,
  Layers,
  Sparkles,
  Play,
  RotateCw,
} from 'lucide-react';
import './WorkflowExecutionStatus.css';
import { useToast } from '../common/Toast';

export interface WorkflowStatusItem {
  code: string;
  name: string;
  path: string;
  status: 'Hoàn thành' | 'Đang giám sát' | 'Đang chạy' | 'Mock' | 'Sẵn sàng';
  lastRun: string;
  duration: string;
  itemsCount: string;
  isCore: boolean;
}

export const WORKFLOW_EXECUTION_LIST: WorkflowStatusItem[] = [
  {
    code: 'WF01',
    name: 'Quản lý đối thủ & Thu thập dữ liệu',
    path: '/wf01',
    status: 'Sẵn sàng',
    lastRun: 'Chưa có dữ liệu xác nhận',
    duration: '-',
    itemsCount: 'Chưa có dữ liệu xác nhận',
    isCore: true,
  },
  {
    code: 'WF02',
    name: 'Quản lý nội dung & Làm sạch dữ liệu',
    path: '/wf02',
    status: 'Hoàn thành',
    lastRun: '08/10/2026 15:31',
    duration: '5s',
    itemsCount: '15 mục hợp lệ',
    isCore: true,
  },
  {
    code: 'WF03',
    name: 'Phân tích AI nội dung',
    path: '/wf03',
    status: 'Hoàn thành',
    lastRun: '08/10/2026 15:32',
    duration: '28s',
    itemsCount: '15 video đã phân tích',
    isCore: true,
  },
  {
    code: 'WF04',
    name: 'Phân tích hiệu suất đối thủ',
    path: '/wf04',
    status: 'Hoàn thành',
    lastRun: '08/10/2026 15:33',
    duration: '6s',
    itemsCount: '3 đối thủ xếp hạng',
    isCore: true,
  },
  {
    code: 'WF05',
    name: 'Giám sát & Cảnh báo',
    path: '/wf05',
    status: 'Đang giám sát',
    lastRun: '08/10/2026 15:34',
    duration: 'Thời gian thực',
    itemsCount: '8 cảnh báo tăng trưởng',
    isCore: true,
  },
  {
    code: 'WF06',
    name: 'Xu hướng thị trường',
    path: '/wf06',
    status: 'Mock',
    lastRun: 'Dữ liệu mô phỏng',
    duration: '-',
    itemsCount: '25 chủ đề thịnh hành',
    isCore: false,
  },
  {
    code: 'WF07',
    name: 'Cơ hội nội dung',
    path: '/wf07',
    status: 'Mock',
    lastRun: 'Dữ liệu mô phỏng',
    duration: '-',
    itemsCount: '125 ý tưởng đề xuất',
    isCore: false,
  },
  {
    code: 'WF08',
    name: 'Dự báo hiệu suất',
    path: '/wf08',
    status: 'Mock',
    lastRun: 'Dữ liệu mô phỏng',
    duration: '-',
    itemsCount: '320 video dự báo',
    isCore: false,
  },
  {
    code: 'WF09',
    name: 'Báo cáo tự động',
    path: '/wf09',
    status: 'Mock',
    lastRun: 'Dữ liệu mô phỏng',
    duration: '-',
    itemsCount: '36 báo cáo xuất bản',
    isCore: false,
  },
  {
    code: 'WF10',
    name: 'Bảng điều khiển tổng hợp',
    path: '/wf10',
    status: 'Sẵn sàng',
    lastRun: 'Thời gian thực',
    duration: '-',
    itemsCount: 'Toàn bộ chỉ số tổng hợp',
    isCore: false,
  },
];

interface WorkflowExecutionStatusProps {
  onRunWorkflow?: (code: string) => void;
  showActions?: boolean;
  workflowCode?: string;
}

export const WorkflowExecutionStatus: React.FC<WorkflowExecutionStatusProps> = ({
  onRunWorkflow,
  showActions = true,
  workflowCode,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [runState, setRunState] = useState<'Ready' | 'Running' | 'Completed'>('Ready');

  const selectedWorkflow = WORKFLOW_EXECUTION_LIST.find((item) => item.code === workflowCode);
  const runWorkflow = () => {
    if (!selectedWorkflow || runState === 'Running') return;
    setRunState('Running');
    onRunWorkflow?.(selectedWorkflow.code);
    window.setTimeout(() => {
      setRunState('Completed');
      showToast(`${selectedWorkflow.code} đã hoàn thành.`, 'success');
    }, 1200);
  };

  if (selectedWorkflow) {
    return (
      <section className="wf-single-execution ui-card" aria-label={`Trạng thái ${selectedWorkflow.code}`}>
        <div className="wf-single-copy">
          <span className="wf-single-kicker">Trạng thái chạy · Mô phỏng</span>
          <h3>{selectedWorkflow.code} · {selectedWorkflow.name}</h3>
          <p>Chạy mô phỏng cục bộ. Không kết nối API hoặc n8n.</p>
        </div>
        <div className="wf-single-actions">
          <span className={`wf-run-state ${runState.toLowerCase()}`}>
            {runState === 'Ready' ? 'Sẵn sàng' : runState === 'Running' ? 'Đang chạy…' : 'Hoàn thành'}
          </span>
          <button type="button" className="btn btn-primary wf-run-button" onClick={runWorkflow} disabled={runState === 'Running'}>
            {runState === 'Running' ? <RotateCw size={15} className="spin-icon" /> : <Play size={15} />}
            {runState === 'Running' ? 'Đang chạy…' : 'Chạy quy trình'}
          </button>
        </div>
      </section>
    );
  }

  const getStatusBadge = (status: WorkflowStatusItem['status']) => {
    switch (status) {
      case 'Hoàn thành':
        return (
          <span className="wf-status-badge completed">
            <CheckCircle2 size={12} />
            <span>Hoàn thành</span>
          </span>
        );
      case 'Đang giám sát':
        return (
          <span className="wf-status-badge monitoring">
            <Activity size={12} className="pulse-icon" />
            <span>Đang giám sát</span>
          </span>
        );
      case 'Đang chạy':
        return (
          <span className="wf-status-badge running">
            <RotateCw size={12} className="spin-icon" />
            <span>Đang chạy</span>
          </span>
        );
      case 'Sẵn sàng':
        return (
          <span className="wf-status-badge ready">
            <Layers size={12} />
            <span>Sẵn sàng</span>
          </span>
        );
      case 'Mock':
      default:
        return (
          <span className="wf-status-badge mock">
            <Sparkles size={12} />
            <span>Giao diện mô phỏng</span>
          </span>
        );
    }
  };

  return (
    <div className="wf-execution-card ui-card">
      <div className="wf-execution-header">
        <div>
          <h3 className="wf-execution-title">Trạng thái thực thi các Quy trình (luồng thực thi)</h3>
          <p className="wf-execution-subtitle">
            Theo dõi tiến độ, thời gian thực thi và trạng thái dữ liệu từ WF01 đến WF10.
          </p>
        </div>
        <div className="wf-pipeline-pills">
          <span className="pipeline-pill core">WF01 - WF05: Luồng chính</span>
          <span className="pipeline-pill mock">WF06 - WF10: Luồng mở rộng mô phỏng</span>
        </div>
      </div>

      <div className="table-responsive-wrap">
        <table className="wf-execution-table">
          <thead>
            <tr>
              <th style={{ width: '85px' }}>Quy trình</th>
              <th>Tên quy trình nghiệp vụ</th>
              <th style={{ width: '135px' }}>Trạng thái</th>
              <th style={{ width: '145px' }}>Lần chạy gần nhất</th>
              <th style={{ width: '90px' }}>Thời lượng</th>
              <th style={{ width: '170px' }}>Số lượng mục</th>
              {showActions && <th style={{ width: '100px', textAlign: 'center' }}>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {WORKFLOW_EXECUTION_LIST.map((wf) => (
              <tr key={wf.code} className="wf-execution-row">
                <td>
                  <span className={`wf-code-badge ${wf.isCore ? 'core' : 'extended'}`}>
                    {wf.code}
                  </span>
                </td>
                <td>
                  <div className="wf-name-cell">
                    <span className="wf-item-name">{wf.name}</span>
                  </div>
                </td>
                <td>{getStatusBadge(wf.status)}</td>
                <td className="text-muted-cell font-mono">
                  <div className="time-with-icon">
                    {wf.lastRun !== 'Dữ liệu mô phỏng' && <Clock size={12} className="text-muted" />}
                    <span>{wf.lastRun}</span>
                  </div>
                </td>
                <td className="font-semibold text-secondary">{wf.duration}</td>
                <td className="text-muted-cell">{wf.itemsCount}</td>
                {showActions && (
                  <td>
                    <div className="wf-row-actions">
                      <button
                        type="button"
                        className="btn-wf-view"
                        onClick={() => navigate(wf.path)}
                        title={`Mở trang ${wf.code}`}
                      >
                        <span>Xem</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
