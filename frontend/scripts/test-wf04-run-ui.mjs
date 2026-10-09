import assert from 'node:assert/strict';
import { createInFlightLock, executeWf04Run, formatVietnameseDate, getAnalysisTimestamp } from '../src/pages/WF04/wf04RunBehavior.mjs';

const accepted = await executeWf04Run(async () => ({ status: 'accepted' }));
assert.equal(accepted.status, 'accepted');
assert.match(accepted.message, /đã tiếp nhận/);
assert.doesNotMatch(accepted.message, /hoàn tất$/);

const noWork = await executeWf04Run(async () => ({ status: 'no_work' }));
assert.equal(noWork.status, 'no_work');
assert.match(noWork.message, /Chưa có dữ liệu đủ điều kiện/);

for (const [status, expected] of [
  [401, /Phiên đăng nhập đã hết hạn/],
  [403, /không có quyền vận hành WF04/],
  [503, /chưa được cấu hình đầy đủ/],
  [502, /kiểm tra trạng thái WF04 trước khi thử lại/],
  [504, /quá thời gian chờ/],
]) {
  const outcome = await executeWf04Run(async () => { throw Object.assign(new Error('mock response'), { status }); });
  assert.equal(outcome.status, 'error');
  assert.equal(outcome.httpStatus, status);
  assert.match(outcome.message, expected);
}

const networkError = await executeWf04Run(async () => { throw new Error('mock network failure'); });
assert.equal(networkError.status, 'error');
assert.match(networkError.message, /Mất kết nối/);
assert.match(networkError.message, /kiểm tra trạng thái trước khi thử lại/);

const upstream404 = await executeWf04Run(async () => { throw Object.assign(new Error('Webhook WF04 trả về lỗi HTTP 404.'), { status: 502 }); });
assert.equal(upstream404.status, 'error');
assert.match(upstream404.message, /Backend đã nhận yêu cầu nhưng Webhook WF04 trên n8n trả HTTP 404/);

const otherError = await executeWf04Run(async () => { throw Object.assign(new Error('Lỗi máy chủ'), { status: 500 }); });
assert.match(otherError.message, /Backend gặp lỗi \(HTTP 500\)/);

let resolveRequest;
let apiCalls = 0;
const requestPending = new Promise((resolve) => { resolveRequest = resolve; });
const lock = createInFlightLock();
const click = async () => {
  if (!lock.acquire()) return false;
  apiCalls++;
  try { await requestPending; return true; }
  finally { lock.release(); }
};
const firstClick = click();
const secondClick = click();
assert.equal(apiCalls, 1);
assert.equal(await secondClick, false);
resolveRequest();
assert.equal(await firstClick, true);
assert.equal(await click(), true);
assert.equal(apiCalls, 2);

const newestTimestamp = getAnalysisTimestamp({ createdAt: '2026-10-08T12:46:26.391Z', updatedAt: '2026-10-09T12:30:00.000Z' });
assert.equal(newestTimestamp.label, 'Cập nhật gần nhất');
assert.equal(newestTimestamp.value, '2026-10-09T12:30:00.000Z');
const fallbackTimestamp = getAnalysisTimestamp({ createdAt: '2026-10-08T12:46:26.391Z', updatedAt: null });
assert.equal(fallbackTimestamp.label, 'Ngày tạo (chưa có lịch sử cập nhật)');
assert.equal(fallbackTimestamp.value, '2026-10-08T12:46:26.391Z');
assert.match(formatVietnameseDate('2026-10-09T12:34:56.000Z'), /19:34:56/);

console.log('PASS WF04 UI mock behavior: run states/errors/lock plus update timestamp, createdAt fallback, and UTC-to-Vietnam timezone');
