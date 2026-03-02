const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticateToken); // Protect all exam routes

router.post('/', requireRole('director'), upload.single('exam_file'), examController.submitExam);
router.get('/pending', requireRole('super_admin', 'observer'), examController.getPendingExams);
router.put('/:id', requireRole('super_admin'), examController.updateExamStatus);

module.exports = router;
