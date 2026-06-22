const QRCode = require('qrcode');

/**
 * Generates a base64 PNG QR code from a token.
 * The QR code encodes a JSON payload with the guestId and token.
 */
const generateQRCode = async (guestId, qrToken) => {
  const payload = JSON.stringify({ guestId, token: qrToken });
  const base64 = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 300,
    color: { dark: '#1a1a2e', light: '#ffffff' },
  });
  return base64;
};

/**
 * Parse QR scan data from the mobile scanner.
 * Returns { guestId, token } or throws.
 */
const parseQRPayload = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.guestId || !parsed.token) throw new Error('Invalid QR payload');
    return parsed;
  } catch {
    throw new Error('Unreadable QR code');
  }
};

module.exports = { generateQRCode, parseQRPayload };
