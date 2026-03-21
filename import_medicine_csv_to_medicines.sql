USE quickmeds;

CREATE TABLE IF NOT EXISTS medicine_import (
  id INT,
  name VARCHAR(150),
  generic_name VARCHAR(200),
  category VARCHAR(100),
  price_inr INT,
  stock INT,
  requires_prescription VARCHAR(10),
  manufacturer VARCHAR(150),
  description VARCHAR(255)
);

TRUNCATE TABLE medicine_import;

LOAD DATA LOCAL INFILE '/Users/suryanshurai/Desktop/QuickMeds/medicine.csv'
INTO TABLE medicine_import
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id, name, generic_name, category, price_inr, stock, requires_prescription, manufacturer, description);

INSERT INTO categories (name, description)
SELECT 'Antibiotics', 'Antibiotic medicines'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Antibiotics');

INSERT INTO categories (name, description)
SELECT 'Vitamins & Supplements', 'Vitamins and supplements'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Vitamins & Supplements');

INSERT INTO categories (name, description)
SELECT 'Digestive Health', 'Digestive health medicines'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Digestive Health');

INSERT INTO medicines (name, description, price, stock, requires_prescription, image_url, category_id)
SELECT
  mi.name,
  CONCAT(mi.description, ' | Generic: ', mi.generic_name, ' | Manufacturer: ', mi.manufacturer),
  CAST(mi.price_inr AS DECIMAL(10,2)),
  mi.stock,
  CASE LOWER(mi.requires_prescription) WHEN 'true' THEN true ELSE false END,
  NULL,
  c.id
FROM medicine_import mi
JOIN categories c ON c.name = mi.category
LEFT JOIN medicines m ON m.name = mi.name
WHERE m.id IS NULL;

SELECT COUNT(*) AS imported_rows FROM medicine_import;
SELECT COUNT(*) AS total_medicines_rows FROM medicines;
SELECT c.name, COUNT(m.id) AS medicines_per_category
FROM categories c
LEFT JOIN medicines m ON m.category_id = c.id
GROUP BY c.name
ORDER BY c.name;
