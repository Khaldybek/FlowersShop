const express = require('express');
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);

// Admin routes
router.post('/', [
  adminAuth,
  body('name').notEmpty().withMessage('Name is required'),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order must be a positive number')
], categoryController.createCategory);

router.put('/:id', [
  adminAuth,
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order must be a positive number')
], categoryController.updateCategory);

router.delete('/:id', adminAuth, categoryController.deleteCategory);

module.exports = router; 