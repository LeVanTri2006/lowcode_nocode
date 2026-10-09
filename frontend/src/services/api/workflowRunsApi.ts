import { apiRequest } from './client';

export interface Wf03RunResult {
  status: 'no_work' | 'accepted';
  pendingCount: number;
}

export const requestWf03Run = () =>
  apiRequest<Wf03RunResult>('/api/workflows/wf03/run', { method: 'POST' });
