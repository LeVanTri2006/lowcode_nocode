import { Router, type Request, type RequestHandler, type Response } from 'express';
import { getAllowedOrigins, getAuthConfig, hasTrustedOrigin } from '../auth/config';
import { requireRole } from '../auth/session';
import { dispatchWf01Webhook, Wf01WebhookError } from '../services/wf01Webhook';
import { dispatchN8nWebhook, N8nWebhookError, validateN8nWebhookConfig } from '../services/n8nWebhook';
import { prisma } from '../prisma/client';

type DispatchWebhook = typeof dispatchWf01Webhook;
type DispatchConfiguredWebhook = (url: string, token: string) => Promise<void>;

export function createWorkflowRunHandler(dispatchWebhook: DispatchWebhook = dispatchWf01Webhook): RequestHandler {
  return async (req: Request, res: Response) => {
    if (!hasTrustedOrigin(req.get('origin'), getAllowedOrigins())) {
      res.status(403).json({ success: false, code: 'ORIGIN_NOT_ALLOWED', message: 'Nguồn yêu cầu không được phép.' });
      return;
    }
    if (!getAuthConfig()) {
      res.status(503).json({ success: false, code: 'AUTH_NOT_CONFIGURED', message: 'Đăng nhập chưa được cấu hình trên máy chủ.' });
      return;
    }

    try {
      await dispatchWebhook(process.env.N8N_WF01_WEBHOOK_URL, process.env.N8N_WF01_WEBHOOK_TOKEN);
      res.status(202).json({
        success: true,
        data: { status: 'accepted' as const },
        message: 'Đã gửi yêu cầu chạy WF01; Webhook đã tiếp nhận. Chưa xác nhận workflow hoàn tất.',
      });
    } catch (error) {
      if (error instanceof Wf01WebhookError) {
        res.status(error.status).json({ success: false, code: error.code, message: error.message });
        return;
      }
      res.status(502).json({ success: false, code: 'WF01_WEBHOOK_CONNECTION_ERROR', message: 'Không thể gửi yêu cầu tới Webhook WF01.' });
    }
  };
}

export function createWorkflowRunRouter(dispatchWebhook: DispatchWebhook = dispatchWf01Webhook) {
  const router = Router();
  router.post('/wf01/run', requireRole('operator'), createWorkflowRunHandler(dispatchWebhook));
  router.post('/wf03/run', requireRole('operator'), createWf03RunHandler());
  router.post('/wf04/run', requireRole('operator'), createWf04RunHandler());
  return router;
}

export function createWf03RunHandler({
  countUnanalysed = () => prisma.socialContent.count({ where: { aiAnalysis: { is: null } } }),
  dispatchWebhook = (url, token) => dispatchN8nWebhook('WF03', url, token),
  cooldownMs = 30_000,
  now = Date.now,
}: {
  countUnanalysed?: () => Promise<number>;
  dispatchWebhook?: DispatchConfiguredWebhook;
  cooldownMs?: number;
  now?: () => number;
} = {}): RequestHandler {
  const activeOperators = new Set<string>();
  const lastAcceptedAt = new Map<string, number>();

  return async (req: Request, res: Response) => {
    if (!hasTrustedOrigin(req.get('origin'), getAllowedOrigins())) {
      res.status(403).json({ success: false, code: 'ORIGIN_NOT_ALLOWED', message: 'Nguồn yêu cầu không được phép.' });
      return;
    }
    if (!getAuthConfig()) {
      res.status(503).json({ success: false, code: 'AUTH_NOT_CONFIGURED', message: 'Đăng nhập chưa được cấu hình trên máy chủ.' });
      return;
    }

    const username = req.session.authUser?.username;
    if (!username) {
      res.status(401).json({ success: false, code: 'AUTH_REQUIRED', message: 'Vui lòng đăng nhập để tiếp tục.' });
      return;
    }
    const timestamp = now();
    for (const [operator, acceptedAt] of lastAcceptedAt) {
      if (timestamp - acceptedAt >= cooldownMs) lastAcceptedAt.delete(operator);
    }
    if (activeOperators.has(username)) {
      res.status(409).json({ success: false, code: 'WF03_RUN_REQUEST_ACTIVE', message: 'Yêu cầu phân tích WF03 của bạn đang được gửi.' });
      return;
    }
    const acceptedAt = lastAcceptedAt.get(username);
    if (acceptedAt !== undefined && timestamp - acceptedAt < cooldownMs) {
      res.status(429).json({ success: false, code: 'WF03_RUN_COOLDOWN', message: 'WF03 vừa nhận một yêu cầu. Vui lòng đợi trước khi gửi yêu cầu khác.' });
      return;
    }

    activeOperators.add(username);
    try {
      const pendingCount = await countUnanalysed();
      if (pendingCount === 0) {
        res.status(200).json({
          success: true,
          data: { status: 'no_work' as const, pendingCount: 0 },
          message: 'Không có nội dung mới cần phân tích AI.',
        });
        return;
      }

      const configured = validateN8nWebhookConfig('WF03', process.env.N8N_WF03_WEBHOOK_URL, process.env.N8N_WF03_WEBHOOK_TOKEN);
      await dispatchWebhook(configured.url.toString(), configured.token);
      lastAcceptedAt.set(username, now());
      res.status(202).json({
        success: true,
        data: { status: 'accepted' as const, pendingCount },
        message: 'Đã tiếp nhận yêu cầu phân tích. Chưa xác nhận WF03 đã hoàn tất hoặc lưu kết quả.',
      });
    } catch (error) {
      if (error instanceof N8nWebhookError) {
        res.status(error.status).json({ success: false, code: error.code, message: error.message });
        return;
      }
      res.status(500).json({ success: false, code: 'WF03_PENDING_COUNT_FAILED', message: 'Không thể kiểm tra nội dung đang chờ phân tích.' });
    } finally {
      activeOperators.delete(username);
    }
  };
}

