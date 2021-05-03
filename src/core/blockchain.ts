import bitcoinMessage from "bitcoinjs-message";
import { Block } from "./block";

export class Blockchain {
  chain: Array<Block>;

  constructor() {
    this.chain = [];
    this.initializeChain();
  }

  initializeChain() {
    if (this.chain.length === 0) {
      this.addBlock({ data: "Genesis Block" });
    }
  }

  getLatestBlock(): Block | null {
    if (this.chain.length === 0) {
      return null;
    }
    return this.chain[this.chain.length - 1];
  }

  getBlockchainHeight(): string {
    return `${this.chain.length}`;
  }

  private addBlock = (data: any): Block => {
    const previousBlock = this.getLatestBlock();
    const previousHash = previousBlock ? previousBlock.hash : "";
    const height = this.getBlockchainHeight();
    const block = new Block({
      height,
      previousHash,
      data,
    });
    this.chain.push(block);
    return block;
  };

  requestMessageOwnershipVerification = async (
    address: string
  ): Promise<string> => {
    return `${address}:${new Date()
      .getTime()
      .toString()
      .slice(0, -3)}:starRegistry`;
  };

  private isMessageTimeValid = (message: string) => {
    const messageTime = parseInt(message.split(":")[1], 10);
    const currentTime = parseInt(
      new Date().getTime().toString().slice(0, -3),
      10
    );
    const timeDiff = currentTime - messageTime;
    return timeDiff < 5 * 60;
  };

  private isBitcoinMessageValid = (
    message: string,
    address: string,
    signature: string
  ) => {
    return bitcoinMessage.verify(message, address, signature, undefined, true);
  };

  submitStar = async (
    address: string,
    message: string,
    signature: string,
    star: { dec: string; ra: string; story: string }
  ): Promise<Block> => {
    if (!this.isMessageTimeValid(message)) {
      throw new Error(
        "Message expired, you need to sign up to 5 min after requesting the message."
      );
    }
    if (!this.isBitcoinMessageValid(message, address, signature)) {
      throw new Error("Invalid wallet address or signature");
    }
    return this.addBlock({
      address,
      message,
      signature,
      star,
    });
  };

  getBlockByHash = async (hash: string): Promise<Block | undefined> => {
    return this.chain.find((b) => b.hash === hash);
  };

  getBlockByHeight = async (height: string): Promise<Block | undefined> => {
    return this.chain.find((b) => b.height === height);
  };

  getStarsByWalletAddress = async (
    address: string
  ): Promise<Array<{ dec: string; ra: string; story: string }>> => {
    const stars = (
      await Promise.all(
        this.chain
          .filter((b, i) => i > 0)
          .map(async (block: Block) => {
            const blockData = await block.getData();
            return blockData;
          })
      )
    )
      .filter((blockData) => {
        return blockData.address === address && blockData.star;
      })
      .map((b) => ({ ...b.star }));
    return stars;
  };

  validateChain = async (): Promise<Array<Block & { error: string }>> => {
    const errorLog = await Promise.all(
      this.chain.map(async (block: Block, i: number) => {
        if (i === 0) {
          return null;
        }
        const isValid = async (
          currentBlock: Block,
          nextBlock: Block | undefined
        ) => {
          if (!nextBlock) {
            return currentBlock.validate();
          }
          return (
            (await currentBlock.validate()) &&
            currentBlock.hash === nextBlock.previousHash
          );
        };
        const isBlockValid = await isValid(block, this.chain[i + 1]);
        return isBlockValid
          ? null
          : {
              ...block,
              error: "Block has been tampered.",
            };
      })
    );
    return errorLog.filter((e: any) => !!e) as Array<Block & { error: string }>;
  };
}

export default Block;
