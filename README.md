# Snowflake Safe CLI

Snowflake CLI provides you a set of commands to interact with the Solana on-chain cron jobs.

Read this article to know more about the CLI: https://medium.com/@snowflake_so/snowflake-cli-is-here-be75840bfbf3

## Installation

Install with NPM

```
npm install -g @snowflake-so/safe-cli
```

Or with Yarn

```
yarn add -G @snowflake-so/safe-cli
```

## How to use the CLI?

```
Usage: snowflake [options] [command]

Snowflake CLI to interact with Snowflake SDK

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  config          Configure Snowflake CLI
  job             Manage job
  jobs            Manage jobs
  account         Manage wallet account
  help [command]  display help for command
```

## Development Guide

To create a new command, go to `src/command` and create a new command following the structure of current commands `config.ts` or `job.ts`.

Add a new command to the command instruction in the `index.ts`

## Command List

### 1. Utility Command

`--help (-h)`: Provides help information

`--version (-v)`: Prints the version number

---

### 2. Get configuration

```
Usage: snowflake config get [options]

Get Snowflake CLI configuration

Options:
  -h, --help  display help for command
```

`config get`: Prints the configuration file

---

### 3. Set configuration

```
Usage: snowflake config set [options]

Set Snowflake CLI configuration

Options:
  --url <RPC_URL>              Set URL to Solana RPC endpoint
  --keypair <PATH_TO_KEYPAIR>  Set path to keypair
  -h, --help                   display help for command
```

`config set`: Sets the configuration file

#### Flags

- `--url <URL>`: Solana Cluster endpoint (mainnet-beta, devnet, testnet)
- `--keypair <PATH_TO_KEYPAIR>`: Path to keypair

---

### 4. Read command

`job get [publicKey]`

#### Parameters

- `publicKey`: Public key of a job

---

### 5. Read all command

```
Usage: snowflake jobs get [options]

Get global jobs

Options:
  --latest                 Get latest job
  --limit <LIMIT>          Limit number of jobs
  --offset <OFFSET>        Offset number of jobs
  --owner <OWNER_ADDRESS>  Get jobs by owner
  -p, --pretty             Pretty print
  -f, --fields [FIELDS]    Fields to display
  -h, --help               display help for command
```

`jobs get`: Get all Jobs

#### Flags

- `--limit <LIMIT>`: Limit number of jobs fetched
- `--offset <OFFSET>`: Offset number of jobs fetched
- `--owner <OWNER_ADDRESS>`: Fetch jobs of provided owner address
- `-p, --pretty`: Prettify the output data
- `-f, --fields`: Specify the fields of the output data

---

### 6. Delete

```
Usage: snowflake job delete [options] [publicKey]

Delete a job

Arguments:
  publicKey   Public key of the job

Options:
  -h, --help  display help for command
```

`job delete [publicKey]`: Deletes a job

#### Parameters

- `publicKey`: Public key of a job

---

### 7. Manage user fee account

```
Usage: snowflake account [options] [command]

Manage wallet account

Options:
  -h, --help        display help for command

Commands:
  pda [publicKey]   Get user account information
  deposit [amount]  Deposit to user fee account
  help [command]    display help for command
```

`account pda [publicKey]`: Get information of the user fee account (Program Derived Address)

#### Parameters

- `publicKey`: Public key of wallet account

`account deposit [amount]`: Deposit an amount of lamports to the user fee account

#### Parameters

- `amount`: Amount of lamports to be deposited

---

## Contact for support

- **Twitter**: https://twitter.com/snowflake_sol

- **Website**: https://snowflake.so/

- **Discord**: https://discord.gg/VjebQgGa

@snowflake-so
