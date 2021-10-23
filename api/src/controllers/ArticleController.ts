import express, { Request, Response } from 'express';
import { jsonParser } from '../index';
import { ArticleService } from '../services/ArticleService';


export class ArticleController {
  private _app: express.Application;
  private _articleService: ArticleService;
  constructor(app: express.Application, articleService: ArticleService) {
    this._app = app;
    this._articleService = articleService;
  }

  public start() {
    this._app.get('/articles', async (req: Request, res: Response) => {
      const articles = await this._articleService.getArticles();
      res.send(articles);
    });

    this._app.get('/articles/active', async (req: Request, res: Response) => {
      // const users = await this._articleService.getActiveUsers();
      // res.send(users);
    });

    this._app.put('/articles/', jsonParser, async (req: Request, res: Response) => {
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
