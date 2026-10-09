import { dispatchN8nWebhook, N8nWebhookError } from './n8nWebhook';

export type Wf01WebhookErrorCode =
  | 'WF01_WEBHOOK_NOT_CONFIGURED'
  | 'WF01_WEBHOOK_AUTH_REJECTED'
  | 'WF01_WEBHOOK_HTTP_ERROR'
  | 'WF01_WEBHOOK_TIMEOUT'
  | 'WF01_WEBHOOK_CONNECTION_ERROR';

export class Wf01WebhookError extends Error {
  constructor(readonly code: Wf01WebhookErrorCode, readonly status: number, message: string) {
    super(message);
    this.name = 'Wf01WebhookError';
  }
}

export async function dispatchWf01Webhook(
  configuredUrl: string | undefined,
  configuredToken: string | undefined,
  options: { timeoutMs?: number; fetchImpl?: typeof fetch } = {},
) {
  try {
    await dispatchN8nWebhook('WF01', configuredUrl, configuredToken, options);
  } catch (error) {
    if (error instanceof N8nWebhookError) {
      throw new Wf01WebhookError(error.code as Wf01WebhookErrorCode, error.status, error.message);
    }
    throw error;
  }
}
