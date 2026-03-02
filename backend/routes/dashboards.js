const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/admin', requireRole('super_admin'), dashboardController.getAdminDashboard);
router.get('/director', requireRole('director'), dashboardController.getDirectorDashboard);
router.get('/observer', requireRole('observer'), dashboardController.getObserverDashboard);

module.exports = router;
