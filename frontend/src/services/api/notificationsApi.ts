import { getList } from './client';
import type { SystemNotification } from '../../types/api';

export const getNotifications = (signal?: AbortSignal) =>
  getList<SystemNotification>('/api/notifications', signal);
