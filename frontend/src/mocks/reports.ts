export interface AutoReportItem {
  id: number;
  name: string;
  reportType: 'Báo cáo tuần' | 'Báo cáo tháng';
  platform: 'YouTube' | 'TikTok' | 'Facebook' | 'Tổng hợp' | 'Ý tưởng';
  createdAt: string;
  status: 'Đã gửi' | 'Đang tạo' | 'Chờ gửi';
  recipientsCount: number;
}

export const INITIAL_REPORTS: AutoReportItem[] = [
  {
    id: 1,
    name: 'Báo cáo tuần - YouTube',
    reportType: 'Báo cáo tuần',
    platform: 'YouTube',
    createdAt: '08/10/2026 09:00',
    status: 'Đã gửi',
    recipientsCount: 5,
  },
  {
    id: 2,
    name: 'Báo cáo tuần - TikTok',
    reportType: 'Báo cáo tuần',
    platform: 'TikTok',
    createdAt: '08/10/2026 09:00',
    status: 'Đã gửi',
    recipientsCount: 5,
  },
  {
    id: 3,
    name: 'Báo cáo tuần - Facebook',
    reportType: 'Báo cáo tuần',
    platform: 'Facebook',
    createdAt: '08/10/2026 09:00',
    status: 'Đã gửi',
    recipientsCount: 5,
  },
  {
    id: 4,
    name: 'Báo cáo tổng hợp thị trường',
    reportType: 'Báo cáo tháng',
    platform: 'Tổng hợp',
    createdAt: '07/10/2026 14:00',
    status: 'Đang tạo',
    recipientsCount: 8,
  },
  {
    id: 5,
    name: 'Báo cáo cơ hội nội dung',
    reportType: 'Báo cáo tuần',
    platform: 'Ý tưởng',
    createdAt: '07/10/2026 16:00',
    status: 'Đã gửi',
    recipientsCount: 5,
  },
];
