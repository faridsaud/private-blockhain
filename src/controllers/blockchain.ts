import { RequestHandler } from "express";
import { Blockchain } from "../core/blockchain";

export const getBlockByHeight = (
  blockchain: Blockchain
): RequestHandler<any> => {
  return async (req: any, res: any) => {
    if (!req.params.height) {
      return res.status(400).send("Review the Parameters!");
    }
    try {
      const { height } = req.params;
      const block = await blockchain.getBlockByHeight(height);
      if (!block) {
        return res.status(404).send("Block Not Found!");
      }
      return res.status(200).json(block);
    } catch (e) {
      return res.status(500).send(e.message);
    }
  };
};

export const requestValidation = (
  blockchain: Blockchain
): RequestHandler<any> => {
  return async (req: any, res: any) => {
    if (!req.body.address) {
      return res.status(400).send("Review the Parameters!");
    }
    try {
      const { address } = req.body;
      const message = await blockchain.requestMessageOwnershipVerification(
        address
      );
      return res.status(200).json(message);
    } catch (e) {
      return res.status(500).send(e.message);
    }
  };
};

export const submitStar = (blockchain: Blockchain): RequestHandler<any> => {
  return async (req: any, res: any) => {
    if (
      !req.body.address ||
      !req.body.message ||
      !req.body.signature ||
      !req.body.star
    ) {
      return res.status(400).send("Review the Parameters!");
    }
    try {
      const { address, message, signature, star } = req.body;
      const block = await blockchain.submitStar(
        address,
        message,
        signature,
        star
      );
      if (block) {
        return res.status(200).json(block);
      }
      return res.status(500).send("An error happened!");
    } catch (e) {
      return res.status(500).send(e.message);
    }
  };
};

export const getBlockByHash = (blockchain: Blockchain): RequestHandler<any> => {
  return async (req: any, res: any) => {
    if (!req.params.hash) {
      return res.status(400).send("Review the Parameters!");
    }
    try {
      const { hash } = req.params;
      const block = await blockchain.getBlockByHash(hash);
      if (block) {
        return res.status(200).json(block);
      }
      return res.status(404).send("Block Not Found!");
    } catch (e) {
      return res.status(500).send(e.message);
    }
  };
};

export const getStarsByOwner = (
  blockchain: Blockchain
): RequestHandler<any> => {
  return async (req: any, res: any) => {
    if (!req.params.address) {
      return res.status(400).send("Review the Parameters!");
    }
    try {
      const { address } = req.params;
      const stars = await blockchain.getStarsByWalletAddress(address);
      if (stars) {
        return res.status(200).json(stars);
      }
      return res.status(404).send("Block Not Found!");
    } catch (e) {
      return res.status(500).send(e.message);
    }
  };
};

export const validateChain = (blockchain: Blockchain): RequestHandler<any> => {
  return async (req: any, res: any) => {
    try {
      const errors = await blockchain.validateChain();
      return res.status(200).json({ errors });
    } catch (e) {
      return res.status(500).send(e.message);
    }
  };
};

export default {
  getStarsByOwner,
  getBlockByHash,
  getBlockByHeight,
  requestValidation,
  submitStar,
};
