'use strict';
require('dotenv').config();
const express = require('express');
const nano = require('nano')('http://' + process.env.COUCHDB_USER + ':' + process.env.COUCHDB_PASSWORD + '@localhost:5984');
const test = nano.db.use('test');
test.info((err, data) => {
  console.log(err);
  console.log(data);
});
// const response = test.insert({ happy: true }, 'rabbit', (err, data) => {
//   console.log(err);
//   console.log(data);
// });

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';


// App
const app = express();
app.get('/', async (req, res) => {
  try {
    res.send(dbs);
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
