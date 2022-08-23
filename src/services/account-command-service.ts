import {
  SNOWFLAKE_CLI_KEYPAIR_PATH,
  SNOWFLAKE_CLI_RPC_URL,
} from "../constants/db-key";
import db from "../utils/db";
import {
  initSnowflake,
  initSnowflakeProgram,
  loadKeypairFromLocalPath,
} from "../utils/snowflake";
import { PublicKey } from "@solana/web3.js";
import { Snowflake } from "@snowflake-so/snowflake-sdk";
import { Program } from "@project-serum/anchor";

export default class AccountCommandService {
  snowflake: Snowflake;
  program: Program;

  static async instance(): Promise<AccountCommandService> {
    const rpcUrl = await db.get(SNOWFLAKE_CLI_RPC_URL);
    const keypairPath = await db.get(SNOWFLAKE_CLI_KEYPAIR_PATH);
    const keypair = loadKeypairFromLocalPath(keypairPath);
    const snowflake = initSnowflake(keypair, rpcUrl);
    const program = initSnowflakeProgram(keypair, rpcUrl);

    return new AccountCommandService(snowflake, program);
  }

  constructor(private _snowflake: Snowflake, private _program: Program) {
    this.snowflake = this._snowflake;
    this.program = this._program;
  }

  async getSnowflakePDAForUser(publicKey: string): Promise<PublicKey> {
    try {
      const pubkey = new PublicKey(publicKey);
      const pda = await this.snowflake.getSnowflakePDAForUser(pubkey);

      return pda;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getSnowflakePDAInfo(publicKey: string): Promise<{
    pda: string;
    balance: string;
  }> {
    try {
      const pubkey = new PublicKey(publicKey);
      const pda = await this.snowflake.getSnowflakePDAForUser(pubkey);
      const pdaBalance = await this.snowflake.provider.connection.getBalance(
        pda
      );

      return {
        pda: pda.toString(),
        balance: `${(pdaBalance * 0.000000001).toFixed(5)} SOL`,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async depositFeeAccount(amount: number): Promise<string> {
    try {
      const tx = await this.snowflake.depositFeeAccount(amount);
      return tx;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
