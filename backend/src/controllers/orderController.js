const pool = require('../config/database');
const logger = require('../utils/logger');

exports.createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      customer_name,
      phone,
      email,
      delivery_address,
      delivery_date,
      delivery_time,
      items,
      total_amount,
      payment_method,
      notes
    } = req.body;

    // Generate order number
    const orderNumber = `ORD${Date.now()}`;

    // Create order
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (
        order_number, customer_name, customer_phone, customer_address,
        delivery_date, total_amount, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        customer_name,
        phone,
        delivery_address,
        delivery_date,
        total_amount,
        'pending',
        notes
      ]
    );

    const orderId = orderResult.insertId;

    // Get bouquet details for each item
    for (const item of items) {
      const [bouquets] = await connection.execute(
        'SELECT name, price FROM bouquets WHERE id = ?',
        [item.bouquet_id]
      );

      if (!bouquets.length) {
        throw new Error(`Bouquet with ID ${item.bouquet_id} not found`);
      }

      const bouquet = bouquets[0];

      // Create order item
      await connection.execute(
        `INSERT INTO order_items (
          order_id, bouquet_id, bouquet_name, price, quantity
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          item.bouquet_id,
          bouquet.name,
          bouquet.price,
          item.quantity
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      order_id: orderId,
      order_number: orderNumber,
      message: 'Order created successfully'
    });
  } catch (error) {
    await connection.rollback();
    logger.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = 'SELECT * FROM orders';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    // Get total count
    const [countResult] = await pool.execute(
      status ? 'SELECT COUNT(*) as total FROM orders WHERE status = ?' : 'SELECT COUNT(*) as total FROM orders',
      status ? [status] : []
    );
    const total = countResult[0].total;

    // Add pagination
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(String(limitNum), String(offset));

    const [orders] = await pool.execute(query, params);

    // Get order items for each order
    for (const order of orders) {
      const [items] = await pool.execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    res.json({
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    logger.error('Error getting orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    logger.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 