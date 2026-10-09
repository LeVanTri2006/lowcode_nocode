import { apiRequest } from './client';

export interface Wf03RunResult {
  status: 'no_work' | 'accepted';
  pendingCount: number;
}

export const requestWf03Run = () =>
  apiRequest<Wf03RunResult>('/api/workflows/wf03/run', { method: 'POST' });

export interface Wf04RunResult {
  status: 'no_work' | 'accepted';
  eligibleCount: number;
}

export const requestWf04Run = () =>
  apiRequest<Wf04RunResult>('/api/workflows/wf04/run', { method: 'POST' });
