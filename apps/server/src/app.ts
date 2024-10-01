import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import router from './routes';
import { errorHandler } from './middlewares/error';
import path from 'path';
import { isAuthenticated, isOwner } from './middlewares';

export const startServer = () => {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL ?? 'http://localhost:4200',
    })
  );
  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.json());

  app.use('/', router());
  app.use(
    '/assets/uploads/:id/:imageName',
    isAuthenticated,
    isOwner,
    (req, res) => {
      const { id, imageName } = req.params;
      const imagePath = path.join(
        __dirname,
        'assets',
        'uploads',
        id,
        imageName
      );
      res.sendFile(imagePath);
    }
  );

  app.use(errorHandler);

  const port = process.env.PORT || 8080;
  const url = process.env.URL || 'localhost';

  const server = app.listen(port, () => {
    console.log(`Listening at http://${url}:${port}/`);
  });

  server.on('error', console.error);
};
