const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', requireRole('director'), memberController.getMembers);
router.get('/all', requireRole('super_admin', 'observer'), memberController.getAllMembers);
router.post('/', requireRole('director'), memberController.addMember);
router.put('/:id', requireRole('director'), memberController.updateMember);
router.delete('/:id', requireRole('director'), memberController.deleteMember);

module.exports = router;
