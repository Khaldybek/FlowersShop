const pool = require('../config/database');
const logger = require('../utils/logger');

exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE is_active = TRUE ORDER BY sort_order ASC'
    );

    res.json(categories);
  } catch (error) {
    logger.error('Error getting categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, image_url, sort_order } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO categories (name, description, image_url, sort_order) VALUES (?, ?, ?, ?)',
      [name, description, image_url, sort_order || 0]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Category created successfully'
    });
  } catch (error) {
    logger.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, sort_order, is_active } = req.body;

    await pool.execute(
      `UPDATE categories SET
        name = ?,
        description = ?,
        image_url = ?,
        sort_order = ?,
        is_active = ?
      WHERE id = ?`,
      [name, description, image_url, sort_order, is_active, id]
    );

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    logger.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has bouquets
    const [bouquets] = await pool.execute(
      'SELECT COUNT(*) as count FROM bouquets WHERE category_id = ?',
      [id]
    );

    if (bouquets[0].count > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with associated bouquets'
      });
    }

    await pool.execute('DELETE FROM categories WHERE id = ?', [id]);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    logger.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 