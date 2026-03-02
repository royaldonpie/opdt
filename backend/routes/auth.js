const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/seed', authController.seedUsers); // Helpers to create initial user

module.exports = router;
