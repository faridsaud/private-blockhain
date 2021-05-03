import express, { Express } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { getBlockChainRouter } from "./routes/blockchain";
import { Blockchain } from "./core/blockchain";

const initExpress = (): Express => {
  const app = express();
  app.set("port", 8000);
  return app;
};

const initBlockchain = (): Blockchain => {
  return new Blockchain();
};

const addMiddlewares = (app: Express): void => {
  app.use(morgan("dev"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
};

const addRoutes = (app: Express, blockchain: Blockchain): void => {
  app.use("/", getBlockChainRouter(blockchain));
};

const startServer = (app: Express) => {
  app.listen(app.get("port"), () => {
    console.log(`Server Listening for port: ${app.get("port")}`);
  });
};

const init = () => {
  const app = initExpress();
  const blockchain = initBlockchain();
  addMiddlewares(app);
  addRoutes(app, blockchain);
  startServer(app);
};

init();
