const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const logger = require('../utils/logger');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get admin user
    const [admins] = await pool.execute(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (!admins.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = admins[0];

    // Check if admin is active
    if (!admin.is_active) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await pool.execute(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [admin.id]
    );

    // Generate token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.full_name
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 