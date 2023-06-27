CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  sku VARCHAR(50),
  image VARCHAR(255),
  price INTEGER,
  description TEXT
);
