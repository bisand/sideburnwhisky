import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { jsonParser } from '../index';
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';
import jwt from 'express-jwt';


export class UserController {
  private _checkScopes = requiredScopes('write:users');
  private _app: express.Application;
  private _userService: UserService;
  private _checkJwt: jwt.RequestHandler;
  constructor(app: express.Application, checkJwt: jwt.RequestHandler, userService: UserService) {
    this._app = app;
    this._userService = userService;
    this._checkJwt = checkJwt;
  }

  public start() {

    this._app.get('/user/permissions', this._checkJwt, async (req: Request, res: Response) => {
      const users = await this._userService.getUsers();
      res.send(users);
    });

    this._app.get('/users', this._checkJwt, async (req: Request, res: Response) => {
      const users = await this._userService.getUsers();
      res.send(users);
    });

    this._app.get('/users/active', this._checkJwt, async (req: Request, res: Response) => {
      const users = await this._userService.getActiveUsers();
      res.send(users);
    });

    this._app.put('/users/',  this._checkJwt, this._checkScopes, jsonParser, async (req: Request, res: Response) => {
      let user = new User();
      Object.assign(user, req.body);
      try {
        const id = await this._userService.saveUser(user);
        res.send({ id });
      } catch (error: any) {
        res.status(error.statusCode).send(error);
      }
    });
  }
}
