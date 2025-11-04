import { isCancel, cancel } from '@clack/prompts'
import { CommandExecutor } from './core/CommandExecutor.js'
import { PackageManagerFactory } from './core/PackageManagerStrategy.js'

export class CLIUtils {
  constructor() {
    this.executor = new CommandExecutor()
  }

  handleCancel(value) {
    if (isCancel(value)) {
      cancel('Operation cancelled.')
      process.exit(0)
    }
  }

  getPackageManagerStrategy(packageManager) {
    return PackageManagerFactory.create(packageManager)
  }

  async executeCommand(command, args = [], options = {}) {
    return this.executor.execute(command, args, options)
  }

  async executeCommandWithOutput(command, args = [], options = {}) {
    return this.executor.executeWithOutput(command, args, options)
  }
}

export const cliUtils = new CLIUtils()

export const handleCancel = value => cliUtils.handleCancel(value)
export const executeCommand = (command, args, options) =>
  cliUtils.executeCommand(command, args, options)
export const executeCommandWithOutput = (command, args, options) =>
  cliUtils.executeCommandWithOutput(command, args, options)
export const getCreateCommand = packageManager =>
  cliUtils.getPackageManagerStrategy(packageManager).getCreateCommand()
export const getInstallCommand = packageManager =>
  cliUtils.getPackageManagerStrategy(packageManager).getInstallCommand()
