import SHA256 from "crypto-js/sha256";

export class Block {
  height: string;

  timeStamp: string;

  body: string;

  previousHash: string;

  hash: string;

  constructor({
    height = "",
    data = "",
    previousHash = "",
  }: {
    height: string;
    data: string;
    previousHash: string;
  }) {
    this.height = height;
    this.previousHash = previousHash;
    this.body = Buffer.from(JSON.stringify(data)).toString("hex");
    this.timeStamp = new Date().getTime().toString().slice(0, -3);
    this.hash = this.generateBlockHash();
  }

  private generateBlockHash = (): string => {
    const blockData = {
      height: this.height,
      timeStamp: this.timeStamp,
      body: this.body,
      previousHash: this.previousHash,
    };
    return SHA256(JSON.stringify(blockData)).toString();
  };

  validate = async (): Promise<boolean> => {
    const prevHash = this.hash;
    this.hash = this.generateBlockHash();
    return prevHash === this.hash;
  };

  getData = async () => {
    if (this.height === "0") {
      throw new Error("Can not obtain data from genesis block");
    }
    const decodedString = Buffer.from(this.body, "hex").toString("ascii");
    return JSON.parse(decodedString);
  };
}

export default Block;
