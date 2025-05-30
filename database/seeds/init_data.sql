-- Insert admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, email, full_name, is_active)
VALUES (
  'admin',
  '$2a$10$rDkPvvAFV8c3JZxJ5Qx5UOQx5UOQx5UOQx5UOQx5UOQx5UOQx5UOQ',
  'admin@flowershop.com',
  'Admin User',
  TRUE
);

-- Insert categories
INSERT INTO categories (name, description, image_url, sort_order, is_active)
VALUES
  ('Розы', 'Красивые букеты из роз', '/uploads/categories/roses.jpg', 1, TRUE),
  ('Тюльпаны', 'Свежие тюльпаны', '/uploads/categories/tulips.jpg', 2, TRUE),
  ('Свадебные букеты', 'Элегантные свадебные букеты', '/uploads/categories/wedding.jpg', 3, TRUE),
  ('Пионы', 'Нежные пионы', '/uploads/categories/peonies.jpg', 4, TRUE);

-- Insert bouquets
INSERT INTO bouquets (name, description, price, discount_percentage, category_id, images, is_available, is_featured)
VALUES
  (
    'Красные розы',
    'Букет из 25 красных роз',
    2500.00,
    0,
    1,
    '["/uploads/bouquets/red-roses-1.jpg", "/uploads/bouquets/red-roses-2.jpg"]',
    TRUE,
    TRUE
  ),
  (
    'Весенний микс',
    'Букет из тюльпанов и пионов',
    3500.00,
    10,
    2,
    '["/uploads/bouquets/spring-mix-1.jpg"]',
    TRUE,
    TRUE
  ),
  (
    'Свадебный букет',
    'Элегантный свадебный букет из белых роз',
    5000.00,
    0,
    3,
    '["/uploads/bouquets/wedding-1.jpg"]',
    TRUE,
    FALSE
  ); 