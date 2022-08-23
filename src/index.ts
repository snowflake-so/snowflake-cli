import { Command } from 'commander';
import { ConfigCommand, ProposalCommand, SafeCommand } from './commands';
import { CommandInstructionLayout, CommandLayout } from './types';
import 'dotenv/config';

const program = new Command();

const snowflakeCommandInstruction: CommandInstructionLayout = {
  version: '0.0.1',
  name: 'snowsafe',
  description: '❄️  Snowflake Safe CLI: Manage multisig wallets on command line ❄️',
  commands: [ConfigCommand, ProposalCommand, SafeCommand],
};

class SnowflakeCli {
  static async executeCommands(commands: CommandLayout[], mainProgram: Command) {
    commands.forEach(command => {
      const subProgram = program.createCommand(command.command).description(command.description);
      if (command.argumentLayout && command.argumentLayout.arguments) {
        const argumentLayout = command.argumentLayout;
        argumentLayout.arguments.forEach(argument => {
          subProgram.argument(argument.argument, argument.description);
        });
        if (argumentLayout.action) {
          subProgram.action(argumentLayout.action);
        }
      }
      if (command.optionLayout && command.optionLayout.options) {
        const optionLayout = command.optionLayout;
        optionLayout.options.forEach(option => {
          subProgram.option(option.option, option.description);
        });
        if (optionLayout.action) {
          subProgram.action(optionLayout.action);
        }
      }
      if (command.commands) {
        this.executeCommands(command.commands, subProgram);
      }
      if (command.action) {
        subProgram.action(command.action);
      }
      mainProgram.addCommand(subProgram);
    });
  }

  public static async main(args: string[]) {
    const instruction = snowflakeCommandInstruction;

    const mainProgram = program
      .version(instruction.version)
      .name(instruction.name)
      .description(instruction.description);

    this.executeCommands(instruction.commands, mainProgram);

    program.parse(args);
  }
}

SnowflakeCli.main(process.argv);
