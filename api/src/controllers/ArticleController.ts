import express, { Request, Response } from 'express';
import { jsonParser } from '../index';
import { Article } from '../models/Article';
import { ArticleService } from '../services/ArticleService';
import { auth, requiredScopes, claimCheck, claimEquals, claimIncludes, JWTPayload } from 'express-oauth2-jwt-bearer';
import { Tools } from  '../tools';

export class ArticleController {
  private _checkJwt: express.Handler;
  private _app: express.Application;
  private _articleService: ArticleService;

  private _hasWriteAccess = claimCheck((payload: any) => {
    const res = (payload.permissions && payload.permissions.includes('write:articles'));
    return res;
  });

  private _isArticleWriter(req: Request): boolean {
    return (req.auth?.payload as any)?.permissions?.includes('write:articles');
  }

  private _hasPublishAccess = claimCheck((payload: any) => {
    const res = (payload.permissions && payload.permissions.includes('publish:articles'));
    return res;
  });

  private _isArticlePublisher(req: Request): boolean {
    return (req.auth?.payload as any)?.permissions?.includes('publish:articles');
  }

  constructor(app: express.Application, checkJwt: express.Handler, articleService: ArticleService) {
    this._app = app;
    this._articleService = articleService;
    this._checkJwt = checkJwt;
  }

  public start() {
    this._app.get('/articles', async (req: Request, res: Response) => {
      const descending = Tools.getBoolean(req.query.descending);
      const articles = await this._articleService.getArticles('published', '', descending);
      res.send(articles);
    });

    this._app.get('/articles/active', async (req: Request, res: Response) => {
      const descending = Tools.getBoolean(req.query.descending);
      const articles = await this._articleService.getArticles('active', '', descending);
      res.send(articles);
    });

    this._app.get('/articles/unpublished', this._checkJwt, this._hasWriteAccess, async (req: Request, res: Response) => {
      const descending = Tools.getBoolean(req.query.descending);
      const user = req.auth?.payload['https://sideburnwhisky.no/email'] as string;
      const articles = await this._articleService.getArticles('unpublished', user, descending);
      res.send(articles);
    });

    this._app.get('/articles/unpublished/all', this._checkJwt, this._hasPublishAccess, async (req: Request, res: Response) => {
      const descending = Tools.getBoolean(req.query.descending);
      const articles = await this._articleService.getArticles('unpublished', '', descending);
      res.send(articles);
    });

    this._app.get('/articles/:id', async (req: Request, res: Response) => {
      const articles = await this._articleService.getArticle(req.params.id);
      res.send(articles);
    });

    this._app.delete('/articles/:id', this._checkJwt, this._hasWriteAccess, async (req: Request, res: Response) => {
      const user = req.auth?.payload['https://sideburnwhisky.no/email'] as string;
      const article = await this._articleService.getArticle(req.params.id);
      if (article?.author !== user && !this._isArticlePublisher(req)) {
        res.sendStatus(403);
      } else {
        if (await this._articleService.deleteArticle(req.params.id, article?._rev as string)) {
          res.sendStatus(204);
        }
        else {
          res.sendStatus(400);
        }
      }
    });

    this._app.post('/articles/:id?', this._checkJwt, jsonParser, async (req: Request, res: Response) => {
      const articleId = req.params.id as string;
      const user = req.auth?.payload['https://sideburnwhisky.no/email'] as string;
      let article = new Article('');
      Object.assign(article, req.body);
      if (article?.author !== user && !this._isArticlePublisher(req)) {
        res.sendStatus(403);
      } else {
        try {
          if (articleId) {
            article._id = articleId;
          }
          const result = await this._articleService.saveArticle(article);
          res.header('Content-Location', '/articles/' + result._id).status(articleId ? 200 : 201).send(result);
        } catch (error: any) {
          res.status(error.statusCode).send(error);
        }
      }
    });

    this._app.put('/articles/:id', this._checkJwt, this._hasWriteAccess, jsonParser, async (req: Request, res: Response) => {
      const articleId = req.params.id as string;
      const user = req.auth?.payload['https://sideburnwhisky.no/email'] as string;
      let article = new Article('');
      Object.assign(article, req.body);
      if (article?.author !== user && !this._isArticlePublisher(req)) {
        res.sendStatus(403);
      } else {
        try {
          article._id = articleId;
          const result = await this._articleService.saveArticle(article);
          res.header('Content-Location', '/articles/' + result._id).status(204).send('');
        } catch (error: any) {
          res.status(error.statusCode).send(error);
        }
      }
    });

    this._app.get('/articles/:id/publish', this._checkJwt, this._hasWriteAccess, async (req: Request, res: Response) => {
      const articleId = req.params.id as string;
      const user = req.auth?.payload['https://sideburnwhisky.no/email'] as string;
      const article = await this._articleService.getArticle(articleId) as Article;
      if(!article){
        res.sendStatus(404);
      }
      if (article?.author !== user && !this._isArticlePublisher(req)) {
        res.sendStatus(403);
      } else {
        try {
          article.published = true;
          article.datePublished = new Date();
          const result = await this._articleService.saveArticle(article);
          res.send(result);
        } catch (error: any) {
          res.status(error.statusCode).send(error);
        }
      }
    });

    this._app.get('/articles/:id/unpublish', this._checkJwt, this._hasWriteAccess, async (req: Request, res: Response) => {
      const articleId = req.params.id as string;
      const user = req.auth?.payload['https://sideburnwhisky.no/email'] as string;
      const article = await this._articleService.getArticle(articleId) as Article;
      if(!article){
        res.sendStatus(404);
      }
      if (article?.author !== user && !this._isArticlePublisher(req)) {
        res.sendStatus(403);
      } else {
        try {
          article.published = false;
          const result = await this._articleService.saveArticle(article);
          res.send(result);
        } catch (error: any) {
          res.status(error.statusCode).send(error);
        }
      }
    });
  }
}
