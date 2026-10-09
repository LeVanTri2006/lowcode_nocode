const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
type ApiEnvelope<T> = { success: boolean; data?: T; message?: string; service?: string };

export class ApiError extends Error {
  readonly status?: number;
  constructor(message: string, status?: number) { super(message); this.name = 'ApiError'; this.status = status; }
}

export async function apiRequest<T>(path: string, options: { method?: 'GET' | 'POST'; body?: unknown; signal?: AbortSignal; timeoutMs?: number } = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), options.timeoutMs ?? 12000);
  const onAbort = () => controller.abort();
  options.signal?.addEventListener('abort', onAbort, { once: true });
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET', signal: controller.signal,
      credentials: 'same-origin',
      headers: options.body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });
    let payload: ApiEnvelope<T>;
    try { payload = await response.json() as ApiEnvelope<T>; }
    catch { throw new ApiError(`Backend returned an unreadable response (HTTP ${response.status}).`, response.status); }
    if (!response.ok || payload.success !== true) {
      const message = payload.message || `Request failed (HTTP ${response.status}).`;
      throw new ApiError(response.status === 400 ? `Dữ liệu không hợp lệ: ${message}` : response.status === 404 ? `Không tìm thấy: ${message}` : response.status === 409 ? `Dữ liệu đã tồn tại: ${message}` : message, response.status);
    }
    // /health currently returns `{ success, service }`; collection endpoints return `{ success, data }`.
    if ('data' in payload) return payload.data as T;
    if (path === '/health') return payload as T;
    throw new ApiError('Backend response is missing data.');
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (options.signal?.aborted) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') throw new ApiError('Kết nối Backend quá thời gian chờ.');
    throw new ApiError('Không thể kết nối Backend. Hãy kiểm tra dịch vụ và thử lại.');
  } finally {
    window.clearTimeout(timeout);
    options.signal?.removeEventListener('abort', onAbort);
  }
}

export const getList = <T>(path: string, signal?: AbortSignal) => apiRequest<T[]>(path, { signal });
