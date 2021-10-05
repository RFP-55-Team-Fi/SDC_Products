CREATE TABLE IF NOT EXISTS "products" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "slogan" varchar,
  "description" varchar,
  "category" varchar,
  "default_price" varchar
);

CREATE TABLE IF NOT EXISTS "features" (
  "id" int PRIMARY KEY,
  "product_id" int,
  "feature" varchar,
  "value" varchar
);

CREATE TABLE IF NOT EXISTS "styles" (
  "id" int PRIMARY KEY,
  "product_id" int,
  "name" varchar,
  "sale_price" varchar,
  "original_price" varchar,
  "default" BOOLEAN
);

CREATE TABLE IF NOT EXISTS "photos" (
  "id" int PRIMARY KEY,
  "style_id" int,
  "url" varchar,
  "thumbnail_url" varchar
);

CREATE TABLE IF NOT EXISTS "sku" (
  "id" int PRIMARY KEY,
  "style_id" int,
  "size" varchar,
  "quantity" int
);

CREATE TABLE IF NOT EXISTS "related" (
  "id" int PRIMARY KEY,
  "current_product_id" int,
  "related_product_id" int
);

ALTER TABLE "related" ADD FOREIGN KEY ("current_product_id") REFERENCES "products" ("id");

-- ALTER TABLE "related" ADD FOREIGN KEY ("related_product_id") REFERENCES "products" ("id");

ALTER TABLE "styles" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "photos" ADD FOREIGN KEY ("style_id") REFERENCES "styles" ("id");

ALTER TABLE "sku" ADD FOREIGN KEY ("style_id") REFERENCES "styles" ("id");

ALTER TABLE "features" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

COPY products
FROM '/Users/jesusgonzales/Desktop/HackReactor/SDC_Products/data/product.csv'
DELIMITER ','
CSV HEADER;

COPY styles
FROM '/Users/jesusgonzales/Desktop/HackReactor/SDC_Products/data/styles.csv'
DELIMITER ','
CSV HEADER;

COPY features
FROM '/Users/jesusgonzales/Desktop/HackReactor/SDC_Products/data/features.csv'
DELIMITER ','
CSV HEADER;

COPY photos
FROM '/Users/jesusgonzales/Desktop/HackReactor/SDC_Products/data/photos.csv'
DELIMITER ','
CSV HEADER;

COPY related
FROM '/Users/jesusgonzales/Desktop/HackReactor/SDC_Products/data/related.csv'
DELIMITER ','
CSV HEADER;

COPY sku
FROM '/Users/jesusgonzales/Desktop/HackReactor/SDC_Products/data/skus.csv'
DELIMITER ','
CSV HEADER;