CREATE TABLE IF NOT EXISTS reflections (
  id UUID PRIMARY KEY,
  reflection_text TEXT NOT NULL,
  display_name VARCHAR(100),
  positive_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS positive_messages (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO positive_messages (content) VALUES
  ('Hôm nay có thể chưa hoàn hảo, nhưng cậu đã đi qua nó bằng tất cả sự cố gắng của mình.'),
  ('Cậu không cần phải mạnh mẽ mọi lúc. Nghỉ lại một chút cũng là một cách chăm sóc bản thân.'),
  ('Mỗi điều nhỏ cậu làm hôm nay đều có giá trị. Hãy dịu dàng với chính mình hơn nhé.'),
  ('Nếu hôm nay mệt, cậu vẫn xứng đáng được yêu thương, được lắng nghe và được bình yên.'),
  ('Ngày mai sẽ là một trang mới. Còn bây giờ, hãy tự hào vì cậu vẫn đang tiếp tục.')
ON CONFLICT (content) DO NOTHING;
