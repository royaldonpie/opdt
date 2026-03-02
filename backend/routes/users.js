const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', requireRole('super_admin'), userController.getUsers);
router.post('/', requireRole('super_admin'), userController.addUser);
router.delete('/:id', requireRole('super_admin'), userController.deleteUser);
router.put('/:id/reset-password', requireRole('super_admin'), userController.resetPassword);

module.exports = router;
