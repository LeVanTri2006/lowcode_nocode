const assert = require('node:assert/strict');
const { createUnanalysedContentsHandler } = require('../dist/routes/social-contents.js');

async function main() {
  let queryArgs;
  const handler = createUnanalysedContentsHandler(async (args) => {
    queryArgs = args;
    return [];
  });
  const response = {
    statusCode: 200,
    payload: undefined,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };

  await handler({}, response);
  assert.deepEqual(queryArgs, { where: { aiAnalysis: { is: null } }, orderBy: { id: 'asc' } });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, { success: true, data: [] });
  console.log('PASS empty relation-filtered result returns HTTP 200 with data: []');
}

main().catch((error) => {
  console.error('FAIL unanalysed contents tests:', error.message);
  process.exitCode = 1;
});
