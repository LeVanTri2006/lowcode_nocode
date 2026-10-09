import { apiRequest } from './client';
export const getHealth = (signal?: AbortSignal) => apiRequest<{ success: true; service: string }>('/health', { signal });