export function createWf04RunHandler({
  countEligiblePerformanceData = () => prisma.socialContent.count({ where: { socialMetrics: { some: {} } } }),
  dispatchWebhook = (url, token) => dispatchN8nWebhook('WF04', url, token),
  cooldownMs = 30_000,
  now = Date.now,
}: {
  countEligiblePerformanceData?: () => Promise<number>;
  dispatchWebhook?: DispatchConfiguredWebhook;
  cooldownMs?: number;
  now?: () => number;
} = {}): RequestHandler {
  const activeOperators = new Set<string>();
  const lastAcceptedAt = new Map<string, number>();

  return async (req: Request, res: Response) => {
    if (!hasTrustedOrigin(req.get('origin'), getAllowedOrigins())) {
      res.status(403).json({ success: false, code: 'ORIGIN_NOT_ALLOWED', message: 'Nguồn yêu cầu không được phép.' });
      return;
    }
    if (!getAuthConfig()) {
      res.status(503).json({ success: false, code: 'AUTH_NOT_CONFIGURED', message: 'Đăng nhập chưa được cấu hình trên máy chủ.' });
      return;
    }

    const username = req.session.authUser?.username;
    if (!username) {
      res.status(401).json({ success: false, code: 'AUTH_REQUIRED', message: 'Vui lòng đăng nhập để tiếp tục.' });
      return;
    }
    const timestamp = now();
    for (const [operator, acceptedAt] of lastAcceptedAt) {
      if (timestamp - acceptedAt >= cooldownMs) lastAcceptedAt.delete(operator);
    }
    if (activeOperators.has(username)) {
      res.status(409).json({ success: false, code: 'WF04_RUN_REQUEST_ACTIVE', message: 'Yêu cầu phân tích WF04 của bạn đang được gửi.' });
      return;
    }
    const acceptedAt = lastAcceptedAt.get(username);
    if (acceptedAt !== undefined && timestamp - acceptedAt < cooldownMs) {
      res.status(429).json({ success: false, code: 'WF04_RUN_COOLDOWN', message: 'WF04 vừa nhận một yêu cầu. Vui lòng đợi trước khi gửi yêu cầu khác.' });
      return;
    }

    activeOperators.add(username);
    try {
      const eligibleCount = await countEligiblePerformanceData();
      if (eligibleCount === 0) {
        res.status(200).json({
          success: true,
          data: { status: 'no_work' as const, eligibleCount: 0 },
          message: 'Chưa có nội dung nào được ghi nhận chỉ số để phân tích hiệu suất.',
        });
        return;
      }

      const configured = validateN8nWebhookConfig('WF04', process.env.N8N_WF04_WEBHOOK_URL, process.env.N8N_WF04_WEBHOOK_TOKEN);
      await dispatchWebhook(configured.url.toString(), configured.token);
      lastAcceptedAt.set(username, now());
      res.status(202).json({
        success: true,
        data: { status: 'accepted' as const, eligibleCount },
        message: 'Đã tiếp nhận yêu cầu chạy WF04. Chưa xác nhận workflow đã hoàn tất hoặc lưu kết quả.',
      });
    } catch (error) {
      if (error instanceof N8nWebhookError) {
        res.status(error.status).json({ success: false, code: error.code, message: error.message });
        return;
      }
      res.status(500).json({ success: false, code: 'WF04_INPUT_CHECK_FAILED', message: 'Không thể kiểm tra dữ liệu chỉ số cho WF04.' });
    } finally {
      activeOperators.delete(username);
    }
  };
}

export default createWorkflowRunRouter();
