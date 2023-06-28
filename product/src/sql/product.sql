--select * from information_schema.columns where table_name='products' and table_schema='public';
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(50) NOT NULL,
  image VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  UNIQUE(sku)
);


CREATE TABLE IF NOT EXISTS adjustment_transaction (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(255) NOT NULL,
  qty INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  FOREIGN KEY (sku) REFERENCES products (sku) ON DELETE CASCADE
);

