const Guest = require('../models/guest.model');
const Event = require('../models/event.model');

// GET /api/reports/:eventId
const getEventReport = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const guests = await Guest.find({ event: eventId }).sort({ name: 1 });

    const attended = guests.filter((g) => g.scanned);
    const notAttended = guests.filter((g) => !g.scanned);

    res.json({
      success: true,
      report: {
        event: {
          id: event._id,
          title: event.title,
          date: event.date,
          venue: event.venue,
        },
        summary: {
          totalInvited: guests.length,
          totalAttended: attended.length,
          totalNotAttended: notAttended.length,
          attendanceRate:
            guests.length > 0
              ? `${Math.round((attended.length / guests.length) * 100)}%`
              : '0%',
        },
        attended: attended.map((g) => ({
          name: g.name,
          cardType: g.cardType,
          scannedAt: g.scannedAt,
          gate: g.scannedGate,
        })),
        notAttended: notAttended.map((g) => ({
          name: g.name,
          cardType: g.cardType,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getEventReport };
