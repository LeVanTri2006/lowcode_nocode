const assert = require('node:assert/strict');
const { createWf03RunHandler } = require('../dist/routes/workflow-runs.js');
const { requireRole } = require('../dist/auth/session.js');
const { dispatchN8nWebhook, N8nWebhookError } = require('../dist/services/n8nWebhook.js');

const origin = 'http://localhost:5173';
process.env.AUTH_USERNAME = 'test-operator';
process.env.AUTH_PASSWORD_HASH = `scrypt$16384$8$1$${Buffer.alloc(16, 1).toString('base64url')}$${Buffer.alloc(64, 2).toString('base64url')}`;
process.env.AUTH_ROLE = 'operator';
process.env.SESSION_SECRET = 'test-session-secret-that-is-long-enough-123';
process.env.AUTH_ALLOWED_ORIGINS = origin;

function request(role = 'operator', requestOrigin = origin, body = undefined) {
  return {
    session: { authUser: role ? { username: 'test-operator', role } : undefined },
    get: (name) => name.toLowerCase() === 'origin' ? requestOrigin : undefined,
    body,
  };
}

function response() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}

async function invoke(handler, role = 'operator', requestOrigin = origin, body) {
  const res = response();
  await handler(request(role, requestOrigin, body), res);
  return res;
}

async function expectWebhookError(promise, code) {
  await assert.rejects(promise, (error) => error instanceof N8nWebhookError && error.code === code);
}

async function main() {
  let allowed = false;
  const unauthenticated = response();
  requireRole('operator')(request(null), unauthenticated, () => { allowed = true; });
  assert.equal(unauthenticated.statusCode, 401);
  const viewer = response();
  requireRole('operator')(request('viewer'), viewer, () => { allowed = true; });
  assert.equal(viewer.statusCode, 403);
  assert.equal(allowed, false);

  let dispatchCount = 0;
  const noWork = await invoke(createWf03RunHandler({
    countUnanalysed: async () => 0,
    dispatchWebhook: async () => { dispatchCount++; },
  }));
  assert.equal(noWork.statusCode, 200);
  assert.deepEqual(noWork.body.data, { status: 'no_work', pendingCount: 0 });
  assert.equal(noWork.body.message, 'Không có nội dung mới cần phân tích AI.');
  assert.equal(dispatchCount, 0);

  const badOrigin = await invoke(createWf03RunHandler({ countUnanalysed: async () => 2 }), 'operator', 'https://untrusted.example');
  assert.equal(badOrigin.statusCode, 403);

  process.env.N8N_WF03_WEBHOOK_URL = 'https://n8n-mock.example/webhook/wf03/analyze';
  process.env.N8N_WF03_WEBHOOK_TOKEN = '';
  let missingConfigDispatches = 0;
  const missingToken = await invoke(createWf03RunHandler({
    countUnanalysed: async () => 1,
    dispatchWebhook: async () => { missingConfigDispatches++; },
  }));
  assert.equal(missingToken.statusCode, 503);
  assert.equal(missingConfigDispatches, 0);

  const mockRequests = [];
  process.env.N8N_WF03_WEBHOOK_TOKEN = 'mock-wf03-token';
  const acceptedHandler = createWf03RunHandler({
    countUnanalysed: async () => 3,
    dispatchWebhook: (url, token) => dispatchN8nWebhook('WF03', url, token, {
      fetchImpl: async (target, options) => {
        mockRequests.push({ target: String(target), options });
        return new Response(null, { status: 200 });
      },
    }),
  });
  const accepted = await invoke(acceptedHandler, 'operator', origin, { webhookUrl: 'https://attacker.invalid', token: 'frontend-token' });
  assert.equal(accepted.statusCode, 202);
  assert.deepEqual(accepted.body.data, { status: 'accepted', pendingCount: 3 });
  assert.match(accepted.body.message, /Chưa xác nhận WF03 đã hoàn tất/);
  assert.equal(mockRequests.length, 1);
  assert.equal(mockRequests[0].target, process.env.N8N_WF03_WEBHOOK_URL);
  assert.equal(mockRequests[0].options.method, 'POST');
  assert.equal(mockRequests[0].options.headers['x-workflow-token'], process.env.N8N_WF03_WEBHOOK_TOKEN);

  let releaseCount;
  let signalStarted;
  const started = new Promise((resolve) => { signalStarted = resolve; });
  const pendingCount = new Promise((resolve) => { releaseCount = resolve; });
  let duplicateDispatches = 0;
  const guardedHandler = createWf03RunHandler({
    countUnanalysed: () => { signalStarted(); return pendingCount; },
    dispatchWebhook: async () => { duplicateDispatches++; },
    now: () => 1000,
  });
  const firstRequest = invoke(guardedHandler);
  await started;
  const concurrent = await invoke(guardedHandler);
  assert.equal(concurrent.statusCode, 409);
  releaseCount(2);
  assert.equal((await firstRequest).statusCode, 202);
  const cooldown = await invoke(guardedHandler);
  assert.equal(cooldown.statusCode, 429);
  assert.equal(duplicateDispatches, 1);

  await expectWebhookError(dispatchN8nWebhook('WF03', 'https://n8n-mock.example/hook', 'mock-token', { fetchImpl: async () => new Response(null, { status: 401 }) }), 'WF03_WEBHOOK_AUTH_REJECTED');
  await expectWebhookError(dispatchN8nWebhook('WF03', 'https://n8n-mock.example/hook', 'mock-token', { fetchImpl: async () => new Response(null, { status: 503 }) }), 'WF03_WEBHOOK_HTTP_ERROR');
  await expectWebhookError(dispatchN8nWebhook('WF03', 'https://n8n-mock.example/hook', 'mock-token', { fetchImpl: async () => { throw new TypeError('mock connection failure'); } }), 'WF03_WEBHOOK_CONNECTION_ERROR');
  await expectWebhookError(dispatchN8nWebhook('WF03', 'https://n8n-mock.example/hook', 'mock-token', {
    timeoutMs: 15,
    fetchImpl: (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true })),
  }), 'WF03_WEBHOOK_TIMEOUT');

  console.log('PASS WF03 auth/role/Origin, no_work, missing config, single mocked POST/header/accepted-only response, duplicate/cooldown, HTTP/auth/connection/timeout; no production webhook called');
}

main().catch((error) => {
  console.error('FAIL WF03 webhook tests:', error.message);
  process.exitCode = 1;
});
