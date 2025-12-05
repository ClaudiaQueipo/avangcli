#!/usr/bin/env node

import { readFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import * as configCommand from "./cli/commands/config.js"
import * as generateCommand from "./cli/commands/generate.js"
import * as initCommand from "./cli/commands/init.js"
import * as moduleCommand from "./cli/commands/module.js"
import * as uiLibraryCommand from "./cli/commands/ui-library.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read version from root package.json
const packageJson = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"))
const { version } = packageJson

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
  .version(version)
  .alias("v", "version")
  .epilogue("For more information, visit: https://github.com/ClaudiaQueipo/avangcli")
  .parse()
