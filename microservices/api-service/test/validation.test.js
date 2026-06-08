const {
  normalizeText,
  validateDisplayName,
  validatePositiveMessage,
  validateReflectionText
} = require('../src/validation');

describe('web-service validation', () => {
  test('normalizes duplicated spaces', () => {
    expect(normalizeText('  hom   nay   on  ')).toBe('hom nay on');
  });

  test('rejects empty reflection text', () => {
    expect(validateReflectionText(' ').valid).toBe(false);
  });

  test('accepts valid reflection text', () => {
    expect(validateReflectionText('Hôm nay mình ổn.').valid).toBe(true);
  });

  test('rejects empty display name', () => {
    expect(validateDisplayName('').valid).toBe(false);
  });

  test('rejects too short positive messages', () => {
    expect(validatePositiveMessage('ngắn').valid).toBe(false);
  });

  test('accepts valid positive messages', () => {
    expect(validatePositiveMessage('Cậu đã làm rất tốt hôm nay.').valid).toBe(true);
  });
});
