import express, { Request, Response } from 'express';
import { jsonParser } from '../index';
import { ReviewService } from '../services/ReviewService';


export class ReviewController {
  private _app: express.Application;
  private _reviewService: ReviewService;
  constructor(app: express.Application, checkJwt: express.Handler, reviewService: ReviewService) {
    this._app = app;
    this._reviewService = reviewService;
  }

  public start() {
    this._app.get('/reviews', async (req: Request, res: Response) => {
      const articles = await this._reviewService.getReviews();
      res.send(articles);
    });

    this._app.get('/reviews/active', async (req: Request, res: Response) => {
      // const articles = await this._reviewService.getReviews();
      // res.send(articles);
    });

    this._app.put('/reviews/', jsonParser, async (req: Request, res: Response) => {
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
