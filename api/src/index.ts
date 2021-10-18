'use strict';
import dotenv from 'dotenv';
import express, { Request, Response, Application } from 'express';
const nano = require('nano')('http://localhost:5984');
dotenv.config();


//TODO Use async/await
// nano.auth(process.env.COUCHDB_USER, process.env.COUCHDB_PASSWORD, (err, resp) => {
//   if (err)
//     console.error(err);
//   if (resp)
//     console.log(resp);
// });
// const test = nano.db.use('test');
// test.info((err, resp) => {
//   if (err && err.statusCode === 404) {
//     console.error(err);
//     console.log("Creating database...");
//     nano.db.create('test', (err, body) => { });
//   }
//   if (resp)
//     console.log(resp);
// });
// const response = test.insert({ happy: true }, 'rabbit', (err, data) => {
//   console.log(err);
//   console.log(data);
// });

// Constants
const PORT = process.env.PORT || 8080;;
const HOST = '0.0.0.0';

// App
const app: Application = express();

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello Typescript with Node.js!")
});

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
