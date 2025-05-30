const jwt = require('jsonwebtoken');
const pool = require('../config/database');

exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin user exists and is active
    const [admins] = await pool.execute(
      'SELECT * FROM admin_users WHERE id = ? AND is_active = TRUE',
      [decoded.id]
    );

    if (!admins.length) {
      return res.status(401).json({ error: 'Invalid or inactive admin account' });
    }

    req.admin = admins[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}; 