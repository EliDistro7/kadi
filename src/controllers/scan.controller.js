const mongoose = require('mongoose');
const Guest = require('../models/guest.model');
const Event = require('../models/event.model');
const ScanLog = require('../models/scanlog.model');

const { parseQRPayload } = require('../utils/qr.util');

/**
 * POST /api/scan
 * Body: { qrData: "<raw string from camera>", gate: "gate-1", eventId: "..." }
 *
 * Uses findOneAndUpdate with { scanned: false } as atomic guard so two
 * simultaneous scans of the same QR code only succeed once — even with
 * multiple scanners hitting the server at the same time.
 */
const scanQR = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { qrData, gate = 'main', eventId } = req.body;

    // 1. Parse QR payload
    const { guestId, token } = parseQRPayload(qrData);

    // In scan.controller.js, after parseQRPayload:
const event = await Event.findOne({ _id: eventId, organizer: req.user._id });
if (!event) return res.status(403).json({ message: 'Forbidden' });

    // 2. Atomic: find guest who has NOT been scanned yet, and mark as scanned
    const guest = await Guest.findOneAndUpdate(
      { _id: guestId, qrToken: token, event: eventId, scanned: false },
      { scanned: true, scannedAt: new Date(), scannedGate: gate },
      { new: true, session }
    );

    // 3. Log the scan attempt
    const logResult = guest ? 'valid' : 'already_used';

    // Check if guest exists at all (to distinguish invalid vs duplicate)
    let result = logResult;
    let guestData = null;

    if (!guest) {
      const exists = await Guest.findOne({ _id: guestId, qrToken: token, event: eventId });
      result = exists ? 'already_used' : 'invalid';
      guestData = exists || null;
    } else {
      guestData = guest;
    }

    await ScanLog.create(
      [{ event: eventId, guest: guestId, gate, result, scannedBy: req.user?._id }],
      { session }
    );

    await session.commitTransaction();

    // 4. Return clear response for the scanner UI
    res.json({
      success: true,
      result,                          // 'valid' | 'already_used' | 'invalid'
      guest: guestData
        ? {
            id: guestData._id,
            name: guestData.name,
            cardType: guestData.cardType,
            scannedAt: guestData.scannedAt,
            scannedGate: guestData.scannedGate,
          }
        : null,
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

module.exports = { scanQR };
