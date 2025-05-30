const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Login route
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

module.exports = router; 