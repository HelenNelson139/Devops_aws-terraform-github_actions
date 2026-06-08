const { requireAdmin } = require('../src/adminAuth');

function createResponse() {
  return {
    statusCode: null,
    headers: {},
    body: null,
    set(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

describe('admin auth', () => {
  const originalUsername = process.env.ADMIN_USERNAME;
  const originalPassword = process.env.ADMIN_PASSWORD;

  beforeEach(() => {
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'admin123';
  });

  afterAll(() => {
    process.env.ADMIN_USERNAME = originalUsername;
    process.env.ADMIN_PASSWORD = originalPassword;
  });

  test('rejects missing authorization header', () => {
    const req = { headers: {} };
    const res = createResponse();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('accepts valid admin credentials', () => {
    const token = Buffer.from('admin:admin123').toString('base64');
    const req = { headers: { authorization: `Basic ${token}` } };
    const res = createResponse();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
