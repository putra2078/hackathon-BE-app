/**
 * Utility to generate a unique product code
 * Format: PRD-{Timestamp}-{RandomString}
 */
const generateProductCode = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PRD-${timestamp}-${random}`;
};

module.exports = {
  generateProductCode,
};
