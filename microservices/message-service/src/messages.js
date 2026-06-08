function normalizeName(name) {
  const fallbackName = 'bạn';
  if (!name || typeof name !== 'string') {
    return fallbackName;
  }

  const normalized = name.trim().replace(/\s+/g, ' ');
  return normalized || fallbackName;
}

function buildPositiveMessage(name, message) {
  const displayName = normalizeName(name);

  return `${displayName}, ${message}`;
}

module.exports = {
  buildPositiveMessage,
  normalizeName
};
