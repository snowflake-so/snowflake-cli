import { Job } from "@snowflake-so/snowflake-sdk";
import ConfigCommandService from "../services/config-command-service";
import JobCommandService from "../services/job-command-service";
import { CommandLayout } from "../types";
import { log, logError, logSuccess } from "../utils/log";

const JobsGetGlobalCommand: CommandLayout = {
  command: "get",
  description: "Get global jobs",
  optionLayout: {
    options: [
      {
        option: "--latest",
        description: "Get latest job",
      },
      {
        option: "--limit <LIMIT>",
        description: "Limit number of jobs",
      },
      {
        option: "--offset <OFFSET>",
        description: "Offset number of jobs",
      },
      {
        option: "--owner <OWNER_ADDRESS>",
        description: "Get jobs by owner",
      },
      {
        option: "-p, --pretty",
        description: "Pretty print",
      },
      {
        option: "-f, --fields [FIELDS]",
        description: "Fields to display",
      },
    ],
    action: async (args) =>
      await ConfigCommandService.require(
        args,
        async ({ latest, limit, owner, offset, pretty, fields }: any) => {
          try {
            const serviceInstance = await JobCommandService.instance();
            let jobs: Partial<Job>[];
            jobs = owner
              ? await serviceInstance.getJobsByOwner(owner)
              : await serviceInstance.getGlobalJob();
            if (offset) {
              jobs = jobs.slice(offset);
            }
            if (limit) {
              jobs = jobs.slice(0, limit);
            }
            if (fields) {
              const fieldsArray = fields.split(",");
              jobs = jobs.map<Partial<Job>>((job: Job) => {
                const newJob = {};
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

            logSuccess(jobs.length.toString(), "Found", "jobs");
            if (pretty) {
              log(jobs);
              return;
            }
            log(JSON.stringify(jobs, null, 2));
            return;
          } catch (error: any) {
            logError(error.message, "Error:");
          }
        }
      ),
  },
};

export default {
  command: "jobs",
  description: "Manage jobs",
  commands: [JobsGetGlobalCommand],
};
