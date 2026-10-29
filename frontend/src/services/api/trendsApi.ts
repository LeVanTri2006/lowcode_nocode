import { getList, apiRequest } from './client';
import type { TrendItem } from '../../types/api';

export const getTrends = (signal?: AbortSignal) =>
  getList<TrendItem>('/api/trends', signal);

export const getTrendById = (id: number, signal?: AbortSignal) =>
  apiRequest<TrendItem>(`/api/trends/${id}`, { signal });
