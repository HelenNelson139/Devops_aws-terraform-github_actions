function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm="Mood Journal Admin"');
  return res.status(401).json({ message: 'Yêu cầu đăng nhập admin.' });
}

function requireAdmin(req, res, next) {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Basic' || !token) {
    return unauthorized(res);
  }

  const credentials = Buffer.from(token, 'base64').toString('utf8');
  const separatorIndex = credentials.indexOf(':');
  if (separatorIndex === -1) {
    return unauthorized(res);
  }

  const username = credentials.slice(0, separatorIndex);
  const password = credentials.slice(separatorIndex + 1);

  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (username !== expectedUsername || password !== expectedPassword) {
    return unauthorized(res);
  }

  return next();
}

module.exports = {
  requireAdmin
};
