export interface VideoForecastItem {
  id: number;
  title: string;
  competitor: string;
  platform: 'YouTube' | 'TikTok';
  currentViews: string;
  forecast7d: string;
  forecast30d: string;
  potential: 'Rất cao' | 'Cao' | 'Trung bình' | 'Thấp';
  duration: string;
  gradient: string;
}

export const INITIAL_FORECASTS: VideoForecastItem[] = [
  {
    id: 1,
    title: 'Xiaomi 18 Pro Max: Họ lại làm nên điều kỳ diệu!',
    competitor: 'Marques Brownlee',
    platform: 'YouTube',
    currentViews: '1.2M',
    forecast7d: '1.4M (+17%)',
    forecast30d: '1.8M (+50%)',
    potential: 'Rất cao',
    duration: '12:05',
    gradient: 'linear-gradient(135deg, #1e293b, #334155)',
  },
  {
    id: 2,
    title: 'The future of AI and humanity',
    competitor: 'TED',
    platform: 'YouTube',
    currentViews: '3.2M',
    forecast7d: '3.8M (+19%)',
    forecast30d: '4.8M (+50%)',
    potential: 'Cao',
    duration: '10:18',
    gradient: 'linear-gradient(135deg, #18181b, #27272a)',
  },
  {
    id: 3,
    title: 'Chúng tôi đang thử nghiệm lỗ đen...',
    competitor: 'Veritasium',
    platform: 'YouTube',
    currentViews: '500K',
    forecast7d: '590K (+18%)',
    forecast30d: '765K (+53%)',
    potential: 'Cao',
    duration: '08:32',
    gradient: 'linear-gradient(135deg, #451a03, #78350f)',
  },
  {
    id: 4,
    title: 'Apple Watch gặp sự cố nghiêm trọng?',
    competitor: 'Marques Brownlee',
    platform: 'YouTube',
    currentViews: '667K',
    forecast7d: '780K (+17%)',
    forecast30d: '1.1M (+51%)',
    potential: 'Trung bình',
    duration: '14:25',
    gradient: 'linear-gradient(135deg, #172554, #1e3a8a)',
  },
  {
    id: 5,
    title: 'Cách sử dụng công nghệ để thay đổi thế giới',
    competitor: 'TED',
    platform: 'YouTube',
    currentViews: '321K',
    forecast7d: '376K (+17%)',
    forecast30d: '482K (+50%)',
    potential: 'Trung bình',
    duration: '11:03',
    gradient: 'linear-gradient(135deg, #042f2e, #134e4a)',
  },
];
