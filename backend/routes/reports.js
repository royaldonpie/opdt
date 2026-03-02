const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticateToken);

router.post('/', requireRole('director'), upload.single('report_file'), reportController.submitReport);
router.get('/', reportController.getReports); // For super_admin & observer & director
router.put('/:id', requireRole('super_admin'), reportController.updateReportStatus);

module.exports = router;
