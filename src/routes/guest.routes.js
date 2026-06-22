const router = require('express').Router();
const {
  addGuest,
  bulkAddGuests,
  getGuests,
  getGuest,
  deleteGuest,
} = require('../controllers/guest.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/').get(getGuests).post(addGuest);
router.post('/bulk', bulkAddGuests);
router.route('/:id').get(getGuest).delete(deleteGuest);

module.exports = router;
