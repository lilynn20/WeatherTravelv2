/**
 * Smoke tests for trip endpoints (requires auth token via cookie).
 */
const request = require('supertest');

describe('Trips API', () => {
  let app;
  let agent; // Keeps cookies between requests

  beforeAll(async () => {
    process.env.MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/weathertravel_test';
    process.env.JWT_SECRET = 'test_secret_key_for_testing_only';
    process.env.NODE_ENV = 'test';
    app = require('../index');

    agent = request.agent(app);
    // Register and login to get session cookie
    await agent.post('/api/auth/register').send({
      email: `trips_test_${Date.now()}@example.com`, password: 'Password123', name: 'Trip Tester',
    });
  });

  let tripId;

  it('POST /api/trips — creates a trip', async () => {
    const res = await agent.post('/api/trips').send({
      title: 'Summer Europe 2026',
      legs: [{ city: 'Paris', startDate: '2026-07-01', endDate: '2026-07-07' }],
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Summer Europe 2026');
    tripId = res.body._id;
  });

  it('GET /api/trips — lists user trips', async () => {
    const res = await agent.get('/api/trips');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('PUT /api/trips/:id — updates a trip', async () => {
    const res = await agent.put(`/api/trips/${tripId}`).send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('POST /api/trips/:id/share — creates a share token', async () => {
    const res = await agent.post(`/api/trips/${tripId}/share`);
    expect(res.status).toBe(200);
    expect(res.body.shareToken).toBeDefined();
  });

  it('DELETE /api/trips/:id — deletes a trip', async () => {
    const res = await agent.delete(`/api/trips/${tripId}`);
    expect(res.status).toBe(200);
  });

  it('GET /api/trips — returns 401 without auth', async () => {
    const res = await request(app).get('/api/trips');
    expect(res.status).toBe(401);
  });
});
