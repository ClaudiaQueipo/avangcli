import { CommandExecutor } from "./core/CommandExecutor.js"
import { PackageManagerFactory } from "./core/PackageManagerStrategy.js"
import { CreateNextAppCommand } from "./core/SetupCommand.js"
import { SetupCommandFactory } from "./core/ToolSetupCommands.js"

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
    const command = SetupCommandFactory.createEslintPrettierSetup(strategy, projectPath, this.commandExecutor)
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

  async setupMaterialUI(packageManager, projectPath) {
    const strategy = PackageManagerFactory.create(packageManager)
    const command = SetupCommandFactory.createMaterialUISetup(strategy, projectPath, this.commandExecutor)
    await command.execute()
  }

  async setupShadcn(packageManager, projectPath) {
    const strategy = PackageManagerFactory.create(packageManager)
    const command = SetupCommandFactory.createShadcnSetup(strategy, projectPath, this.commandExecutor)
    await command.execute()
  }

  async setupTailwind(packageManager, projectPath) {
    const strategy = PackageManagerFactory.create(packageManager)
    const command = SetupCommandFactory.createTailwindSetup(strategy, projectPath, this.commandExecutor)
    await command.execute()
  }

  async setupHeroUI(packageManager, projectPath) {
    const strategy = PackageManagerFactory.create(packageManager)
    const command = SetupCommandFactory.createHeroUISetup(strategy, projectPath, this.commandExecutor)
    await command.execute()
  }

  async setupSpeedInsights(packageManager, projectPath) {
    const strategy = PackageManagerFactory.create(packageManager)
    const command = SetupCommandFactory.createSpeedInsightsSetup(strategy, projectPath, this.commandExecutor)
    await command.execute()
  }

  async setupGit(packageManager, projectPath, linterFormatter) {
    const strategy = PackageManagerFactory.create(packageManager)
    const command = SetupCommandFactory.createGitSetup(strategy, projectPath, this.commandExecutor, linterFormatter)
    await command.execute()
  }
}

export const actionsManager = new ActionsManager()

export const runCreateNextApp = (packageManager, projectName) =>
  actionsManager.runCreateNextApp(packageManager, projectName)
export const setupEslintPrettier = (packageManager, projectPath) =>
  actionsManager.setupEslintPrettier(packageManager, projectPath)
export const setupBiome = (packageManager, projectPath) => actionsManager.setupBiome(packageManager, projectPath)
export const setupDocker = (dockerConfig, projectPath) => actionsManager.setupDocker(dockerConfig, projectPath)
export const setupMaterialUI = (packageManager, projectPath) =>
  actionsManager.setupMaterialUI(packageManager, projectPath)
export const setupShadcn = (packageManager, projectPath) => actionsManager.setupShadcn(packageManager, projectPath)
export const setupTailwind = (packageManager, projectPath) => actionsManager.setupTailwind(packageManager, projectPath)
export const setupHeroUI = (packageManager, projectPath) => actionsManager.setupHeroUI(packageManager, projectPath)
export const setupSpeedInsights = (packageManager, projectPath) =>
  actionsManager.setupSpeedInsights(packageManager, projectPath)
export const setupGit = (packageManager, projectPath, linterFormatter) =>
  actionsManager.setupGit(packageManager, projectPath, linterFormatter)
