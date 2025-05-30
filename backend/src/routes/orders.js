const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', [
  body('customer_name').notEmpty().withMessage('Customer name is required'),
  body('customer_phone').notEmpty().withMessage('Customer phone is required'),
  body('customer_address').notEmpty().withMessage('Customer address is required'),
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.bouquet_id').isInt().withMessage('Invalid bouquet ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('delivery_date').optional().isDate().withMessage('Invalid delivery date'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], orderController.createOrder);

// Admin routes
router.get('/', adminAuth, orderController.getOrders);
router.put('/:id/status', [
  adminAuth,
  body('status').isIn(['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
], orderController.updateOrderStatus);

module.exports = router; 