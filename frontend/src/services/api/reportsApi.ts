import { getList } from './client';
import type { ReportItem, StrategyItem } from '../../types/api';

export const getReports = (signal?: AbortSignal) =>
  getList<ReportItem>('/api/reports', signal);

export const getStrategies = (signal?: AbortSignal) =>
  getList<StrategyItem>('/api/strategies', signal);
