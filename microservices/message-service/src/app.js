const express = require('express');
const { getRandomPositiveMessage } = require('./database');
const { buildPositiveMessage } = require('./messages');

function createApp(dependencies = {}) {
  const app = express();
  const loadMessage = dependencies.getRandomPositiveMessage || getRandomPositiveMessage;

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'message-service' });
  });

  app.get('/api/messages', async (req, res, next) => {
    try {
      const storedMessage = await loadMessage();
      if (!storedMessage) {
        return res.status(503).json({ message: 'Chưa có thông điệp tích cực trong hệ thống.' });
      }

      const message = buildPositiveMessage(req.query.name, storedMessage);
      return res.status(200).json({ message });
    } catch (error) {
      return next(error);
    }
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: 'Không thể lấy thông điệp lúc này.' });
  });

  return app;
}

module.exports = createApp;
