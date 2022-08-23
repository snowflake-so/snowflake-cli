// import { Job } from "@snowflake-so/snowflake-sdk";
import SafeCommandService from '../services/safe-command-service';
import ConfigCommandService from '../services/config-command-service';
import { CommandLayout } from '../types';
import { log, logError, logSuccess } from '../utils/log';
import { SafeType } from '@snowflake-so/safe-sdk';
import { serializeSafeData } from '../utils/safe';
import { PublicKey } from '@solana/web3.js';

const OwnedSafesGetAllCommand: CommandLayout = {
  command: 'get',
  description: 'Get owned safes',
  optionLayout: {
    options: [
      {
        option: '--latest',
        description: 'Get latest safe',
      },
      {
        option: '--limit <LIMIT>',
        description: 'Limit number of safes',
      },
      {
        option: '--offset <OFFSET>',
        description: 'Offset number of safes',
      },
      {
        option: '-p, --pretty',
        description: 'Pretty print',
      },
      {
        option: '-t, --table',
        description: 'Print safe data as a table',
      },
      {
        option: '-f, --fields [FIELDS]',
        description: 'Fields to display',
      },
      {
        option: '--address [SAFE_ADDRESS]',
        description: 'Onchain address of the filtered safe',
      },
    ],
    action: async args =>
      await ConfigCommandService.require(
        args,
        async ({ latest, limit, offset, pretty, fields, table, address }: any) => {
          try {
            const serviceInstance = await SafeCommandService.instance();
            if (address) {
              const safe = await serviceInstance.getSafe(address);
              logSuccess(safe.safeAddress.toString(), 'Found safe');
              if (args.table) {
                console.table(safe);
                return;
              }
              log(safe);
              return;
            } else {
              const walletAddress = await ConfigCommandService.getConfigWalletAddress();
              let ownedSafes: Partial<SafeType>[] = await serviceInstance.getOwnedSafes(
                walletAddress
              );
              ownedSafes = ownedSafes.sort(
                (s1: any, s2: any) => s1.createdAt.toNumber() - s2.createdAt.toNumber()
              );
              if (offset) {
                ownedSafes = ownedSafes.slice(offset);
              }
              if (limit) {
                ownedSafes = ownedSafes.slice(0, limit);
              }
              if (pretty) {
                ownedSafes = serializeSafeData(ownedSafes as any);
              }
              if (fields) {
                const fieldsArray = fields.split(',');
                ownedSafes = ownedSafes.map<Partial<SafeType>>((ownedSafe: any) => {
                  const newOwnedSafes: any = {};
                  fieldsArray.forEach((field: string) => {
                    if (!ownedSafe[field]) {
                      throw new Error(`Field not found ${field}`);
                    }
                    newOwnedSafes[field] = ownedSafe[field];
                  });
                  return newOwnedSafes;
                });
              }
              if (latest) {
                ownedSafes = [ownedSafes[0]];
              } else {
                logSuccess(ownedSafes.length.toString(), 'Found', 'safes');
              }
              if (table) {
                console.table(ownedSafes);
                return;
              }
              log(ownedSafes);
              return;
            }
          } catch (error: any) {
            logError(error.message, 'Error:');
          }
        }
      ),
  },
};

const SafeWatchCommand: CommandLayout = {
  command: 'watch',
  description: 'Watch safe changes',
  argumentLayout: {
    arguments: [
      {
        argument: '[safeAddress]',
        description: 'Address of the safe',
      },
    ],
  },
  action: async args =>
    await ConfigCommandService.require(args, async (safeAddress: string) => {
      try {
        const serviceInstance = await SafeCommandService.instance();
        const publicKey = new PublicKey(safeAddress);
        await serviceInstance.watchSafe(publicKey, data => {
          log(data);
        });
        return;
      } catch (error: any) {
        logError(error.message, 'Error:');
      }
    }),
};

export default {
  command: 'safe',
  description: 'Manage safes',
  commands: [OwnedSafesGetAllCommand, SafeWatchCommand],
};
