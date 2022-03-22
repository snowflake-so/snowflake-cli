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
import { Job, Snowflake } from "@snowflake-so/snowflake-sdk";
import { Program } from "@project-serum/anchor";

export default class JobCommandService {
  snowflake: Snowflake;
  program: Program;

  static async instance(): Promise<JobCommandService> {
    const rpcUrl = await db.get(SNOWFLAKE_CLI_RPC_URL);
    const keypairPath = await db.get(SNOWFLAKE_CLI_KEYPAIR_PATH);
    const keypair = loadKeypairFromLocalPath(keypairPath);
    const snowflake = initSnowflake(keypair, rpcUrl);
    const program = initSnowflakeProgram(keypair, rpcUrl);

    return new JobCommandService(snowflake, program);
  }

  constructor(private _snowflake: Snowflake, private _program: Program) {
    this.snowflake = this._snowflake;
    this.program = this._program;
  }

  async deleteJob(publicKey: string): Promise<string> {
    try {
      const pubkey = new PublicKey(publicKey);
      const tx = await this.snowflake.deleteJob(pubkey);

      return tx;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getGlobalJob(): Promise<Job[]> {
    try {
      const jobs = await this.snowflake.findGlobal();
      return jobs;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async watchJob(jobPubkey: PublicKey, callback: (account: any) => void) {
    try {
      const event = this.program.account.flow.subscribe(jobPubkey);
      return event.on("change", callback);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getJobsByOwner(owner: string): Promise<Job[]> {
    try {
      const ownerAddress = new PublicKey(owner);
      const jobs = await this.snowflake.findByOwner(ownerAddress);
      return jobs;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getJobByPublicKey(publicKey: string): Promise<Job> {
    try {
      const pubkey = new PublicKey(publicKey);
      const job = await this.snowflake.fetch(pubkey);

      return job;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
