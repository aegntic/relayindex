import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

function evaluateExecutability(record) {
  if (record.status === 'deleted' || record.status === 'deprecated') {
    return 'catalogued';
  }
  const hasRoute = (record.packages && record.packages.length > 0) || (record.remotes && record.remotes.length > 0);
  if (!hasRoute) return 'catalogued';
  if (record.repository && record.repository.startsWith('https://github.com')) return 'route_resolved';
  return 'route_declared';
}

function processRegistryDelta(records) {
  return records.map(record => {
    const tombstone = record.status === 'deleted';
    const executability_state = evaluateExecutability(record);
    const hash = crypto.createHash('sha256').update(JSON.stringify(record)).digest('hex');
    return {
      id: record.id,
      namespace: record.namespace,
      name: record.name,
      version: record.version,
      status: record.status,
      executability_state,
      tombstone,
      record_sha256: hash,
      synced_at: new Date().toISOString()
    };
  });
}

function filterDeltaByCursor(ledger, cursor, limit = 50) {
  let startIdx = 0;
  if (cursor) {
    const found = ledger.findIndex(e => e.id === cursor);
    if (found !== -1) startIdx = found + 1;
  }
  const slice = ledger.slice(startIdx, startIdx + limit);
  const nextCursor = (startIdx + limit < ledger.length) ? slice[slice.length - 1].id : null;
  return { records: slice, nextCursor };
}

test('Delta Engine - Evaluates active server with packages and repo to route_resolved', () => {
  const records = [{
    id: 'io.relay/weather',
    namespace: 'io.relay',
    name: 'weather',
    version: '1.0.0',
    status: 'active',
    repository: 'https://github.com/relay/weather',
    packages: ['npm:@relay/weather@1.0.0']
  }];
  const entries = processRegistryDelta(records);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].executability_state, 'route_resolved');
  assert.equal(entries[0].tombstone, false);
  assert.match(entries[0].record_sha256, /^[a-f0-9]{64}$/);
});

test('Delta Engine - Correctly sets tombstone and catalogued state on deleted server', () => {
  const records = [{
    id: 'io.relay/stale-tool',
    namespace: 'io.relay',
    name: 'stale-tool',
    version: '0.9.0',
    status: 'deleted',
    repository: 'https://github.com/relay/stale'
  }];
  const entries = processRegistryDelta(records);
  assert.equal(entries[0].tombstone, true);
  assert.equal(entries[0].status, 'deleted');
  assert.equal(entries[0].executability_state, 'catalogued');
});

test('Delta Engine - Cursoring partitions records across pages without loss', () => {
  const records = Array.from({ length: 5 }, (_, i) => ({
    id: `server-${i}`,
    namespace: 'test',
    name: `srv-${i}`,
    version: '1.0.0',
    status: 'active'
  }));
  const entries = processRegistryDelta(records);
  const p1 = filterDeltaByCursor(entries, null, 2);
  assert.equal(p1.records.length, 2);
  assert.equal(p1.records[0].id, 'server-0');
  assert.equal(p1.nextCursor, 'server-1');

  const p2 = filterDeltaByCursor(entries, p1.nextCursor, 2);
  assert.equal(p2.records.length, 2);
  assert.equal(p2.records[0].id, 'server-2');
  assert.equal(p2.nextCursor, 'server-3');

  const p3 = filterDeltaByCursor(entries, p2.nextCursor, 2);
  assert.equal(p3.records.length, 1);
  assert.equal(p3.records[0].id, 'server-4');
  assert.equal(p3.nextCursor, null);
});
