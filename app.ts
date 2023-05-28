require('dotenv').config();
import express, { Express, json } from "express";
import config from 'config';

import Controllers from './controllers';
import DBConnector from './utils/DBConnector';
import GlobalErrorHandler from "./middleware/GlobalErrorHandler";

const port = config.get<number>('server.port');
const databaseConnector = new DBConnector();
const appInstance: Express = express();

appInstance.use(json());

appInstance.use(Controllers.HealthCheckController);
appInstance.use(Controllers.ProductController);
appInstance.use(Controllers.ProductImageController);
appInstance.use(Controllers.OrderController);
appInstance.use(GlobalErrorHandler);

appInstance.listen(port, () => {
  databaseConnector.connect();
  console.log(`Server started on port: ${port}`);
});
