#!/usr/bin/env node

import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import * as configCommand from "./cli/commands/config.js"
import * as generateCommand from "./cli/commands/generate.js"
import * as initCommand from "./cli/commands/init.js"
import * as moduleCommand from "./cli/commands/module.js"
import * as uiLibraryCommand from "./cli/commands/ui-library.js"

yargs(hideBin(process.argv))
  .scriptName("avangcli")
  .usage("Usage: $0 <command> [options]")
  .command(initCommand)
  .command(configCommand)
  .command(generateCommand)
  .command(moduleCommand)
  .command(uiLibraryCommand)
  .demandCommand(1, "You need to specify a command")
  .help("h")
  .alias("h", "help")
  .version("1.0.4")
  .alias("v", "version")
  // TODO: change the repo url
  .epilogue("For more information, visit: https://github.com/repourl")
  .parse()
