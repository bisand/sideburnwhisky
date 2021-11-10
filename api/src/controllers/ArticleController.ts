import express, { Request, Response } from 'express';
import { jsonParser } from '../index';
import { Article } from '../models/Article';
import { ArticleService } from '../services/ArticleService';
import { auth, requiredScopes, claimCheck, claimEquals, claimIncludes, JWTPayload } from 'express-oauth2-jwt-bearer';

export class ArticleController {
  private _checkJwt: express.Handler;
  private _app: express.Application;
  private _articleService: ArticleService;

  private _isArticleWriter = claimCheck((payload: any) => {
    const res = (payload.permissions && payload.permissions.includes('write:articles'));
    return res;
  });

  private _isArticlePublisher = claimCheck((payload: any) => {
    const res = (payload.permissions && payload.permissions.includes('publish:articles'));
    return res;
  });

  constructor(app: express.Application, checkJwt: express.Handler, articleService: ArticleService) {
    this._app = app;
    this._articleService = articleService;
    this._checkJwt = checkJwt;
  }

  public start() {
    this._app.get('/articles', async (req: Request, res: Response) => {
      const articles = await this._articleService.getArticles('published');
      res.send(articles);
    });

    this._app.get('/articles/active', async (req: Request, res: Response) => {
      const articles = await this._articleService.getArticles('active');
      res.send(articles);
    });

    this._app.get('/articles/unpublished', this._checkJwt, this._isArticleWriter, async (req: Request, res: Response) => {
      const user = req.auth?.payload['https://sideburnwhisky.no/email'] as string;
      const articles = await this._articleService.getArticles('unpublished', user);
      res.send(articles);
    });

    this._app.get('/articles/unpublished/all', this._checkJwt, this._isArticlePublisher, async (req: Request, res: Response) => {
      const articles = await this._articleService.getArticles('unpublished');
      res.send(articles);
    });

    this._app.get('/articles/:id', async (req: Request, res: Response) => {
      const articles = await this._articleService.getArticle(req.params.id);
      res.send(articles);
    });

    this._app.post('/articles/', this._checkJwt, jsonParser, async (req: Request, res: Response) => {
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
