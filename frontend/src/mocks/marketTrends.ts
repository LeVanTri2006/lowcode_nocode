export interface MarketTopic {
  name: string;
  percentage: number;
  color: string;
}

export const MARKET_TOPICS: MarketTopic[] = [
  { name: 'AI & Technology', percentage: 28.5, color: '#3B82F6' },
  { name: 'Product Review', percentage: 22.1, color: '#10B981' },
  { name: 'Science & Education', percentage: 18.7, color: '#EF4444' },
  { name: 'Gaming', percentage: 15.3, color: '#8B5CF6' },
  { name: 'Smartphone', percentage: 15.4, color: '#F59E0B' },
];

export interface FastGrowthTopic {
  id: number;
  name: string;
  growth: string;
  gradient: string;
}

export const FAST_GROWTH_TOPICS: FastGrowthTopic[] = [
  { id: 1, name: 'AI Tools Review', growth: '+120%', gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' },
  { id: 2, name: 'Smart Home Technology', growth: '+95%', gradient: 'linear-gradient(135deg, #064e3b, #10b981)' },
  { id: 3, name: 'iPhone 17', growth: '+78%', gradient: 'linear-gradient(135deg, #1e293b, #475569)' },
  { id: 4, name: 'AI in Education', growth: '+65%', gradient: 'linear-gradient(135deg, #312e81, #6366f1)' },
  { id: 5, name: 'Sustainable Tech', growth: '+62%', gradient: 'linear-gradient(135deg, #14532d, #22c55e)' },
];

export interface TrendingKeyword {
  id: number;
  keyword: string;
  videoCount: string;
  growth: string;
  popularity: 'Cao' | 'Trung bình' | 'Thấp';
  sparklineColor: string;
  sparklinePath: string;
}

export const TRENDING_KEYWORDS: TrendingKeyword[] = [
  { id: 1, keyword: 'ai tools', videoCount: '1.2K', growth: '+120%', popularity: 'Cao', sparklineColor: '#10B981', sparklinePath: 'M0,15 Q15,10 30,5 T60,2' },
  { id: 2, keyword: 'iphone 17', videoCount: '892', growth: '+76%', popularity: 'Cao', sparklineColor: '#10B981', sparklinePath: 'M0,16 Q15,12 30,8 T60,4' },
  { id: 3, keyword: 'smart home', videoCount: '654', growth: '+95%', popularity: 'Trung bình', sparklineColor: '#10B981', sparklinePath: 'M0,14 Q15,10 30,6 T60,3' },
  { id: 4, keyword: 'ai education', videoCount: '521', growth: '+65%', popularity: 'Trung bình', sparklineColor: '#10B981', sparklinePath: 'M0,16 Q15,13 30,8 T60,5' },
  { id: 5, keyword: 'sustainable tech', videoCount: '498', growth: '+62%', popularity: 'Trung bình', sparklineColor: '#10B981', sparklinePath: 'M0,15 Q15,12 30,9 T60,6' },
  { id: 6, keyword: 'productivity apps', videoCount: '420', growth: '+48%', popularity: 'Thấp', sparklineColor: '#3B82F6', sparklinePath: 'M0,16 Q15,14 30,10 T60,8' },
  { id: 7, keyword: 'electric vehicle', videoCount: '387', growth: '+45%', popularity: 'Thấp', sparklineColor: '#3B82F6', sparklinePath: 'M0,15 Q15,13 30,11 T60,9' },
  { id: 8, keyword: 'vr ar', videoCount: '321', growth: '+38%', popularity: 'Thấp', sparklineColor: '#3B82F6', sparklinePath: 'M0,16 Q15,14 30,12 T60,10' },
];
