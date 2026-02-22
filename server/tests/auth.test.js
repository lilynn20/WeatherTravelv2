/**
 * Basic smoke tests for auth endpoints.
 * Run with: npm test (after adding jest + supertest to devDependencies)
 * 
 * Install: npm install --save-dev jest supertest
 */
const request = require('supertest');
// NOTE: Tests require a running MongoDB. Set TEST_MONGO_URI env var.

describe('Auth API', () => {
  let app;

  beforeAll(() => {
    process.env.MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/weathertravel_test';
    process.env.JWT_SECRET = 'test_secret_key_for_testing_only';
    process.env.NODE_ENV = 'test';
    app = require('../index');
  });

  const testEmail = `test_${Date.now()}@example.com`;

  it('POST /api/auth/register — creates a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: testEmail, password: 'Password123', name: 'Test User',
    });
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
  });

  it('POST /api/auth/login — logs in with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail, password: 'Password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
  });

  it('POST /api/auth/login — rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail, password: 'WrongPassword',
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/register — rejects missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'bad' });
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/forgot-password — always returns 200 (no enumeration)', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'nonexistent@x.com' });
    expect(res.status).toBe(200);
  });
});
