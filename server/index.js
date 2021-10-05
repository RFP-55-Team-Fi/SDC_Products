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

app.get('/products/:product_id/styles', (req, res) => {

  db.getStyles([req.params.product_id])
    .then((result) => res.end(JSON.stringify(result.rows[0])));
});

app.get('/products/:product_id/related', (req, res) => {

  db.getRelated([req.params.product_id])
    .then((results)=>res.end(JSON.stringify(results.rows[0].array_agg)))
    .catch((err) => { console.error(err); res.sendStatus(404); });
});


const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});