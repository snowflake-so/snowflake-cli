import { AnchorProvider, Idl, Program, Wallet } from '@project-serum/anchor';
import {
  SnowflakeSafe,
  SNOWFLAKE_SAFE_IDL,
  SNOWFLAKE_SAFE_PROGRAM_ID,
} from '@snowflake-so/safe-sdk';
import { Connection, Keypair } from '@solana/web3.js';
import fs from 'fs';

export const initSnowflake = (keypair: Keypair, rpcUrl: string) => {
  const provider = initProvider(keypair, rpcUrl);
  const snowflake = new SnowflakeSafe(provider);
  return snowflake;
};

export const initProvider = (keypair: Keypair, rpcUrl: string) => {
  const connection = new Connection(rpcUrl);
  const wallet = new Wallet(keypair);
  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());

  return provider;
};

export const initSnowflakeProgram = (keypair: Keypair, rpcUrl: string) => {
  const provider = initProvider(keypair, rpcUrl);
  const program = new Program(SNOWFLAKE_SAFE_IDL as Idl, SNOWFLAKE_SAFE_PROGRAM_ID, provider);
  return program;
};

export const loadKeypairFromLocalPath = (path: string): Keypair => {
  const operatorSecret = fs.readFileSync(path, {
    encoding: 'utf8',
  });
  const parsedSecret = JSON.parse(operatorSecret);
  const secretByteArray = Uint8Array.from(parsedSecret);
  const operatorKeypair = Keypair.fromSecretKey(secretByteArray);
  return operatorKeypair;
};
