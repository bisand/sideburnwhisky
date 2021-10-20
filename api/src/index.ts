import express, { Request, Response } from 'express';
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
import { User } from './models/User';
import { DataService } from './services/DataService';
import { DatabaseConfig } from "./services/DatabaseConfig";
import { UserService } from './services/UserService';
import { HttpError } from './models/HttpError';

dotenv.config();
var jsonParser = bodyParser.json()

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
  const userService = new UserService(dataService);

  const app: express.Application = express();
  const port: number = 8080;

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
  });

  app.get('/users', async (req: Request, res: Response) => {
    const users = await userService.getUsers();
    res.send(users);
  });

  app.get('/users/active', async (req: Request, res: Response) => {
    const users = await userService.getActiveUsers();
    res.send(users);
  });

  app.put('/users/', jsonParser, async (req: Request, res: Response) => {
    let user = new User();
    Object.assign(user, req.body);
    try {
      const id = await userService.saveUser(user);
      res.send({ id });
    } catch (error: any) {
      res.status(error.statusCode).send(error);
    }
  });

  app.get('/:name', (req: Request, res: Response) => {
    res.send(`Hello ${req.param('name', 'Mark')}`);
  });


  app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
  });
});
