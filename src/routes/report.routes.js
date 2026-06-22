const router = require('express').Router();
const { getEventReport } = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/:eventId', protect, getEventReport);

module.exports = router;
