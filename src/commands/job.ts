import ConfigCommandService from "../services/config-command-service";
import JobCommandService from "../services/job-command-service";
import { CommandLayout } from "../types";
import { log, logError, logSuccess } from "../utils/log";

const JobDeleteCommand: CommandLayout = {
  command: "delete",
  description: "Delete a job",
  argumentLayout: {
    arguments: [
      {
        argument: "[publicKey]",
        description: "Public key of the job",
      },
    ],
    action: async (args) =>
      await ConfigCommandService.require(args, async (publicKey: string) => {
        try {
          const serviceInstance = await JobCommandService.instance();
          const job = await serviceInstance.deleteJob(publicKey);
          logSuccess(job.toString(), "Deleted job! Transaction signature: ");
          return;
        } catch (error: any) {
          logError(error.message, "Error:");
        }
      }),
  },
};

const JobWatchCommand: CommandLayout = {
  command: "watch",
  description: "Watch a job",
  argumentLayout: {
    arguments: [
      {
        argument: "[publicKey]",
        description: "Public key of the job",
      },
    ],
    action: async (args) =>
      await ConfigCommandService.require(args, async ({ publicKey }: any) => {
        try {
          log("Watching job...");
          const serviceInstance = await JobCommandService.instance();
          await serviceInstance.watchJob(publicKey, (account: any) => {
            log(account);
          });
          return;
        } catch (error: any) {
          logError(error.message, "Error:");
        }
      }),
  },
};

const JobGetCommand: CommandLayout = {
  command: "get",
  description: "Get job by public key",
  argumentLayout: {
    arguments: [
      {
        argument: "[publicKey]",
        description: "Public key of the job",
      },
    ],
    action: async (args) =>
      await ConfigCommandService.require(args, async (publicKey: string) => {
        try {
          const serviceInstance = await JobCommandService.instance();
          const job = await serviceInstance.getJobByPublicKey(publicKey);
          logSuccess(job.pubKey.toString(), "Found job");
          log(job);
          return;
        } catch (error: any) {
          logError(error.message, "Error:");
        }
      }),
  },
};

export default {
  command: "job",
  description: "Manage job",
  commands: [JobGetCommand, JobDeleteCommand, JobWatchCommand],
};
