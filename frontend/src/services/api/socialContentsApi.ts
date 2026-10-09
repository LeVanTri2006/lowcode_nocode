import { getList } from './client';
import type { PerformanceData, SocialContent } from '../../types/api';
export const getSocialContents = (signal?: AbortSignal) => getList<SocialContent>('/api/social-contents', signal);
export const getPerformanceData = (signal?: AbortSignal) => getList<PerformanceData>('/api/performance-data', signal);
