const Event = require('../models/event.model');

// POST /api/events
const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({ ...req.body, organizer: req.user._id });
    res.status(201).json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

// GET /api/events  (organizer sees only their events)
const getEvents = async (req, res, next) => {
  try {
    console.log('📋 getEvents called');
    console.log('👤 req.user:', req.user);
    console.log('🔑 organizer id:', req.user?._id);

    const events = await Event.find({ organizer: req.user._id }).sort({ date: -1 });
    
    console.log('📦 events found:', events.length);
    console.log('📦 events data:', JSON.stringify(events, null, 2));

    res.json({ success: true, count: events.length, events });
  } catch (err) {
    console.error('❌ getEvents error:', err.message);
    console.error('❌ full error:', err);
    next(err);
  }
};

// GET /api/events/:id
// GET /api/events/:id
const getEvent = async (req, res, next) => {
  try {
    console.log('🔍 getEvent called');
    console.log('🆔 params.id:', req.params.id);
    console.log('👤 req.user:', req.user);

    const event = await Event.findById(req.params.id);
    
    console.log('📦 event found:', event ? 'yes' : 'null');
    console.log('📦 event data:', JSON.stringify(event, null, 2));

    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) {
    console.error('❌ getEvent error:', err.message);
    console.error('❌ full error:', err);
    next(err);
  }
};

// PATCH /api/events/:id
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/events/:id
const deleteEvent = async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createEvent, getEvents, getEvent, updateEvent, deleteEvent };
