const assert = require('node:assert/strict');
const { createWorkflowRunHandler } = require('../dist/routes/workflow-runs.js');
const { requireRole } = require('../dist/auth/session.js');
const { dispatchWf01Webhook, Wf01WebhookError } = require('../dist/services/wf01Webhook.js');

const allowedOrigin = 'http://localhost:5173';
process.env.AUTH_USERNAME = 'test-operator';
process.env.AUTH_PASSWORD_HASH = `scrypt$16384$8$1$${Buffer.alloc(16, 1).toString('base64url')}$${Buffer.alloc(64, 2).toString('base64url')}`;
process.env.AUTH_ROLE = 'operator';
process.env.SESSION_SECRET = 'test-session-secret-that-is-long-enough-123';
process.env.AUTH_ALLOWED_ORIGINS = allowedOrigin;

function createRequest(role, origin, body) {
  return {
    session: { authUser: role ? { username: 'test', role } : undefined },
    get: (name) => name.toLowerCase() === 'origin' ? origin : undefined,
    body,
  };
}

function createResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}

async function runHandler(handler, role, origin, body) {
  const req = createRequest(role, origin, body);
  const res = createResponse();
  await handler(req, res);
  return res;
}

async function expectCode(promise, code) {
  await assert.rejects(promise, (error) => error instanceof Wf01WebhookError && error.code === code);
}

async function main() {
  let dispatchCalls = 0;
  process.env.N8N_WF01_WEBHOOK_URL = 'https://n8n-mock.example/wf01/collect';
  process.env.N8N_WF01_WEBHOOK_TOKEN = 'test-token-only';
  let dispatchArgs;
  const dispatch = async (url, token) => {
    dispatchCalls++;
    dispatchArgs = { url, token };
    assert.equal(url, process.env.N8N_WF01_WEBHOOK_URL);
    assert.equal(token, process.env.N8N_WF01_WEBHOOK_TOKEN);
  };

  const noSessionRes = createResponse();
  let passedAuthorization = false;
  requireRole('operator')(createRequest(null, allowedOrigin), noSessionRes, () => { passedAuthorization = true; });
  assert.equal(noSessionRes.statusCode, 401);
  assert.equal(passedAuthorization, false);
  const viewerRes = createResponse();
  requireRole('operator')(createRequest('viewer', allowedOrigin), viewerRes, () => { passedAuthorization = true; });
  assert.equal(viewerRes.statusCode, 403);
  assert.equal(passedAuthorization, false);

  const handler = createWorkflowRunHandler(dispatch);
  const badOrigin = await runHandler(handler, 'operator', 'https://untrusted.example');
  assert.equal(badOrigin.statusCode, 403);
  assert.equal(dispatchCalls, 0);
  const accepted = await runHandler(handler, 'operator', allowedOrigin, { webhookUrl: 'https://attacker.invalid/trigger', token: 'untrusted' });
  assert.equal(accepted.statusCode, 202);
  assert.equal(accepted.body.data.status, 'accepted');
  assert.deepEqual(dispatchArgs, { url: process.env.N8N_WF01_WEBHOOK_URL, token: process.env.N8N_WF01_WEBHOOK_TOKEN });
  assert.equal(dispatchCalls, 1);

  process.env.N8N_WF01_WEBHOOK_URL = '';
  process.env.N8N_WF01_WEBHOOK_TOKEN = '';
  const missingConfig = await runHandler(createWorkflowRunHandler(), 'operator', allowedOrigin);
  assert.equal(missingConfig.statusCode, 503);
  assert.equal(missingConfig.body.code, 'WF01_WEBHOOK_NOT_CONFIGURED');

  const timeoutHandler = createWorkflowRunHandler(async () => { throw new Wf01WebhookError('WF01_WEBHOOK_TIMEOUT', 504, 'Timed out'); });
  const timedOut = await runHandler(timeoutHandler, 'operator', allowedOrigin);
  assert.equal(timedOut.statusCode, 504);

  const calls = [];
  await dispatchWf01Webhook('https://n8n-mock.example/wf01/collect', 'mock-token', {
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return new Response(null, { status: 200 });
    },
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.headers['x-workflow-token'], 'mock-token');

  await expectCode(dispatchWf01Webhook('https://n8n-mock.example', 'mock-token', { fetchImpl: async () => new Response(null, { status: 401 }) }), 'WF01_WEBHOOK_AUTH_REJECTED');
  await expectCode(dispatchWf01Webhook('https://n8n-mock.example', 'mock-token', { fetchImpl: async () => new Response(null, { status: 503 }) }), 'WF01_WEBHOOK_HTTP_ERROR');
  await expectCode(dispatchWf01Webhook('https://n8n-mock.example', 'mock-token', { fetchImpl: async () => { throw new TypeError('mock connection failure'); } }), 'WF01_WEBHOOK_CONNECTION_ERROR');
  await expectCode(dispatchWf01Webhook('https://n8n-mock.example', 'mock-token', {
    timeoutMs: 15,
    fetchImpl: (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true })),
  }), 'WF01_WEBHOOK_TIMEOUT');

  console.log('PASS workflow route auth/role/origin, env-only target, accepted status, missing config, HTTP/auth/connection/timeout mock cases; no production webhook called');
}

main().catch((error) => {
  console.error('FAIL WF01 webhook tests:', error.message);
  process.exitCode = 1;
});
