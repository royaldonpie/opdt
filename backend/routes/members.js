const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', requireRole('director'), memberController.getMembers);
router.post('/', requireRole('director'), memberController.addMember);
router.delete('/:id', requireRole('director'), memberController.deleteMember);

module.exports = router;
