export interface AlertItem {
  id: number;
  time: string;
  videoTitle: string;
  competitor: string;
  competitorHandle: string;
  avatarBg: string;
  avatarText: string;
  alertType: 'Tăng trưởng đột biến' | 'Video mới nổi bật' | 'Đối thủ mới' | 'Xu hướng mới';
  severity: 'Cao' | 'Trung bình' | 'Thấp';
  detail: string;
  status: 'Mới' | 'Đã xử lý';
  thumbnailGradient: string;
}

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 1,
    time: '08/10/2026 15:42',
    videoTitle: 'Xiaomi 18 Pro Max: Họ lại làm nên điều kỳ diệu!',
    competitor: 'Marques Brownlee',
    competitorHandle: '@mkbhd',
    avatarBg: '#B45309',
    avatarText: 'MB',
    alertType: 'Tăng trưởng đột biến',
    severity: 'Cao',
    detail: 'Lượt xem tăng 350% trong 24h',
    status: 'Mới',
    thumbnailGradient: 'linear-gradient(135deg, #1e293b, #334155)',
  },
  {
    id: 2,
    time: '08/10/2026 13:20',
    videoTitle: 'The future of AI and humanity',
    competitor: 'TED',
    competitorHandle: '@TED',
    avatarBg: '#E11D48',
    avatarText: 'TED',
    alertType: 'Video mới nổi bật',
    severity: 'Trung bình',
    detail: 'Video mới đạt 500K view sau 12h',
    status: 'Đã xử lý',
    thumbnailGradient: 'linear-gradient(135deg, #18181b, #27272a)',
  },
  {
    id: 3,
    time: '07/10/2026 21:15',
    videoTitle: 'Chúng tôi đang thử nghiệm lỗ đen trong phòng thí nghiệm...',
    competitor: 'Veritasium',
    competitorHandle: '@veritasium',
    avatarBg: '#2563EB',
    avatarText: 'Ve',
    alertType: 'Tăng trưởng đột biến',
    severity: 'Cao',
    detail: 'Lượt xem tăng 280% trong 24h',
    status: 'Mới',
    thumbnailGradient: 'linear-gradient(135deg, #451a03, #78350f)',
  },
  {
    id: 4,
    time: '07/10/2026 18:30',
    videoTitle: 'Apple Watch gặp sự cố nghiêm trọng? Đánh giá thực tế',
    competitor: 'Marques Brownlee',
    competitorHandle: '@mkbhd',
    avatarBg: '#B45309',
    avatarText: 'MB',
    alertType: 'Xu hướng mới',
    severity: 'Trung bình',
    detail: 'Chủ đề đang được thảo luận nhiều',
    status: 'Đã xử lý',
    thumbnailGradient: 'linear-gradient(135deg, #172554, #1e3a8a)',
  },
  {
    id: 5,
    time: '06/10/2026 16:47',
    videoTitle: 'Cách sử dụng công nghệ để thay đổi thế giới',
    competitor: 'TED',
    competitorHandle: '@TED',
    avatarBg: '#E11D48',
    avatarText: 'TED',
    alertType: 'Video mới nổi bật',
    severity: 'Thấp',
    detail: 'Video mới đạt 200K view sau 24h',
    status: 'Đã xử lý',
    thumbnailGradient: 'linear-gradient(135deg, #042f2e, #134e4a)',
  },
  {
    id: 6,
    time: '06/10/2026 10:12',
    videoTitle: 'AI sẽ thay đổi thế giới như thế nào?',
    competitor: 'Veritasium',
    competitorHandle: '@veritasium',
    avatarBg: '#2563EB',
    avatarText: 'Ve',
    alertType: 'Đối thủ mới',
    severity: 'Trung bình',
    detail: 'Đối thủ đăng video về chủ đề mới',
    status: 'Mới',
    thumbnailGradient: 'linear-gradient(135deg, #311042, #581c87)',
  },
];
