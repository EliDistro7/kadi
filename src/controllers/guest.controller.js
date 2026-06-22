const Guest = require('../models/guest.model');
const { generateQRCode } = require('../utils/qr.util');

// POST /api/guests  — add a single guest
const addGuest = async (req, res, next) => {
  try {
    const guest = new Guest(req.body);
    guest.qrCodeImage = await generateQRCode(guest._id.toString(), guest.qrToken);
    await guest.save();
    res.status(201).json({ success: true, guest });
  } catch (err) {
    next(err);
  }
};

// POST /api/guests/bulk  — add multiple guests at once
// Body: { eventId, guests: [{ name, phone, cardType }] }
const bulkAddGuests = async (req, res, next) => {
  try {
    const { eventId, guests } = req.body;
    if (!Array.isArray(guests) || guests.length === 0)
      return res.status(400).json({ message: 'guests array required' });

    const created = [];
    for (const g of guests) {
      const guest = new Guest({ ...g, event: eventId });
      guest.qrCodeImage = await generateQRCode(guest._id.toString(), guest.qrToken);
      await guest.save();
      created.push(guest);
    }

    res.status(201).json({ success: true, count: created.length, guests: created });
  } catch (err) {
    next(err);
  }
};

// GET /api/guests?eventId=xxx
const getGuests = async (req, res, next) => {
  try {
    const { eventId } = req.query;
    const filter = eventId ? { event: eventId } : {};
    const guests = await Guest.find(filter).sort({ name: 1 });
    res.json({ success: true, count: guests.length, guests });
  } catch (err) {
    next(err);
  }
};

// GET /api/guests/:id
const getGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json({ success: true, guest });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/guests/:id
const deleteGuest = async (req, res, next) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Guest removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { addGuest, bulkAddGuests, getGuests, getGuest, deleteGuest };
