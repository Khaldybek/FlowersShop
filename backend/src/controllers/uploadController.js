const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.params.type; // 'bouquets' or 'categories'
    const uploadPath = path.join(__dirname, `../../uploads/${type}`);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

exports.uploadMiddleware = upload.single('image');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const type = req.params.type;
    const filename = req.file.filename;
    const imageUrl = `/uploads/${type}/${filename}`;

    res.json({
      url: imageUrl,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    logger.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, `../../uploads/${type}/${filename}`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    logger.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 