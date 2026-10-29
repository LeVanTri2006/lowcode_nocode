import { getList, apiRequest } from './client';
import type { StrategyItem } from '../../types/api';

export const getStrategies = (signal?: AbortSignal) =>
  getList<StrategyItem>('/api/strategies', signal);

export const getStrategyById = (id: number, signal?: AbortSignal) =>
  apiRequest<StrategyItem>(`/api/strategies/${id}`, { signal });
