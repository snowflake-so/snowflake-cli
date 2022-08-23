import { SNOWFLAKE_CLI_KEYPAIR_PATH, SNOWFLAKE_CLI_RPC_URL } from '../constants/db-key';
import db from '../utils/db';
import { initSnowflake, initSnowflakeProgram, loadKeypairFromLocalPath } from '../utils/snowflake';
import { PublicKey } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';
import { MultisigJob, SnowflakeSafe } from '@snowflake-so/safe-sdk';

export default class ProposalCommandService {
  snowflake: SnowflakeSafe;
  program: Program;

  static async instance(): Promise<ProposalCommandService> {
    const rpcUrl = await db.get(SNOWFLAKE_CLI_RPC_URL);
    const keypairPath = await db.get(SNOWFLAKE_CLI_KEYPAIR_PATH);
    const keypair = loadKeypairFromLocalPath(keypairPath);
    const snowflake = initSnowflake(keypair, rpcUrl);
    const program = initSnowflakeProgram(keypair, rpcUrl);

    return new ProposalCommandService(snowflake, program);
  }

  constructor(private _snowflake: SnowflakeSafe, private _program: Program) {
    this.snowflake = this._snowflake;
    this.program = this._program;
  }

  async getSafeProposals(safeAddress: string): Promise<MultisigJob[]> {
    try {
      const publicKey = new PublicKey(safeAddress);
      const jobs = await this.snowflake.fetchAllProposals(publicKey);
      return jobs;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getProposalByAddress(proposalAddress: PublicKey): Promise<MultisigJob> {
    try {
      const publicKey = new PublicKey(proposalAddress);
      const job = await this.snowflake.fetchProposal(publicKey);
      return job;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteProposal(publicKey: string): Promise<string> {
    try {
      const pubkey = new PublicKey(publicKey);
      const tx = await this.snowflake.deleteProposal(pubkey);

      return tx;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async approveProposal(publicKey: string): Promise<string> {
    try {
      const pubkey = new PublicKey(publicKey);
      const tx = await this.snowflake.approveProposal(pubkey);

      return tx;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async rejectProposal(publicKey: string): Promise<string> {
    try {
      const pubkey = new PublicKey(publicKey);
      const tx = await this.snowflake.rejectProposal(pubkey);

      return tx;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async executeProposal(publicKey: string): Promise<string> {
    try {
      const pubkey = new PublicKey(publicKey);
      const tx = await this.snowflake.executeProposal(pubkey);

      return tx;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
