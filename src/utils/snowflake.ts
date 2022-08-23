import { Idl, Program, Provider, Wallet } from "@project-serum/anchor";
import {
  Snowflake,
  SNOWFLAKE_IDL,
  SNOWFLAKE_PROGRAM_ID,
} from "@snowflake-so/snowflake-sdk";
import { Connection, Keypair } from "@solana/web3.js";
import fs from "fs";

export const initSnowflake = (keypair: Keypair, rpcUrl: string) => {
  const provider = initProvider(keypair, rpcUrl);
  const snowflake = new Snowflake(provider);
  return snowflake;
};

export const initProvider = (keypair: Keypair, rpcUrl: string) => {
  const connection = new Connection(rpcUrl);
  const wallet = new Wallet(keypair);
  const provider = new Provider(connection, wallet, Provider.defaultOptions());

  return provider;
};

export const initSnowflakeProgram = (keypair: Keypair, rpcUrl: string) => {
  const provider = initProvider(keypair, rpcUrl);
  const program = new Program(
    SNOWFLAKE_IDL as Idl,
    SNOWFLAKE_PROGRAM_ID,
    provider
  );
  return program;
};

export const loadKeypairFromLocalPath = (path: string): Keypair => {
  const operatorSecret = fs.readFileSync(path, {
    encoding: "utf8",
  });
  const parsedSecret = JSON.parse(operatorSecret);
  const secretByteArray = Uint8Array.from(parsedSecret);
  const operatorKeypair = Keypair.fromSecretKey(secretByteArray);
  return operatorKeypair;
};
