import express, { Request, Response } from 'express';
import helmet from "helmet";
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
import { DataService } from './services/DataService';
import { DatabaseConfig } from "./services/DatabaseConfig";
import { UserService } from './services/UserService';
import { UserController } from './controllers/UserController';
import { ArticleService } from './services/ArticleService';
import { ArticleController } from './controllers/ArticleController';
import { ReviewService } from './services/ReviewService';
import { ReviewController } from './controllers/ReviewController';
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';

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

var checkJwt = auth({
  jwksUri: 'https://bisand.auth0.com/.well-known/jwks.json',
  audience: 'https://api.sideburnwhisky.no/',
  issuer: 'https://bisand.auth0.com/',
});

const dataService = new DataService(config, async () => {

  const app: express.Application = express();
  app.use(helmet());
  const port: number = 8080;

  const userService = new UserService(dataService);
  const userController = new UserController(app, checkJwt, userService);
  userController.start();

  const articleService = new ArticleService(dataService);
  const articleController = new ArticleController(app, articleService);
  articleController.start();
  articleService.addDemoArticle();

  const reviewService = new ReviewService(dataService);
  const reviewController = new ReviewController(app, reviewService);
  reviewController.start();
  reviewService.addDemoReview();

  app.get('/', (req: Request, res: Response) => {
    res.send({ application: 'Sideburn Whiskylaug API', version: '1.0' });
  });

  app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
  });
});
