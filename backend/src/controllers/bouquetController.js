const pool = require('../config/database');
const logger = require('../utils/logger');

exports.getAllBouquets = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'name_asc',
      page = 1,
      limit = 12
    } = req.query;

    let query = 'SELECT b.*, c.name as category_name FROM bouquets b LEFT JOIN categories c ON b.category_id = c.id WHERE b.is_available = TRUE';
    let countQuery = 'SELECT COUNT(*) as total FROM bouquets b WHERE b.is_available = TRUE';
    const params = [];
    const countParams = [];

    // Search
    if (search) {
      const searchParam = `%${search}%`;
      query += ' AND (b.name LIKE ? OR b.description LIKE ?)';
      countQuery += ' AND (b.name LIKE ? OR b.description LIKE ?)';
      params.push(searchParam, searchParam);
      countParams.push(searchParam, searchParam);
    }

    // Category filter
    if (category) {
      const categoryId = parseInt(category);
      if (!isNaN(categoryId)) {
        query += ' AND b.category_id = ?';
        countQuery += ' AND b.category_id = ?';
        params.push(categoryId);
        countParams.push(categoryId);
      }
    }

    // Price filter
    if (minPrice || maxPrice) {
      if (minPrice) {
        const minPriceNum = parseFloat(minPrice);
        if (!isNaN(minPriceNum)) {
          query += ' AND b.final_price >= ?';
          countQuery += ' AND b.final_price >= ?';
          params.push(minPriceNum);
          countParams.push(minPriceNum);
        }
      }
      if (maxPrice) {
        const maxPriceNum = parseFloat(maxPrice);
        if (!isNaN(maxPriceNum)) {
          query += ' AND b.final_price <= ?';
          countQuery += ' AND b.final_price <= ?';
          params.push(maxPriceNum);
          countParams.push(maxPriceNum);
        }
      }
    }

    // Sorting
    const sortOptions = {
      'name_asc': 'b.name ASC',
      'name_desc': 'b.name DESC',
      'price_asc': 'b.final_price ASC',
      'price_desc': 'b.final_price DESC',
      'newest': 'b.created_at DESC',
      'popular': 'b.view_count DESC'
    };

    query += ` ORDER BY ${sortOptions[sortBy] || sortOptions.name_asc}`;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    if (!isNaN(limitNum) && !isNaN(offset)) {
      query += ' LIMIT ? OFFSET ?';
      params.push(String(limitNum), String(offset));
    }

    // Get total count
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Get bouquets
    const [bouquets] = await pool.execute(query, params);

    res.json({
      bouquets: bouquets,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    logger.error('Error getting bouquets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBouquetById = async (req, res) => {
  try {
    const { id } = req.params;

    // Increment view count
    await pool.execute(
      'UPDATE bouquets SET view_count = view_count + 1 WHERE id = ?',
      [id]
    );

    const [bouquets] = await pool.execute(
      'SELECT b.*, c.name as category_name FROM bouquets b LEFT JOIN categories c ON b.category_id = c.id WHERE b.id = ?',
      [id]
    );

    if (!bouquets.length) {
      return res.status(404).json({ error: 'Bouquet not found' });
    }

    const bouquet = bouquets[0];

    res.json(bouquet);
  } catch (error) {
    logger.error('Error getting bouquet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createBouquet = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount_percentage,
      category_id,
      images,
      is_available,
      is_featured
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO bouquets (
        name, description, price, discount_percentage, category_id,
        images, is_available, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        price,
        discount_percentage || 0,
        category_id,
        JSON.stringify(images || []),
        is_available ?? true,
        is_featured ?? false
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Bouquet created successfully'
    });
  } catch (error) {
    logger.error('Error creating bouquet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateBouquet = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      discount_percentage,
      category_id,
      images,
      is_available,
      is_featured
    } = req.body;

    // Получаем текущие данные букета
    const [currentBouquet] = await pool.execute(
      'SELECT * FROM bouquets WHERE id = ?',
      [id]
    );

    if (!currentBouquet.length) {
      return res.status(404).json({ error: 'Bouquet not found' });
    }

    // Используем текущие значения, если новые не предоставлены
    const updatedBouquet = {
      name: name || currentBouquet[0].name,
      description: description || currentBouquet[0].description,
      price: price || currentBouquet[0].price,
      discount_percentage: discount_percentage !== undefined ? discount_percentage : currentBouquet[0].discount_percentage,
      category_id: category_id || currentBouquet[0].category_id,
      images: images ? JSON.stringify(images) : currentBouquet[0].images,
      is_available: is_available !== undefined ? is_available : currentBouquet[0].is_available,
      is_featured: is_featured !== undefined ? is_featured : currentBouquet[0].is_featured
    };

    await pool.execute(
      `UPDATE bouquets SET
        name = ?,
        description = ?,
        price = ?,
        discount_percentage = ?,
        category_id = ?,
        images = ?,
        is_available = ?,
        is_featured = ?
      WHERE id = ?`,
      [
        updatedBouquet.name,
        updatedBouquet.description,
        updatedBouquet.price,
        updatedBouquet.discount_percentage,
        updatedBouquet.category_id,
        updatedBouquet.images,
        updatedBouquet.is_available,
        updatedBouquet.is_featured,
        id
      ]
    );

    res.json({ 
      message: 'Bouquet updated successfully',
      bouquet: updatedBouquet
    });
  } catch (error) {
    logger.error('Error updating bouquet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteBouquet = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM bouquets WHERE id = ?', [id]);

    res.json({ message: 'Bouquet deleted successfully' });
  } catch (error) {
    logger.error('Error deleting bouquet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 