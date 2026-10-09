import { apiRequest, getList } from './client';
import type { Competitor, CompetitorCreate } from '../../types/api';
export const getCompetitors = (platform: string | undefined = 'youtube', signal?: AbortSignal) =>
  getList<Competitor>(platform ? `/api/competitors?platform=${encodeURIComponent(platform)}` : '/api/competitors', signal);
export const createCompetitor = (input: CompetitorCreate, signal?: AbortSignal) => apiRequest<Competitor>('/api/competitors', { method: 'POST', body: input, signal });
