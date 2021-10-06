const { Pool } = require('pg');
const db = require('./db.config.js');
const port = 5432;
const pool = new Pool({
  database: 'products',
  user: 'postgres',
  host: '54.151.19.57',
  port: port,
  password: db.password
});

pool.connect()
  .then(() => {
    console.log('connected to PostgreSQL!');
  })
  .catch((err) => {
    console.log(err);
  });

const getProducts = (params) => {
  const query = {
    name: 'Pagination-products',
    text: `
    SELECT * FROM products
    ORDER BY id
    OFFSET (($1 - 1) * $2) ROWS
    FETCH NEXT $2 ROWS ONLY`,
    values: params
  };

  return pool.query(query);
};

const getSingleProduct = (params) => {
  const query = {
    name: 'add-features-product',
    text: `
    SELECT products.id, products.name, products.slogan, products.description, products.category, products.default_price,
    (SELECT json_agg(x)
    FROM (SELECT feature, value from features where product_id=$1) x) AS features
    FROM products where id=$1`,
    values: params
  };
  return pool.query(query);
};

const getStyles = (params) => {
  const query = {
    name: 'get-styles',
    text: `
      SELECT
        s.product_id AS product_id,
        coalesce(
          (
            SELECT array_to_json(array_agg(row_to_json(x)))
            FROM (
              SELECT s.id AS style_id, s.name, s.original_price, s.sale_price, s.default,
              coalesce(
                (
                  SELECT array_to_json(array_agg(row_to_json(p)))
                  FROM (
                    SELECT thumbnail_url, url FROM photos where style_id=s.id
                  ) p
                ), '[]'
              ) AS photos,
              (SELECT JSON_OBJECT_AGG(
                id, JSON_BUILD_OBJECT(
                  'quantity', quantity,
                  'size', size
                ))
                AS skus
                FROM sku
                WHERE style_id=s.id)
              FROM styles s
              WHERE s.product_id=$1
              GROUP BY s.id
            ) x
          ), '[]'
        ) AS results
        FROM styles s WHERE s.product_id=$1`,
    values: params
  };

  return pool.query(query);
};

const getRelated = (params) => {
  const query = {
    name: 'return-related-products',
    text: `
    SELECT array_agg(related_product_id)
    FROM related
    WHERE current_product_id=$1`,
    values: params
  };

  return pool.query(query);
};

module.exports = {
  pool: pool,
  getProducts: getProducts,
  getSingleProduct: getSingleProduct,
  getStyles: getStyles,
  getRelated: getRelated
};