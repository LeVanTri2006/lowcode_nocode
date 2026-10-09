import { getList } from './client';
import type { SocialMetric } from '../../types/api';
export const getSocialMetrics = (signal?: AbortSignal) => getList<SocialMetric>('/api/social-metrics', signal);
