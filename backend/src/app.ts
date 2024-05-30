import cors from 'cors';
import express from 'express';
import { Server } from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';

import config from './config';
import routes from './routes';
import { genericErrorHandler, routeNotFound } from './middlewares/error-handler.middleware';

export class App {
  public app: express.Application;
  public port: string | number;

  constructor() {
    this.app = express();
    this.port = config.app.port;

    this.loadMiddlewares();
    this.loadRoutes();
    this.loadErrorHandling();
  }

  public listen(port: string | number = this.port): Server {
    return this.app.listen(port, () => console.log(`Application running on ${config.app.url}`));
  }

  private loadMiddlewares(): void {
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(bodyParser.json());
  }

  private loadRoutes(): void {
    this.app.use('/api', routes);
  }

  private loadErrorHandling(): void {
    this.app.use(routeNotFound);
    this.app.use(genericErrorHandler);
  }
}
