import { getList, apiRequest } from './client';
import type { OpportunityItem } from '../../types/api';

export const getOpportunities = (signal?: AbortSignal) =>
  getList<OpportunityItem>('/api/opportunities', signal);

export const getOpportunityById = (id: number, signal?: AbortSignal) =>
  apiRequest<OpportunityItem>(`/api/opportunities/${id}`, { signal });
