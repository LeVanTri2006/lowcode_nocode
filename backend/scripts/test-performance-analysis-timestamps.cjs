const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createPerformanceAnalysesRouter } = require('../dist/routes/performance-analyses.js');

const schema = fs.readFileSync(path.join(__dirname, '../prisma/schema.prisma'), 'utf8');
const migration = fs.readFileSync(path.join(__dirname, '../prisma/migrations/20261009131600_add_performance_analysis_updated_at/migration.sql'), 'utf8');
assert.match(schema, /updatedAt\s+DateTime\?\s+@updatedAt\s+@map\("updated_at"\)/);
assert.match(migration, /ADD COLUMN "updated_at" TIMESTAMP\(3\);/);
assert.doesNotMatch(migration, /NOT NULL|DEFAULT/i, 'existing rows must remain unknown rather than receive a false update time');

let saved = null;
let now = new Date('2026-10-09T12:00:00.000Z');
const originalCreatedAt = new Date('2026-10-08T12:46:26.391Z');
const mockDatabase = {
  competitor: { findUnique: async () => ({ id: 7 }) },
  performanceAnalysis: {
    async findMany() { return saved ? [saved] : []; },
    async upsert({ create, update }) {
      if (saved) {
        saved = { ...saved, ...update, updatedAt: new Date(now) };
      } else {
        saved = { id: 9, ...create, createdAt: new Date(now), updatedAt: new Date(now) };
      }
      return saved;
    },
  },
};
const router = createPerformanceAnalysesRouter(mockDatabase);

function response() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}

async function invoke(method, req) {
  const layer = router.stack.find((item) => item.route?.path === '/' && item.route.methods[method]);
  assert.ok(layer, `Expected ${method.toUpperCase()} / route`);
  const res = response();
  await layer.route.stack[0].handle(req, res);
  return res;
}

const body = {
  competitorId: 7,
  platform: 'youtube',
  videoCount: 10,
  totalViews: 100,
  totalLikes: 20,
  totalComments: 5,
  totalEngagement: 25,
  averageViews: 10,
  averageLikes: 2,
  averageComments: 0.5,
  engagementRate: 0.25,
  averageLikeRate: 0.2,
  averageCommentRate: 0.05,
  performanceRank: 1,
};

async function main() {
  const created = await invoke('post', { body });
  assert.equal(created.statusCode, 200);
  assert.ok(created.body.data.createdAt instanceof Date);
  assert.ok(created.body.data.updatedAt instanceof Date);
  assert.equal(created.body.data.createdAt.toISOString(), now.toISOString());
  assert.equal(created.body.data.updatedAt.toISOString(), now.toISOString());

  const createdAt = saved.createdAt.toISOString();
  now = new Date('2026-10-09T13:00:00.000Z');
  const updated = await invoke('post', { body: { ...body, totalViews: 250 } });
  assert.equal(updated.statusCode, 200);
  assert.equal(updated.body.data.createdAt.toISOString(), createdAt);
  assert.equal(updated.body.data.updatedAt.toISOString(), now.toISOString());
  assert.ok(updated.body.data.updatedAt > updated.body.data.createdAt);

  const fetched = await invoke('get', { query: {} });
  assert.equal(fetched.statusCode, 200);
  const serializedResponse = JSON.parse(JSON.stringify(fetched.body));
  assert.equal(serializedResponse.data[0].updatedAt, now.toISOString());
  assert.equal(serializedResponse.data[0].createdAt, createdAt);

  console.log('PASS mocked PerformanceAnalysis create/update/GET timestamps: createdAt preserved, updatedAt advanced and returned; no database used');
}

main().catch((error) => {
  console.error('FAIL PerformanceAnalysis timestamp tests:', error.message);
  process.exitCode = 1;
});
