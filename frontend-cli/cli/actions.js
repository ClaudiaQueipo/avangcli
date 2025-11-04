import { CommandExecutor } from './core/CommandExecutor.js'
import { PackageManagerFactory } from './core/PackageManagerStrategy.js'
import { CreateNextAppCommand } from './core/SetupCommand.js'
import { SetupCommandFactory } from './core/ToolSetupCommands.js'

export class ActionsManager {
  constructor() {
    this.commandExecutor = new CommandExecutor()
  }

  async runCreateNextApp(packageManager, projectName, useTailwind = false) {
    const strategy = PackageManagerFactory.create(packageManager)
    const command = new CreateNextAppCommand(strategy, projectName, this.commandExecutor, useTailwind)
    return await command.execute()
  }

  async setupEslintPrettier(packageManager, projectPath) {
    const strategy = PackageManagerFactory.create(packageManager)
    const command = SetupCommandFactory.createEslintPrettierSetup(
      strategy,
      projectPath,
      this.commandExecutor
    )
    await command.execute()
  }

  async setupBiome(packageManager, projectPath) {
    const strategy = PackageManagerFactory.create(packageManager)
    const command = SetupCommandFactory.createBiomeSetup(strategy, projectPath, this.commandExecutor)
    await command.execute()
  }

  async setupDocker(dockerConfig, projectPath) {
    const command = SetupCommandFactory.createDockerSetup(dockerConfig, projectPath)
    await command.execute()
  }
}

export const actionsManager = new ActionsManager()

export const runCreateNextApp = (packageManager, projectName) =>
  actionsManager.runCreateNextApp(packageManager, projectName)
export const setupEslintPrettier = (packageManager, projectPath) =>
  actionsManager.setupEslintPrettier(packageManager, projectPath)
export const setupBiome = (packageManager, projectPath) =>
  actionsManager.setupBiome(packageManager, projectPath)
export const setupDocker = (dockerConfig, projectPath) =>
  actionsManager.setupDocker(dockerConfig, projectPath)
