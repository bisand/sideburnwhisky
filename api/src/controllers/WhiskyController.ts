import express, { Request, Response } from 'express';
import { jsonParser } from '../index';
import { WhiskyService } from '../services/WhiskyService';


export class WhiskyController {
  private _app: express.Application;
  private _whiskyService: WhiskyService;
  constructor(app: express.Application, whiskyService: WhiskyService) {
    this._app = app;
    this._whiskyService = whiskyService;
  }

  public start() {
    this._app.get('/whiskys', async (req: Request, res: Response) => {
      const articles = await this._whiskyService.getWhiskys();
      res.send(articles);
    });

    this._app.get('/whiskys/active', async (req: Request, res: Response) => {
      // const articles = await this._whiskyService.getReviews();
      // res.send(articles);
    });

    this._app.put('/whiskys/', jsonParser, async (req: Request, res: Response) => {
      // let user = new User();
      // Object.assign(user, req.body);
      // try {
      //   const id = await this._articleService.saveUser(user);
      //   res.send({ id });
      // } catch (error: any) {
      //   res.status(error.statusCode).send(error);
      // }
    });
  }
}
