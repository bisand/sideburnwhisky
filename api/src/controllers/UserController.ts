import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { jsonParser } from '../index';


export class UserController {
  private _app: express.Application;
  private _userService: UserService;
  constructor(app: express.Application, userService: UserService) {
    this._app = app;
    this._userService = userService;
  }

  public start() {

    this._app.get('/users', async (req: Request, res: Response) => {
      const users = await this._userService.getUsers();
      res.send(users);
    });

    this._app.get('/users/active', async (req: Request, res: Response) => {
      const users = await this._userService.getActiveUsers();
      res.send(users);
    });

    this._app.put('/users/', jsonParser, async (req: Request, res: Response) => {
      let user = new User();
      Object.assign(user, req.body);
      try {
        const id = await this._userService.saveUser(user);
        res.send({ id });
      } catch (error: any) {
        res.status(error.statusCode).send(error);
      }
    });

    this._app.get('/:name', (req: Request, res: Response) => {
      res.send(`Hello ${req.param('name', 'Mark')}`);
    });
  }
}
