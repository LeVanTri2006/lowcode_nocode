export interface AlertItem {
  id: number;
  contentId: number;
  competitorId: number;
  platform: 'youtube';
  alertType: 'views_growth' | 'likes_growth' | 'comments_growth';
  message: string;
  viewsChange: number;
  likesChange: number;
  commentsChange: number;
  viewsGrowthRate: number;
  likesGrowthRate: number;
  commentsGrowthRate: number;
  createdAt: string;
  status: 'Mới' | 'Đã xử lý';
}

// IDs match contents.ts (1 = TED, 2 = Marques Brownlee, 3 = Veritasium).
export const INITIAL_ALERTS: AlertItem[] = [
  { id: 9, contentId: 4, competitorId: 2, platform: 'youtube', alertType: 'views_growth', message: 'Views tăng 0.01%', viewsChange: 976, likesChange: 3, commentsChange: 0, viewsGrowthRate: 0.01, likesGrowthRate: 0, commentsGrowthRate: 0, createdAt: '2026-10-08T15:45:14.600Z', status: 'Mới' },
  { id: 8, contentId: 1, competitorId: 2, platform: 'youtube', alertType: 'likes_growth', message: 'Likes tăng 0.08%', viewsChange: 420, likesChange: 84, commentsChange: 4, viewsGrowthRate: 0.02, likesGrowthRate: 0.08, commentsGrowthRate: 0.01, createdAt: '2026-10-08T14:32:08.000Z', status: 'Mới' },
  { id: 7, contentId: 6, competitorId: 3, platform: 'youtube', alertType: 'comments_growth', message: 'Comments tăng 0.12%', viewsChange: 260, likesChange: 18, commentsChange: 22, viewsGrowthRate: 0.03, likesGrowthRate: 0.04, commentsGrowthRate: 0.12, createdAt: '2026-10-08T11:18:41.000Z', status: 'Đã xử lý' },
  { id: 6, contentId: 2, competitorId: 1, platform: 'youtube', alertType: 'views_growth', message: 'Views tăng 0.04%', viewsChange: 735, likesChange: 26, commentsChange: 8, viewsGrowthRate: 0.04, likesGrowthRate: 0.03, commentsGrowthRate: 0.02, createdAt: '2026-10-07T21:05:00.000Z', status: 'Mới' },
  { id: 5, contentId: 3, competitorId: 3, platform: 'youtube', alertType: 'likes_growth', message: 'Likes tăng 0.06%', viewsChange: 190, likesChange: 61, commentsChange: 11, viewsGrowthRate: 0.02, likesGrowthRate: 0.06, commentsGrowthRate: 0.05, createdAt: '2026-10-07T17:26:12.000Z', status: 'Đã xử lý' },
  { id: 4, contentId: 5, competitorId: 1, platform: 'youtube', alertType: 'comments_growth', message: 'Comments tăng 0.09%', viewsChange: 330, likesChange: 15, commentsChange: 19, viewsGrowthRate: 0.03, likesGrowthRate: 0.02, commentsGrowthRate: 0.09, createdAt: '2026-10-07T09:14:33.000Z', status: 'Mới' },
  { id: 3, contentId: 7, competitorId: 2, platform: 'youtube', alertType: 'views_growth', message: 'Views tăng 0.03%', viewsChange: 512, likesChange: 21, commentsChange: 5, viewsGrowthRate: 0.03, likesGrowthRate: 0.02, commentsGrowthRate: 0.01, createdAt: '2026-10-06T19:50:00.000Z', status: 'Đã xử lý' },
  { id: 2, contentId: 9, competitorId: 1, platform: 'youtube', alertType: 'likes_growth', message: 'Likes tăng 0.05%', viewsChange: 145, likesChange: 48, commentsChange: 6, viewsGrowthRate: 0.01, likesGrowthRate: 0.05, commentsGrowthRate: 0.02, createdAt: '2026-10-06T12:07:51.000Z', status: 'Mới' },
];
