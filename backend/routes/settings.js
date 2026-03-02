const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/club', requireRole('director'), settingsController.getClubSettings);
router.put('/club', requireRole('director'), settingsController.updateClubSettings);

module.exports = router;
