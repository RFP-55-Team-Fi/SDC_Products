const express = require('express');
const db = require('./database/');
const { Pool } = require('pg');

const app = express();
app.use(express.json());


app.get('/products', (req, res) => {

  db.getProducts([req.query.page || 1, req.query.count || 5])
    .then((result) => res.end(JSON.stringify((result.rows))));
});

app.get('/products/:product_id', (req, res) => {

  db.getSingleProduct([req.params.product_id])
    .then((result) => res.end(JSON.stringify(result.rows)));

});

const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});