const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const guestSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    cardType: { type: String, enum: ['single', 'double'], default: 'single' },
    // Unique token embedded in the QR code
    qrToken: { type: String, unique: true, default: () => randomUUID() },
    // Base64-encoded QR code image (generated on creation)
    qrCodeImage: { type: String },
    // Scan tracking
    scanned: { type: Boolean, default: false },
    scannedAt: { type: Date },
    scannedGate: { type: String },
  },
  { timestamps: true }
);

// Index for fast QR token lookup at scan time
//guestSchema.index({ qrToken: 1 });
guestSchema.index({ event: 1 });

module.exports = mongoose.model('Guest', guestSchema);