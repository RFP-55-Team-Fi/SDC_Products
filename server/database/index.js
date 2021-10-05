const { Pool } = require('pg');
const port = 5432;
const pool = new Pool({
  database: 'products',
  user: 'sdc',
  host: 'localhost',
  port: port
});

pool.connect()
  .then(() => {
    console.log('connected to PostgreSQL!');
  })
  .catch((err) => {
    console.log(err);
  });

var getProducts = (params) => {
  const query = {
    name: 'Pagination-products',
    text: `SELECT * FROM products
    ORDER BY id
    OFFSET (($1 - 1) * $2) ROWS
    FETCH NEXT $2 ROWS ONLY`,
    values: params
  };

  return pool.query(query);
};

var getSingleProduct = (params) => {
  const query = {
    name: 'add-features-product',
    text: 'SELECT products.id, products.name, products.slogan, products.description, products.category, products.default_price, (SELECT json_agg(x) from (SELECT feature, value from features where product_id=$1) x) as features from products where id=$1',
    values: params
  };
  return pool.query(query);
};


module.exports = {
  pool: pool,
  getProducts: getProducts,
  getSingleProduct: getSingleProduct
};