import { CommandLayout } from '../types';
import { logError, logSuccess } from '../utils/log';
import ConfigCommandService from '../services/config-command-service';

const ConfigGetCommand: CommandLayout = {
  command: 'get',
  description: 'Get Snowflake CLI configuration',
  action: async () => {
    try {
      const config = await ConfigCommandService.getConfig();
      console.table(config);
    } catch (error: any) {
      logError(error.message, 'Error:');
    }
  },
};

const ConfigSetCommand: CommandLayout = {
  command: 'set',
  description: 'Set Snowflake CLI configuration',
  optionLayout: {
    options: [
      {
        option: '--url <RPC_URL>',
        description: 'Set URL to Solana RPC endpoint',
      },
      {
        option: '--keypair <PATH_TO_KEYPAIR>',
        description: 'Set path to keypair',
      },
    ],
    action: async (args: any) => {
      try {
        const { url, keypair } = args;
        if (url) {
          await ConfigCommandService.setConfigUrl(url);
          const rpcUrl = await ConfigCommandService.getConfigUrl();
          logSuccess(rpcUrl, 'RPC URL set to');
        }
        if (keypair) {
          await ConfigCommandService.setConfigKeypair(keypair);
          const keypairPath = await ConfigCommandService.getConfigKeypair();
          logSuccess(keypairPath, 'Keypair set to');
        }
        return;
      } catch (error: any) {
        logError(error.message);
      }
    },
  },
};

export default {
  command: 'config',
  description: 'Configure Snowflake CLI',
  commands: [ConfigGetCommand, ConfigSetCommand],
};
