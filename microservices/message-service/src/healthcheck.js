const http = require('http');

const port = Number(process.env.PORT || 3001);
const req = http.request({ host: '127.0.0.1', port, path: '/health', timeout: 2000 }, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on('error', () => process.exit(1));
req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});
req.end();
