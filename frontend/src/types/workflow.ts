export interface WorkflowStep {
  stepNumber: number;
  id: string;
  name: string;
  shortName: string;
  path: string;
  description: string;
  group: 'core' | 'advanced';
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    stepNumber: 1,
    id: 'wf01',
    name: 'WF01 - Quản lý đối thủ & Thu thập dữ liệu',
    shortName: 'Đối thủ & Thu thập',
    path: '/wf01',
    description: 'Thêm, chỉnh sửa, xóa đối thủ và quản lý việc thu thập dữ liệu từ YouTube.',
    group: 'core',
  },
  {
    stepNumber: 2,
    id: 'wf02',
    name: 'WF02 - Quản lý nội dung & Làm sạch dữ liệu',
    shortName: 'Làm sạch dữ liệu',
    path: '/wf02',
    description: 'Loại bỏ nội dung trùng lặp, không hợp lệ và chuẩn hóa dữ liệu video từ YouTube.',
    group: 'core',
  },
  {
    stepNumber: 3,
    id: 'wf03',
    name: 'WF03 - Phân tích AI nội dung',
    shortName: 'Phân tích AI',
    path: '/wf03',
    description: 'Sử dụng AI để phân tích chủ đề, danh mục, cảm xúc và thông điệp chi tiết của từng video.',
    group: 'core',
  },
  {
    stepNumber: 4,
    id: 'wf04',
    name: 'WF04 - Phân tích hiệu suất đối thủ',
    shortName: 'Hiệu suất',
    path: '/wf04',
    description: 'Đánh giá hiệu suất nội dung và so sánh đối thủ dựa trên các chỉ số tương tác, lượt xem và xu hướng.',
    group: 'core',
  },
  {
    stepNumber: 5,
    id: 'wf05',
    name: 'WF05 - Giám sát & Cảnh báo',
    shortName: 'Giám sát & Cảnh báo',
    path: '/wf05',
    description: 'Theo dõi đối thủ, phát hiện nội dung bất thường và gửi cảnh báo kịp thời.',
    group: 'core',
  },
  {
    stepNumber: 6,
    id: 'wf06',
    name: 'WF06 - Xu hướng thị trường',
    shortName: 'Xu hướng thị trường',
    path: '/wf06',
    description: 'Khám phá các chủ đề thịnh hành, từ khóa tăng trưởng và phân phối nội dung trong ngành.',
    group: 'advanced',
  },
  {
    stepNumber: 7,
    id: 'wf07',
    name: 'WF07 - Cơ hội nội dung',
    shortName: 'Cơ hội nội dung',
    path: '/wf07',
    description: 'Tìm kiếm cơ hội đề tài tiềm năng cao, ý tưởng sáng tạo và đề xuất nội dung cạnh tranh.',
    group: 'advanced',
  },
  {
    stepNumber: 8,
    id: 'wf08',
    name: 'WF08 - Dự báo hiệu suất',
    shortName: 'Dự báo hiệu suất',
    path: '/wf08',
    description: 'Dự báo lượt xem tương lai và phân tích tiềm năng tăng trưởng theo mô hình học máy.',
    group: 'advanced',
  },
  {
    stepNumber: 9,
    id: 'wf09',
    name: 'WF09 - Báo cáo tự động',
    shortName: 'Báo cáo tự động',
    path: '/wf09',
    description: 'Lên lịch xuất báo cáo định kỳ và gửi qua Email, Slack, Google Drive.',
    group: 'advanced',
  },
];
