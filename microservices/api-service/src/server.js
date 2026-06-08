const createApp = require('./app');
const { ensureSchema } = require('./database');

const port = Number(process.env.PORT || 3000);

async function start() {
  await ensureSchema();
  const app = createApp();

  app.listen(port, () => {
    console.log(`api-service listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
