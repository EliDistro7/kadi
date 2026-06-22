const router = require('express').Router();
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/event.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getEvents).post(createEvent);
router.route('/:id').get(getEvent).patch(updateEvent).delete(deleteEvent);

module.exports = router;
