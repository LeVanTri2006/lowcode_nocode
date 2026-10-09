import { getList } from './client';
import type { PerformanceAnalysis } from '../../types/api';
export const getPerformanceAnalyses = (signal?: AbortSignal) => getList<PerformanceAnalysis>('/api/performance-analyses', signal);
