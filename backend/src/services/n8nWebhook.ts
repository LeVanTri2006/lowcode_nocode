export type N8nWorkflowCode = 'WF01' | 'WF03';
export type N8nWebhookFailure = 'NOT_CONFIGURED' | 'AUTH_REJECTED' | 'HTTP_ERROR' | 'TIMEOUT' | 'CONNECTION_ERROR';

export class N8nWebhookError extends Error {
  readonly code: `${N8nWorkflowCode}_WEBHOOK_${N8nWebhookFailure}`;

  constructor(readonly workflowCode: N8nWorkflowCode, readonly failure: N8nWebhookFailure, readonly status: number, message: string) {
    super(message);
    this.name = 'N8nWebhookError';
    this.code = `${workflowCode}_WEBHOOK_${failure}`;
  }
}

export function validateN8nWebhookConfig(workflowCode: N8nWorkflowCode, configuredUrl?: string, configuredToken?: string) {
  let url: URL;
  try {
    url = new URL(configuredUrl?.trim() || '');
  } catch {
    throw new N8nWebhookError(workflowCode, 'NOT_CONFIGURED', 503, `Webhook ${workflowCode} chưa được cấu hình hợp lệ trên máy chủ.`);
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.hash || !configuredToken?.trim()) {
    throw new N8nWebhookError(workflowCode, 'NOT_CONFIGURED', 503, `Webhook ${workflowCode} chưa được cấu hình hợp lệ trên máy chủ.`);
  }
  return { url, token: configuredToken.trim() };
}

export async function dispatchN8nWebhook(
  workflowCode: N8nWorkflowCode,
  configuredUrl: string | undefined,
  configuredToken: string | undefined,
  { timeoutMs = 10_000, fetchImpl = fetch }: { timeoutMs?: number; fetchImpl?: typeof fetch } = {},
) {
  const { url, token } = validateN8nWebhookConfig(workflowCode, configuredUrl, configuredToken);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'x-workflow-token': token },
      signal: controller.signal,
      redirect: 'manual',
      cache: 'no-store',
    });
    if (response.status === 401 || response.status === 403) {
      throw new N8nWebhookError(workflowCode, 'AUTH_REJECTED', 502, `n8n từ chối xác thực Webhook ${workflowCode}. Hãy kiểm tra cấu hình xác thực ở máy chủ.`);
    }
    if (!response.ok) {
      throw new N8nWebhookError(workflowCode, 'HTTP_ERROR', 502, `Webhook ${workflowCode} trả về lỗi HTTP ${response.status}.`);
    }
  } catch (error) {
    if (error instanceof N8nWebhookError) throw error;
    if (controller.signal.aborted) {
      throw new N8nWebhookError(workflowCode, 'TIMEOUT', 504, `Webhook ${workflowCode} phản hồi quá thời gian chờ. Chưa xác nhận yêu cầu đã được tiếp nhận.`);
    }
    throw new N8nWebhookError(workflowCode, 'CONNECTION_ERROR', 502, `Không thể kết nối tới Webhook ${workflowCode}. Chưa xác nhận yêu cầu đã được tiếp nhận.`);
  } finally {
    clearTimeout(timeout);
  }
}
