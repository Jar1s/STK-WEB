import test from 'node:test';
import assert from 'node:assert/strict';

import { getNotifications, getPartners, getStatistics } from '../lib/kv.js';
import healthHandler from '../api/health.js';
import notificationsHandler from '../api/notifications.js';
import statisticsHandler from '../api/statistics.js';

function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    end(data) {
      this.body = data ?? this.body;
      return this;
    }
  };
}

test('kv helpers return safe defaults without Supabase', async () => {
  const notifications = await getNotifications();
  const partners = await getPartners();
  const stats = await getStatistics();

  assert.deepEqual(notifications, { notifications: [] });
  assert.deepEqual(partners, { partners: [] });
  assert.equal(stats.performedInspections, 15000);
  assert.equal(stats.yearsExperienceStart, 2014);
  assert.equal(stats.satisfactionPercentage, 98);
  assert.equal(stats.googlePlaceId, null);
});

test('health handler responds even when env is missing', async () => {
  const res = mockRes();
  await healthHandler({ headers: {} }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.equal(res.body.status, 'ok');
  assert.equal(res.body.supabase.initialized, false);
  assert.equal(res.body.supabase.serviceRole, false);
  assert.equal(res.body.supabase.env.url, 'missing');
});

test('notifications GET returns empty list by default', async () => {
  const res = mockRes();
  await notificationsHandler({ method: 'GET', headers: {}, url: '/api/notifications' }, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { notifications: [] });
});

test('statistics GET returns default statistics', async () => {
  const res = mockRes();
  await statisticsHandler({ method: 'GET', headers: {}, url: '/api/statistics' }, res);

  const expectedYears = Math.max(0, new Date().getFullYear() - 2014);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.performedInspections, 15000);
  assert.equal(res.body.yearsExperienceStart, 2014);
  assert.equal(res.body.satisfactionPercentage, 98);
  assert.equal(res.body.googlePlaceId, null);
  assert.equal(res.body.yearsExperience, expectedYears);
});
