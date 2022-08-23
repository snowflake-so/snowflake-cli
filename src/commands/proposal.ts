import { MultisigJob } from '@snowflake-so/safe-sdk';
import ProposalCommandService from '../services/proposal-command-service';
import ConfigCommandService from '../services/config-command-service';
import { CommandLayout } from '../types';
import { log, logError, logSuccess, logTransactionSuccess } from '../utils/log';

const ProposalsGetCommand: CommandLayout = {
  command: 'get',
  description: 'Get proposals of a safe',
  optionLayout: {
    options: [
      {
        option: '--latest',
        description: 'Get latest job',
      },
      {
        option: '--limit <LIMIT>',
        description: 'Limit number of jobs',
      },
      {
        option: '--offset <OFFSET>',
        description: 'Offset number of jobs',
      },
      {
        option: '--safe [PROPOSAL_ADDRESS]',
        description: 'Get proposals of a safe',
      },
      {
        option: '--address [PROPOSAL_ADDRESS]',
        description: 'Get proposal by key',
      },
      {
        option: '-p, --pretty',
        description: 'Pretty print',
      },
      {
        option: '-f, --fields [FIELDS]',
        description: 'Fields to display',
      },
    ],
    action: async args =>
      await ConfigCommandService.require(
        args,
        async ({ latest, limit, safe, address, offset, pretty, fields }: any) => {
          try {
            const serviceInstance = await ProposalCommandService.instance();
            if (address) {
              const serviceInstance = await ProposalCommandService.instance();
              const proposal = await serviceInstance.getProposalByAddress(address);
              logSuccess(proposal.pubKey.toString(), 'Found proposal');
              log(proposal);
              return;
            } else {
              if (!safe) {
                logError('Safe address is required. Please try again!');
                return;
              }
              let jobs: Partial<MultisigJob[]>;
              jobs = await serviceInstance.getSafeProposals(safe);
              if (offset) {
                jobs = jobs.slice(offset);
              }
              if (limit) {
                jobs = jobs.slice(0, limit);
              }
              if (fields) {
                const fieldsArray = fields.split(',');
                jobs = jobs.map<MultisigJob>((job: any) => {
                  const newJob: any = {};
                  fieldsArray.forEach((field: string) => {
                    if (!job[field]) {
                      throw new Error(`Field not found ${field}`);
                    }
                    newJob[field] = job[field];
                  });
                  return newJob;
                });
              }
              if (latest) {
                jobs = [jobs[0]];
              }

              logSuccess(jobs.length.toString(), 'Found proposals');
              if (pretty) {
                log(jobs);
                return;
              }
              log(JSON.stringify(jobs, null, 2));
              return;
            }
          } catch (error: any) {
            logError(error.message, 'Error:');
          }
        }
      ),
  },
};

const ProposalApproveCommand: CommandLayout = {
  command: 'approve',
  description: 'Approve proposals of a safe',
  argumentLayout: {
    arguments: [
      {
        argument: '[address]',
        description: 'Address of a proposal',
      },
    ],
  },
  action: async args =>
    await ConfigCommandService.require(args, async (address: any) => {
      try {
        const serviceInstance = await ProposalCommandService.instance();
        const tx = await serviceInstance.approveProposal(address);

        logTransactionSuccess(tx, 'Approve proposal');
      } catch (error: any) {
        logError(error.message, 'Error:');
      }
    }),
};

const ProposalRejectCommand: CommandLayout = {
  command: 'reject',
  description: 'Reject a proposal',
  argumentLayout: {
    arguments: [
      {
        argument: '[address]',
        description: 'Address of a proposal',
      },
    ],
  },
  action: async args =>
    await ConfigCommandService.require(args, async (address: any) => {
      try {
        const serviceInstance = await ProposalCommandService.instance();
        const tx = await serviceInstance.rejectProposal(address);

        logTransactionSuccess(tx, 'Reject proposal');
      } catch (error: any) {
        logError(error.message, 'Error:');
      }
    }),
};

const ProposalDeleteCommand: CommandLayout = {
  command: 'delete',
  description: 'Delete a proposal',
  argumentLayout: {
    arguments: [
      {
        argument: '[address]',
        description: 'Address of a proposal',
      },
    ],
  },
  action: async args =>
    await ConfigCommandService.require(args, async (address: any) => {
      try {
        const serviceInstance = await ProposalCommandService.instance();
        const tx = await serviceInstance.deleteProposal(address);

        logTransactionSuccess(tx, 'Delete proposal');
      } catch (error: any) {
        logError(error.message, 'Error:');
      }
    }),
};

const ProposalExecuteCommand: CommandLayout = {
  command: 'execute',
  description: 'Execute a proposal',
  argumentLayout: {
    arguments: [
      {
        argument: '[address]',
        description: 'Address of a proposal',
      },
    ],
  },
  action: async args =>
    await ConfigCommandService.require(args, async (address: any) => {
      try {
        const serviceInstance = await ProposalCommandService.instance();
        const tx = await serviceInstance.executeProposal(address);

        logTransactionSuccess(tx, 'Execute proposal');
      } catch (error: any) {
        logError(error.message, 'Error:');
      }
    }),
};

export default {
  command: 'proposal',
  description: 'Manage proposals',
  commands: [
    ProposalsGetCommand,
    ProposalApproveCommand,
    ProposalRejectCommand,
    ProposalDeleteCommand,
    ProposalExecuteCommand,
  ],
};
