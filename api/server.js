'use strict';
require('dotenv').config();
const express = require('express');
const nano = require('nano')('http://localhost:5984');

//TODO Use async/await
nano.auth(process.env.COUCHDB_USER, process.env.COUCHDB_PASSWORD, (err, resp) => {
  if (err)
    console.error(err);
  if (resp)
    console.log(resp);
});
const test = nano.db.use('test');
test.info((err, resp) => {
  if (err && err.statusCode === 404) {
    console.error(err);
    console.log("Creating database...");
    nano.db.create('test', (err, body) => { });
  }
  if (resp)
    console.log(resp);
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
