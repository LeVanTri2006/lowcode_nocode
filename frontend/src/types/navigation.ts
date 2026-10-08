export interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  badge?: string | number;
  group?: 'core' | 'advanced';
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl?: string;
  initials: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'alert';
}
