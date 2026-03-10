CREATE TABLE orders (
  order_id      VARCHAR(50) PRIMARY KEY,
  value         NUMERIC(10, 2) NOT NULL,
  creation_date TIMESTAMP NOT NULL
);

CREATE TABLE items (
  id         SERIAL PRIMARY KEY,
  order_id   VARCHAR(50) REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INT NOT NULL,
  quantity   INT NOT NULL,
  price      NUMERIC(10, 2) NOT NULL
);