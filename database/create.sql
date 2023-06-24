BEGIN;

DROP TABLE IF EXISTS customers, dates, couples;

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  notes VARCHAR(600),
  sex VARCHAR(8),
  relationship_status VARCHAR(8),
  id_number VARCHAR(50),
  photo BYTEA,
  birth_date DATE,
  registration_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_member BOOLEAN,
  is_banned BOOLEAN NOT NULL DEFAULT 'false',
  expiry_date DATE
);

CREATE TABLE dates (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_customer
      FOREIGN KEY(customer_id) 
		REFERENCES customers(id)
);

CREATE TABLE couples (
  customer_id_1 int REFERENCES customers (id) ON UPDATE CASCADE ON DELETE CASCADE,
  customer_id_2 int REFERENCES customers (id) ON UPDATE CASCADE, 
  CONSTRAINT member_to_customer_id PRIMARY KEY (customer_id_1, customer_id_2)
);

INSERT INTO customers (first_name, last_name, expiry_date ) VALUES
 ('John', 'Doe', '2024-06-11'),
  ('Jane', 'Doe', '2023-07-11'), 
  ('Mary ', 'Davis', '2023-07-11'), 
  ('William', 'Carr', '2023-07-11'), 
  ('Ginger', 'Calhoun', '2023-09-11');

INSERT INTO customers (first_name, last_name, notes, sex, relationship_status, photo, birth_date, is_member, is_banned, expiry_date ) VALUES
 ('Stephanie', 'Rose', 'comes in on weekends', 'Female', 'Couple', NULL, '1989-01-19', 'true', 'false','2023-12-11'),
  ('Phillip', 'Petersen', NULL, 'Male', 'Single', NULL, '2002-06-26', 'false', 'true', '2023-09-11'); 

INSERT INTO couples (customer_id_1, customer_id_2) VALUES
 (1, 4),
  (1, 5),
  (2, 3);

INSERT INTO dates (customer_id, entry_date) VALUES
 (1, '2023-06-01'),
  (1, '2023-06-02'),
  (1, '2023-06-03'),
  (1, '2023-06-04'),
  (1, '2023-06-05'),
  (3, '2023-06-05'),
  (3, '2023-06-05'),
  (3, '2023-06-05'),
  (1, '2023-06-07'),
  (2, '2023-06-07'),
  (5, '2023-06-07'),
  (6, '2023-06-07');


COMMIT;