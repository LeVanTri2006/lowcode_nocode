export interface CompetitorPerformance {
  rank: number;
  competitor: string;
  handle: string;
  avatarBg: string;
  avatarText: string;
  videoCount: number;
  totalViews: string;
  totalViewsNumeric: number;
  totalLikes: string;
  totalComments: string;
  engagementRate: string;
}

export const MOCK_COMPETITOR_PERFORMANCE: CompetitorPerformance[] = [
  {
    rank: 1,
    competitor: 'Marques Brownlee',
    handle: '@mkbhd',
    avatarBg: '#B45309',
    avatarText: 'MB',
    videoCount: 342,
    totalViews: '16.8M',
    totalViewsNumeric: 16800000,
    totalLikes: '320K',
    totalComments: '18.4K',
    engagementRate: '4.2%',
  },
  {
    rank: 2,
    competitor: 'Veritasium',
    handle: '@veritasium',
    avatarBg: '#2563EB',
    avatarText: 'Ve',
    videoCount: 287,
    totalViews: '8.7M',
    totalViewsNumeric: 8700000,
    totalLikes: '180K',
    totalComments: '9.2K',
    engagementRate: '5.4%',
  },
  {
    rank: 3,
    competitor: 'TED',
    handle: '@TED',
    avatarBg: '#E11D48',
    avatarText: 'TED',
    videoCount: 125,
    totalViews: '4.2M',
    totalViewsNumeric: 4200000,
    totalLikes: '95K',
    totalComments: '5.1K',
    engagementRate: '3.1%',
  },
];

export interface ViewsTrendPoint {
  date: string;
  mkbhd: number;
  veritasium: number;
  ted: number;
}

export const MOCK_VIEWS_TREND: ViewsTrendPoint[] = [
  { date: '02/10', mkbhd: 6.8, veritasium: 3.8, ted: 1.8 },
  { date: '03/10', mkbhd: 8.5, veritasium: 4.6, ted: 2.2 },
  { date: '04/10', mkbhd: 10.4, veritasium: 5.4, ted: 2.7 },
  { date: '05/10', mkbhd: 12.1, veritasium: 6.3, ted: 3.1 },
  { date: '06/10', mkbhd: 13.8, veritasium: 7.2, ted: 3.5 },
  { date: '07/10', mkbhd: 15.2, veritasium: 7.9, ted: 3.9 },
  { date: '08/10', mkbhd: 16.8, veritasium: 8.7, ted: 4.2 },
];
