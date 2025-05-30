const express = require('express');
const uploadController = require('../controllers/uploadController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Upload routes (admin only)
router.post('/:type', adminAuth, uploadController.uploadMiddleware, uploadController.uploadImage);
router.delete('/:type/:filename', adminAuth, uploadController.deleteImage);

module.exports = router; 