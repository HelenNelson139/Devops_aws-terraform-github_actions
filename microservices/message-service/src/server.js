const createApp = require('./app');
const { ensureMessagesSchema } = require('./database');

const port = Number(process.env.PORT || 3001);

async function start() {
  await ensureMessagesSchema();
  const app = createApp();

  app.listen(port, () => {
    console.log(`message-service listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
