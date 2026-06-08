const request = require('supertest');
const createApp = require('../src/app');
const { buildPositiveMessage, normalizeName } = require('../src/messages');

describe('message-service', () => {
  test('normalizes empty names', () => {
    expect(normalizeName('   ')).toBe('bạn');
  });

  test('builds a positive message with the user name', () => {
    expect(buildPositiveMessage('An', 'hôm nay cậu đã rất cố gắng.')).toBe(
      'An, hôm nay cậu đã rất cố gắng.'
    );
  });

  test('returns health status', async () => {
    const app = createApp();
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.service).toBe('message-service');
  });

  test('returns positive message from API', async () => {
    const app = createApp({
      getRandomPositiveMessage: async () => 'cậu xứng đáng với những điều dịu dàng.'
    });
    const response = await request(app).get('/api/messages?name=An');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('An, cậu xứng đáng với những điều dịu dàng.');
  });
});
