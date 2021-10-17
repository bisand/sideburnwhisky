'use strict';
require('dotenv').config();
const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const NodeCouchDb = require('node-couchdb');

// node-couchdb instance talking to external service
const couch = new NodeCouchDb({
  host: 'localhost',
  protocol: 'http',
  port: 5984,
  auth: {
    user: process.env.COUCHDB_USER,
    pass: process.env.COUCHDB_PASSWORD
  }
});


// App
const app = express();
app.get('/', async (req, res) => {
  try {
    couch.listDatabases()
      .then(
        dbs => {
          res.send(dbs);
        },
        err => {
          res.send(err);
        });
  } catch (error) {
    res.send(JSON.stringify(error));
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
