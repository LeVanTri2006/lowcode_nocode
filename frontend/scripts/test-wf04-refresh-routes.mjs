import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [page, contentsService, performanceService, workflowRunsService, client, backendIndex, performanceRoute, analysesRoute, viteConfig] = await Promise.all([
  readFile(new URL('../src/pages/WF04/WF04Page.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/services/api/socialContentsApi.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/services/api/performanceApi.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/services/api/workflowRunsApi.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/services/api/client.ts', import.meta.url), 'utf8'),
  readFile(new URL('../../backend/src/index.ts', import.meta.url), 'utf8'),
  readFile(new URL('../../backend/src/routes/performance-data.ts', import.meta.url), 'utf8'),
  readFile(new URL('../../backend/src/routes/performance-analyses.ts', import.meta.url), 'utf8'),
  readFile(new URL('../vite.config.ts', import.meta.url), 'utf8'),
]);

assert.match(page, /performanceResource\.refresh\(\);\s*analysesResource\.refresh\(\)/);
assert.match(contentsService, /getPerformanceData\s*=\s*\(signal\?: AbortSignal\)\s*=>\s*getList<PerformanceData>\('\/api\/performance-data', signal\)/);
assert.match(performanceService, /getPerformanceAnalyses\s*=\s*\(signal\?: AbortSignal\)\s*=>\s*getList<PerformanceAnalysis>\('\/api\/performance-analyses', signal\)/);
assert.match(workflowRunsService, /requestWf04Run\s*=\s*\(\)\s*=>\s*apiRequest<Wf04RunResult>\('\/api\/workflows\/wf04\/run', \{ method: 'POST' \}\)/);
assert.match(client, /getList\s*=\s*<T>\(path: string, signal\?: AbortSignal\)\s*=>\s*apiRequest<T\[]>\(path, \{ signal \}\)/);
assert.match(client, /method: options\.method \?\? 'GET'/);

for (const [prefix, moduleName, routeSource] of [
  ['/api/performance-data', 'performanceDataRoutes', performanceRoute],
  ['/api/performance-analyses', 'performanceAnalysesRoutes', analysesRoute],
]) {
  assert.ok(backendIndex.includes(`app.use('${prefix}', ${moduleName})`), `Backend mount missing for ${prefix}`);
  assert.match(routeSource, /router\.get\('\/'/);
}

assert.match(viteConfig, /'\/api':\s*\{\s*target:\s*'http:\/\/127\.0\.0\.1:3000'/);
assert.doesNotMatch(viteConfig, /rewrite\s*:/);

console.log('PASS WF04 refresh route contract: GET /api/performance-data and GET /api/performance-analyses match Express mounts and Vite preserves /api path');
