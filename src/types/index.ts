export interface OptionLayout {
  option: string;
  description: string;
}

export interface ArgumentLayout {
  argument: string;
  description: string;
}

export interface OptionInstructionLayout {
  options: OptionLayout[];
  action?(args: any): any;
}

export interface ArgumentInstructionLayout {
  arguments: ArgumentLayout[];
  action?(args: any): any;
}

export interface CommandLayout {
  command: string;
  description: string;
  commands?: CommandLayout[];
  optionLayout?: OptionInstructionLayout;
  argumentLayout?: ArgumentInstructionLayout;
  action?(args: any): any;
}
export interface CommandInstructionLayout {
  version: string;
  name: string;
  description: string;
  commands: CommandLayout[];
}
