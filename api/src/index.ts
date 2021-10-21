import express, { Request, Response } from 'express';
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
import { DataService } from './services/DataService';
import { DatabaseConfig } from "./services/DatabaseConfig";
import { UserService } from './services/UserService';
import { UserController } from './controllers/UserController';
import { ArticleService } from './services/ArticleService';

dotenv.config();
export var jsonParser = bodyParser.json()

if (!process.env.COUCHDB_HOST)
  throw new Error('The required environment variable "COUCHDB_HOST" is missing.');
if (!process.env.COUCHDB_PORT)
  throw new Error('The required environment variable "COUCHDB_PORT" is missing.');
if (!process.env.COUCHDB_USER)
  throw new Error('The required environment variable "COUCHDB_USER" is missing.');
if (!process.env.COUCHDB_PASSWORD)
  throw new Error('The required environment variable "COUCHDB_PASSWORD" is missing.');
if (!process.env.COUCHDB_DATABASE)
  throw new Error('The required environment variable "COUCHDB_DATABASE" is missing.');

const config: DatabaseConfig = {
  host: process.env.COUCHDB_HOST as string,
  port: Number(process.env.COUCHDB_PORT),
  user: process.env.COUCHDB_USER as string,
  password: process.env.COUCHDB_PASSWORD as string,
  databaseName: process.env.COUCHDB_DATABASE as string
}

const dataService = new DataService(config, async () => {

  const app: express.Application = express();
  const port: number = 8080;

  const userService = new UserService(dataService);
  const userController = new UserController(app, userService);
  userController.start();

  const articleService = new ArticleService(dataService);

  app.get('/', (req: Request, res: Response) => {
    res.send('Sideburn Whiskylaug API v1.0');
  });

  app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
  });
});

