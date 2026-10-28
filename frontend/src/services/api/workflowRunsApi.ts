import { apiRequest } from './client';

export interface WorkflowRunResult {
  status: 'accepted' | 'no_work';
}

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

export const requestWf06Run = () =>
  apiRequest<WorkflowRunResult>('/api/workflows/wf06/run', { method: 'POST' });

export const requestWf07Run = () =>
  apiRequest<WorkflowRunResult>('/api/workflows/wf07/run', { method: 'POST' });

export const requestWf08Run = () =>
  apiRequest<WorkflowRunResult>('/api/workflows/wf08/run', { method: 'POST' });

export const requestWf09Run = () =>
  apiRequest<WorkflowRunResult>('/api/workflows/wf09/run', { method: 'POST' });

export const requestWf10Run = () =>
  apiRequest<WorkflowRunResult>('/api/workflows/wf10/run', { method: 'POST' });
