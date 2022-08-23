import { SNOWFLAKE_CLI_KEYPAIR_PATH, SNOWFLAKE_CLI_RPC_URL } from '../constants/db-key';
import db from '../utils/db';
import { initSnowflake, initSnowflakeProgram, loadKeypairFromLocalPath } from '../utils/snowflake';
import { PublicKey } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';
import { SafeType, SnowflakeSafe } from '@snowflake-so/safe-sdk';

export default class SafeCommandService {
  snowflake: SnowflakeSafe;
  program: Program;

  static async instance(): Promise<SafeCommandService> {
    const rpcUrl = await db.get(SNOWFLAKE_CLI_RPC_URL);
    const keypairPath = await db.get(SNOWFLAKE_CLI_KEYPAIR_PATH);
    const keypair = loadKeypairFromLocalPath(keypairPath);
    const snowflake = initSnowflake(keypair, rpcUrl);
    const program = initSnowflakeProgram(keypair, rpcUrl);

    return new SafeCommandService(snowflake, program);
  }

  constructor(private _snowflake: SnowflakeSafe, private _program: Program) {
    this.snowflake = this._snowflake;
    this.program = this._program;
  }

  async getOwnedSafes(publicKey: string): Promise<SafeType[]> {
    try {
      const pubkey = new PublicKey(publicKey);
      const ownedSafes = await this.snowflake.fetchOwnedSafes(pubkey);

      return ownedSafes;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getSafe(safeAddress: string): Promise<SafeType> {
    try {
      const pubkey = new PublicKey(safeAddress);
      const ownedSafes = await this.snowflake.fetchSafe(pubkey);
      return ownedSafes;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async watchSafe(safePubkey: PublicKey, callback: (account: any) => void) {
    try {
      const event = this.program.account.safe.subscribe(safePubkey);
      return event.on('change', callback);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
