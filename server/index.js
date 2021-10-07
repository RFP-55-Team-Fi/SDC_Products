const express = require('express');
const db = require('./database/');
const nodeCache = require('node-cache');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const cache = new nodeCache({ maxKeys: 100 });


app.get('/products', async (req, res) => {
  const { page = 5, count = 1 } = req.query;
  let cacheKey = `/products?p=${page},c=${count}`;

  if (cache.has(cacheKey)) {
    res.status(200).send(cache.get(cacheKey));
  } else {
    db.getProducts([page || 1, count || 5])
    .then(products=>console.log(products.rows));
    cache.set(cacheKey, products);
    res.end(JSON.stringify((products.rows)));
  }
});

app.get('/products/:product_id', (req, res) => {

  db.getSingleProduct([req.params.product_id])
    .then((result) => res.end(JSON.stringify(result.rows)));

});

app.get('/products/:product_id/styles', (req, res) => {

  db.getStyles([req.params.product_id])
    .then((result) => res.end(JSON.stringify(result.rows[0])));
});

app.get('/products/:product_id/related', (req, res) => {

  db.getRelated([req.params.product_id])
    .then((results) => res.end(JSON.stringify(results.rows[0].array_agg)))
    .catch((err) => { console.error(err); res.sendStatus(404); });
});


const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});