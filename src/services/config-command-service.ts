import { loadKeypairFromLocalPath } from '../utils/snowflake';
import { EndpointConstant } from '../constants';
import {
  SNOWFLAKE_CLI_FEE_ACCOUNT,
  SNOWFLAKE_CLI_KEYPAIR_PATH,
  SNOWFLAKE_CLI_RPC_URL,
  SNOWFLAKE_CLI_WALLET_ADDRESS,
} from '../constants/db-key';
import db from '../utils/db';
import { Keypair } from '@solana/web3.js';
import { logError } from '../utils/log';

export default class ConfigCommandService {
  static async setConfigUrl(url: string) {
    try {
      const endpoint = (EndpointConstant as any)[url];
      if (endpoint) {
        await db.put(SNOWFLAKE_CLI_RPC_URL, endpoint);
      } else {
        await db.put(SNOWFLAKE_CLI_RPC_URL, url);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async getConfigUrl(): Promise<string> {
    try {
      const rpcURL = await db.get(SNOWFLAKE_CLI_RPC_URL);
      return rpcURL;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async setConfigKeypair(keypairPath: string) {
    try {
      await db.put(SNOWFLAKE_CLI_KEYPAIR_PATH, keypairPath);
      const loadedKeypair: Keypair = loadKeypairFromLocalPath(keypairPath);
      const walletAddress = loadedKeypair.publicKey.toBase58();
      await db.put(SNOWFLAKE_CLI_WALLET_ADDRESS, walletAddress);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async getConfigKeypair(): Promise<string> {
    try {
      const keypairPath = await db.get(SNOWFLAKE_CLI_KEYPAIR_PATH);
      return keypairPath;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async setConfigWalletAddress(address: string) {
    try {
      await db.put(SNOWFLAKE_CLI_WALLET_ADDRESS, address);
      const walletAddress = await db.get(SNOWFLAKE_CLI_WALLET_ADDRESS);
      return walletAddress;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async getConfigWalletAddress(): Promise<string> {
    try {
      const walletAddress = await db.get(SNOWFLAKE_CLI_WALLET_ADDRESS);
      return walletAddress;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async getConfigFeeAccount(): Promise<string> {
    try {
      const feeAccount = await db.get(SNOWFLAKE_CLI_FEE_ACCOUNT);
      return feeAccount;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async clearConfig() {
    try {
      await db.clear();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async getConfig(): Promise<Record<string, string>> {
    try {
      const [rpcUrl, keypairPath, walletAddress] = await Promise.allSettled([
        this.getConfigUrl(),
        this.getConfigKeypair(),
        this.getConfigWalletAddress(),
      ]);

      return {
        'RPC URL': rpcUrl.status === 'fulfilled' ? rpcUrl.value : 'Not set',
        'Keypair path': keypairPath.status === 'fulfilled' ? keypairPath.value : 'Not set',
        'Wallet address': walletAddress.status === 'fulfilled' ? walletAddress.value : 'Not set',
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async require(args: any, next: any) {
    try {
      await ConfigCommandService.getConfigUrl();
      await ConfigCommandService.getConfigKeypair();
      return next(args);
    } catch (error) {
      logError('Please set Snowflake CLI configuration first!', 'Configuration Error: ');
    }
  }
}
