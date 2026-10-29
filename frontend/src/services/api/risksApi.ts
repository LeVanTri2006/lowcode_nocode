import { getList, apiRequest } from './client';
import type { RiskItem } from '../../types/api';

export const getRisks = (signal?: AbortSignal) =>
  getList<RiskItem>('/api/risks', signal);

export const getRiskById = (id: number, signal?: AbortSignal) =>
  apiRequest<RiskItem>(`/api/risks/${id}`, { signal });
