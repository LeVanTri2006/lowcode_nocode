export interface OpportunityItem {
  id: number;
  title: string;
  platform: 'YouTube' | 'TikTok' | 'Facebook';
  keywords: string[];
  potentialLevel: 'Cao' | 'Trung bình' | 'Thấp';
  expectedViews: string;
  thumbnailGradient: string;
}

export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 1,
    title: 'Khám phá 10 hòn đảo đẹp nhất Việt Nam 2024',
    platform: 'YouTube',
    keywords: ['du lịch', 'việt nam', 'đảo đẹp'],
    potentialLevel: 'Cao',
    expectedViews: '1.2M',
    thumbnailGradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
  },
  {
    id: 2,
    title: 'Top 5 món ăn đường phố Đà Nẵng nên thử',
    platform: 'TikTok',
    keywords: ['ẩm thực', 'đà nẵng', 'street food'],
    potentialLevel: 'Cao',
    expectedViews: '850K',
    thumbnailGradient: 'linear-gradient(135deg, #b45309, #d97706)',
  },
  {
    id: 3,
    title: 'Kinh nghiệm du lịch Đà Lạt tự túc 2024',
    platform: 'YouTube',
    keywords: ['đà lạt', 'du lịch tự túc', 'kinh nghiệm'],
    potentialLevel: 'Trung bình',
    expectedViews: '420K',
    thumbnailGradient: 'linear-gradient(135deg, #15803d, #16a34a)',
  },
  {
    id: 4,
    title: 'Review resort cao cấp ở Phú Quốc',
    platform: 'YouTube',
    keywords: ['phú quốc', 'resort', 'review'],
    potentialLevel: 'Cao',
    expectedViews: '980K',
    thumbnailGradient: 'linear-gradient(135deg, #0f766e, #14b8a6)',
  },
  {
    id: 5,
    title: 'Hướng dẫn săn vé máy bay giá rẻ',
    platform: 'Facebook',
    keywords: ['vé máy bay', 'du lịch', 'mẹo du lịch'],
    potentialLevel: 'Trung bình',
    expectedViews: '310K',
    thumbnailGradient: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
  },
];
