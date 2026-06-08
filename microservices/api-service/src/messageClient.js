async function getPositiveMessage(name) {
  const baseUrl = process.env.MESSAGE_SERVICE_URL || 'http://localhost:3001';
  const url = `${baseUrl}/api/messages?name=${encodeURIComponent(name)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`message-service returned ${response.status}`);
  }

  const body = await response.json();
  return body.message;
}

module.exports = {
  getPositiveMessage
};
