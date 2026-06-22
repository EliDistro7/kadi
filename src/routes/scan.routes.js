const router = require('express').Router();
const { scanQR } = require('../controllers/scan.controller');
const { protect } = require('../middleware/auth.middleware');

// Ushers hit this endpoint when they scan a QR code at the gate
router.post('/', protect, scanQR);

module.exports = router;
