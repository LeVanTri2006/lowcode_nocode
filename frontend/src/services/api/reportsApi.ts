import { getList, apiRequest } from './client';
import type { ReportItem, StrategyItem } from '../../types/api';

export const getReports = (signal?: AbortSignal) =>
  getList<ReportItem>('/api/reports', signal);

export const getReportById = (id: number, signal?: AbortSignal) =>
  apiRequest<ReportItem>(`/api/reports/${id}`, { signal });

export const getStrategies = (signal?: AbortSignal) =>
  getList<StrategyItem>('/api/strategies', signal);
