export interface CompetitorItem {
  id: number;
  name: string;
  handle: string;
  platform: 'YouTube' | 'TikTok' | 'Facebook';
  channelId: string;
  videoCount: number;
  lastCollectedAt: string;
  status: 'Đang theo dõi' | 'Tạm dừng';
  avatarBg: string;
  avatarText: string;
  avatarImg?: string;
}

export const INITIAL_COMPETITORS: CompetitorItem[] = [
  {
    id: 1,
    name: 'TED',
    handle: '@TED',
    platform: 'YouTube',
    channelId: '@TED',
    videoCount: 125,
    lastCollectedAt: '08/10/2026 15:30',
    status: 'Đang theo dõi',
    avatarBg: '#E11D48',
    avatarText: 'TED',
  },
  {
    id: 2,
    name: 'Marques Brownlee',
    handle: '@mkbhd',
    platform: 'YouTube',
    channelId: '@mkbhd',
    videoCount: 342,
    lastCollectedAt: '08/10/2026 15:30',
    status: 'Đang theo dõi',
    avatarBg: '#B45309',
    avatarText: 'MB',
  },
  {
    id: 3,
    name: 'Veritasium',
    handle: '@veritasium',
    platform: 'YouTube',
    channelId: '@veritasium',
    videoCount: 287,
    lastCollectedAt: '08/10/2026 15:30',
    status: 'Đang theo dõi',
    avatarBg: '#2563EB',
    avatarText: 'Ve',
  },
];

export interface CollectionHistoryItem {
  id: number;
  time: string;
  status: 'Hoàn thành' | 'Đang chạy' | 'Thất bại';
  videoCount: number;
  note: string;
}

export const INITIAL_COLLECTION_HISTORY: CollectionHistoryItem[] = [
  {
    id: 1,
    time: '08/10/2026 15:30',
    status: 'Hoàn thành',
    videoCount: 50,
    note: 'Thu thập cho 3 đối thủ',
  },
  {
    id: 2,
    time: '07/10/2026 15:30',
    status: 'Hoàn thành',
    videoCount: 50,
    note: 'Thu thập cho 3 đối thủ',
  },
  {
    id: 3,
    time: '06/10/2026 15:30',
    status: 'Hoàn thành',
    videoCount: 50,
    note: 'Thu thập cho 3 đối thủ',
  },
];
