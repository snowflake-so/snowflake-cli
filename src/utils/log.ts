export const Reset = "\x1b[0m";
export const Bright = "\x1b[1m";
export const Dim = "\x1b[2m";
export const Underscore = "\x1b[4m";
export const Blink = "\x1b[5m";

export const FgBlack = "\x1b[30m";
export const FgGreen = "\x1b[32m";
export const FgRed = "\x1b[31m";

export const BgGreen = "\x1b[42m";

export const log = console.log;
export const logSuccess = (
  message: string,
  prefixMessage?: string,
  suffixMessage?: string
) =>
  log(
    `${prefixMessage || ""} ${FgGreen}${message}${Reset} ${
      suffixMessage || ""
    }`.trim()
  );
export const logError = (
  message: string,
  prefixMessage?: string,
  suffixMessage?: string
) =>
  log(
    `${prefixMessage || ""} ${FgRed}${message}${Reset} ${
      suffixMessage || ""
    }`.trim()
  );
