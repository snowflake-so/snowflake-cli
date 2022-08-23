import AccountCommandService from "../services/account-command-service";
import { logError, logSuccess } from "../utils/log";
import ConfigCommandService from "../services/config-command-service";
import { CommandLayout } from "../types";

const AccountInfoCommand: CommandLayout = {
  command: "pda",
  description: "Get user account information",
  argumentLayout: {
    arguments: [
      {
        argument: "[publicKey]",
        description: "Public key of the account",
      },
    ],
    action: async (publicKey: string) =>
      await ConfigCommandService.require(publicKey, async () => {
        try {
          const serviceInstance = await AccountCommandService.instance();
          const info = await serviceInstance.getSnowflakePDAInfo(publicKey);
          console.table({
            "Fee account": info.pda,
            "Fee account Balance": info.balance,
          });
          return;
        } catch (error: any) {
          logError(error.message, "Error:");
        }
      }),
  },
};

const AccountDepositCommand: CommandLayout = {
  command: "deposit",
  description: "Deposit to user fee account",
  argumentLayout: {
    arguments: [
      {
        argument: "[amount]",
        description: "Amount of lamports to deposit",
      },
    ],
    action: async (amount: number) => {
      await ConfigCommandService.require(amount, async () => {
        try {
          const walletAddress =
            await ConfigCommandService.getConfigWalletAddress();
          const userFeeAccount =
            await ConfigCommandService.getConfigFeeAccount();
          const serviceInstance = await AccountCommandService.instance();
          const tx = await serviceInstance.depositFeeAccount(amount);
          logError(
            `- ${amount} lamports`,
            `Account ${walletAddress} balance changed:`
          );
          logSuccess(
            `+ ${amount} lamports`,
            `Account ${userFeeAccount} balance changed:`
          );
          logSuccess(
            tx.toString(),
            "Deposited to fee account! Transaction signature:"
          );
          return;
        } catch (error: any) {
          logError(error.message, "Error:");
        }
      });
    },
  },
};

export default {
  command: "account",
  description: "Manage wallet account",
  commands: [AccountInfoCommand, AccountDepositCommand],
};
