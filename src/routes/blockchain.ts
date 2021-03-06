import express, { Router } from "express";
import { Blockchain } from "../core/blockchain";
import {
  getBlockByHash,
  getBlockByHeight,
  getStarsByOwner,
  requestValidation,
  submitStar,
  validateChain,
} from "../controllers/blockchain";

export const getBlockChainRouter = (blockchain: Blockchain): Router => {
  const router = express.Router();
  router.get("/blocks/height/:height", getBlockByHeight(blockchain));
  router.get("/blocks/hash/:hash", getBlockByHash(blockchain));
  router.get("/blocks/:address", getStarsByOwner(blockchain));
  router.post("/requestValidation", requestValidation(blockchain));
  router.post("/submitStart", submitStar(blockchain));
  router.post("/validateChain", validateChain(blockchain));
  return router;
};

export default {
  getBlockChainRouter,
};
