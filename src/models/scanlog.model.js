const mongoose = require('mongoose');

const scanLogSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
    gate: { type: String, default: 'main' },
    result: { type: String, enum: ['valid', 'already_used', 'invalid'], required: true },
    scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ScanLog', scanLogSchema);
