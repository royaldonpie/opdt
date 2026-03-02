const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', requireRole('super_admin', 'director'), notificationController.getNotifications);
router.post('/', requireRole('super_admin'), notificationController.sendNotification);
router.put('/:id/read', requireRole('director'), notificationController.markAsRead);

module.exports = router;
