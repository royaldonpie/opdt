const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticateToken);

router.post('/', requireRole('super_admin'), upload.single('resource_file'), resourceController.addResource);
router.get('/', resourceController.getResources);
router.delete('/:id', requireRole('super_admin'), resourceController.deleteResource);

module.exports = router;
