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

async function ensureMessagesSchema() {
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

async function getRandomPositiveMessage() {
  const result = await pool.query(
    `SELECT content
     FROM positive_messages
     WHERE is_active = TRUE
     ORDER BY RANDOM()
     LIMIT 1`
  );

  return result.rows[0]?.content;
}

async function closePool() {
  await pool.end();
}

module.exports = {
  closePool,
  ensureMessagesSchema,
  getRandomPositiveMessage
};
