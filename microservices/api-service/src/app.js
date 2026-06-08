const express = require('express');
const { requireAdmin } = require('./adminAuth');
const {
  completeReflection,
  createPositiveMessage,
  createReflection,
  deletePositiveMessage,
  listPositiveMessages,
  listReflections
} = require('./database');
const { getPositiveMessage } = require('./messageClient');
const { validateDisplayName, validatePositiveMessage, validateReflectionText } = require('./validation');

function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'api-service' });
  });

  app.post('/api/reflections', async (req, res, next) => {
    try {
      const validation = validateReflectionText(req.body.reflectionText);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const id = await createReflection(validation.value);
      return res.status(201).json({ id });
    } catch (error) {
      return next(error);
    }
  });

  app.patch('/api/reflections/:id/name', async (req, res, next) => {
    try {
      const validation = validateDisplayName(req.body.displayName);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const positiveMessage = await getPositiveMessage(validation.value);
      const reflection = await completeReflection(req.params.id, validation.value, positiveMessage);
      if (!reflection) {
        return res.status(404).json({ message: 'Không tìm thấy nội dung đã gửi.' });
      }

      return res.status(200).json({
        message: positiveMessage,
        reflection: {
          id: reflection.id,
          reflectionText: reflection.reflection_text,
          displayName: reflection.display_name
        }
      });
    } catch (error) {
      return next(error);
    }
  });

  app.get('/api/admin/reflections', requireAdmin, async (req, res, next) => {
    try {
      const reflections = await listReflections();
      return res.status(200).json({ reflections });
    } catch (error) {
      return next(error);
    }
  });

  app.get('/api/admin/messages', requireAdmin, async (req, res, next) => {
    try {
      const messages = await listPositiveMessages();
      return res.status(200).json({ messages });
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/admin/messages', requireAdmin, async (req, res, next) => {
    try {
      const validation = validatePositiveMessage(req.body.content);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const message = await createPositiveMessage(validation.value);
      return res.status(201).json({ message });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ message: 'Thông điệp này đã tồn tại.' });
      }

      return next(error);
    }
  });

  app.delete('/api/admin/messages/:id', requireAdmin, async (req, res, next) => {
    try {
      const deleted = await deletePositiveMessage(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Không tìm thấy thông điệp.' });
      }

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
  });

  return app;
}

module.exports = createApp;
