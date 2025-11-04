#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import * as initCommand from './cli/commands/init.js'
import * as moduleCommand from './cli/commands/module.js'

yargs(hideBin(process.argv))
  .scriptName('try-catch')
  .usage('Usage: $0 <command> [options]')
  .command(initCommand)
  .command(moduleCommand)
  .demandCommand(1, 'You need to specify a command')
  .help('h')
  .alias('h', 'help')
  .version('1.0.0')
  .alias('v', 'version')
  .epilogue('For more information, visit: https://github.com/avangenio/try-catch-cli')
  .parse()
