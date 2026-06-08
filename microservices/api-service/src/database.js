const { randomUUID } = require('crypto');
const { Pool } = require('pg');

const seedMessages = [
  'Hôm nay có thể chưa hoàn hảo, nhưng cậu đã đi qua nó bằng tất cả sự cố gắng của mình.',
  'Cậu không cần phải mạnh mẽ mọi lúc. Nghỉ lại một chút cũng là một cách chăm sóc bản thân.',
  'Mỗi điều nhỏ cậu làm hôm nay đều có giá trị. Hãy dịu dàng với chính mình hơn nhé.',
  'Nếu hôm nay mệt, cậu vẫn xứng đáng được yêu thương, được lắng nghe và được bình yên.',
  'Ngày mai sẽ là một trang mới. Còn bây giờ, hãy tự hào vì cậu vẫn đang tiếp tục.'
];

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reflections (
      id UUID PRIMARY KEY,
      reflection_text TEXT NOT NULL,
      display_name VARCHAR(100),
      positive_message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS positive_messages (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL UNIQUE,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  for (const message of seedMessages) {
    await pool.query(
      'INSERT INTO positive_messages (content) VALUES ($1) ON CONFLICT (content) DO NOTHING',
      [message]
    );
  }
}

async function createReflection(reflectionText) {
  const id = randomUUID();
  await pool.query(
    'INSERT INTO reflections (id, reflection_text) VALUES ($1, $2)',
    [id, reflectionText]
  );

  return id;
}

async function completeReflection(id, displayName, positiveMessage) {
  const result = await pool.query(
    `UPDATE reflections
     SET display_name = $2, positive_message = $3
     WHERE id = $1
     RETURNING id, reflection_text, display_name, positive_message, created_at`,
    [id, displayName, positiveMessage]
  );

  return result.rows[0];
}

async function listReflections() {
  const result = await pool.query(`
    SELECT
      id,
      reflection_text AS "reflectionText",
      display_name AS "displayName",
      positive_message AS "positiveMessage",
      created_at AS "createdAt"
    FROM reflections
    ORDER BY created_at DESC
    LIMIT 100
  `);

  return result.rows;
}

async function listPositiveMessages() {
  const result = await pool.query(`
    SELECT
      id,
      content,
      is_active AS "isActive",
      created_at AS "createdAt"
    FROM positive_messages
    ORDER BY id ASC
  `);

  return result.rows;
}

async function createPositiveMessage(content) {
  const result = await pool.query(
    `INSERT INTO positive_messages (content)
     VALUES ($1)
     RETURNING id, content, is_active AS "isActive", created_at AS "createdAt"`,
    [content]
  );

  return result.rows[0];
}

async function deletePositiveMessage(id) {
  const result = await pool.query(
    `DELETE FROM positive_messages
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  return result.rowCount > 0;
}

async function closePool() {
  await pool.end();
}

module.exports = {
  closePool,
  completeReflection,
  createPositiveMessage,
  createReflection,
  deletePositiveMessage,
  ensureSchema,
  listPositiveMessages,
  listReflections
};
