import { getList } from './client';
import type { AiAnalysis } from '../../types/api';
export const getAiAnalyses = (signal?: AbortSignal) => getList<AiAnalysis>('/api/ai-analyses', signal);
