function normalizeText(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  return value.trim().replace(/\s+/g, ' ');
}

function validateReflectionText(value) {
  const text = normalizeText(value);

  if (text.length < 2) {
    return { valid: false, message: 'Vui lòng nhập cảm nhận của cậu hôm nay.' };
  }

  if (text.length > 1000) {
    return { valid: false, message: 'Nội dung tối đa 1000 ký tự.' };
  }

  return { valid: true, value: text };
}

function validateDisplayName(value) {
  const name = normalizeText(value);

  if (name.length < 1) {
    return { valid: false, message: 'Vui lòng nhập tên của cậu.' };
  }

  if (name.length > 100) {
    return { valid: false, message: 'Tên tối đa 100 ký tự.' };
  }

  return { valid: true, value: name };
}

function validatePositiveMessage(value) {
  const content = normalizeText(value);

  if (content.length < 10) {
    return { valid: false, message: 'Thông điệp cần ít nhất 10 ký tự.' };
  }

  if (content.length > 500) {
    return { valid: false, message: 'Thông điệp tối đa 500 ký tự.' };
  }

  return { valid: true, value: content };
}

module.exports = {
  normalizeText,
  validateDisplayName,
  validatePositiveMessage,
  validateReflectionText
};
