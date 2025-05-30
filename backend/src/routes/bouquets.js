const express = require('express');
const { body } = require('express-validator');
const bouquetController = require('../controllers/bouquetController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', bouquetController.getAllBouquets);
router.get('/:id', bouquetController.getBouquetById);

// Admin routes
router.post('/', [
  adminAuth,
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category_id').optional().isInt().withMessage('Invalid category ID'),
  body('discount_percentage').optional().isInt({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100')
], bouquetController.createBouquet);

router.put('/:id', [
  adminAuth,
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category_id').optional().isInt().withMessage('Invalid category ID'),
  body('discount_percentage').optional().isInt({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100')
], bouquetController.updateBouquet);

router.delete('/:id', adminAuth, bouquetController.deleteBouquet);

module.exports = router; 