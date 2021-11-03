import express, { Request, Response } from 'express';
import { jsonParser } from '../index';
import { Article } from '../models/Article';
import { ArticleService } from '../services/ArticleService';
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';


export class ArticleController {
  private _checkScopes = requiredScopes('write:users');
  private _checkJwt: express.Handler;
  private _app: express.Application;
  private _articleService: ArticleService;
  constructor(app: express.Application, checkJwt: express.Handler, articleService: ArticleService) {
    this._app = app;
    this._articleService = articleService;
    this._checkJwt = checkJwt;
  }

  public start() {
    this._app.get('/articles', async (req: Request, res: Response) => {
      const articles = await this._articleService.getArticles('all');
      res.send(articles);
    });

    this._app.get('/articles/active', async (req: Request, res: Response) => {
      const users = await this._articleService.getArticles('active');
      res.send(users);
    });

    this._app.get('/articles/unpublished', async (req: Request, res: Response) => {
      const users = await this._articleService.getArticles('unpublished');
      res.send(users);
    });

    this._app.post('/articles/', this._checkJwt, this._checkScopes, jsonParser, async (req: Request, res: Response) => {
      let r = auth();
      let user = new Article('test');
      Object.assign(user, req.body);
      try {
        const id = await this._articleService.saveArticle(user);
        res.send({ id });
      } catch (error: any) {
        res.status(error.statusCode).send(error);
      }
    });
  }
}
