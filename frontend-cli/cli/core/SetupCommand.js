import { promises as fs } from 'fs'
import { join } from 'path'
import { spinner } from '@clack/prompts'

export class SetupCommand {
  constructor(packageManagerStrategy, projectPath) {
    if (this.constructor === SetupCommand) {
      throw new Error('Cannot instantiate abstract class SetupCommand')
    }
    this.packageManagerStrategy = packageManagerStrategy
    this.projectPath = projectPath
    this.spinner = null
  }

  async execute() {
    try {
      this.spinner = spinner()
      this.startSpinner()
      await this.installDependencies()
      this.spinner.stop()
      await this.copyTemplates()
      this.logSuccess()
    } catch (error) {
      this.logError()
      throw error
    }
  }

  startSpinner() {
    throw new Error('Method startSpinner() must be implemented')
  }

  async installDependencies() {
    throw new Error('Method installDependencies() must be implemented')
  }

  async copyTemplates() {
    throw new Error('Method copyTemplates() must be implemented')
  }

  logSuccess() {
    throw new Error('Method logSuccess() must be implemented')
  }

  logError() {
    throw new Error('Method logError() must be implemented')
  }

  async copyTemplate(templatePath, targetPath) {
    const content = await fs.readFile(templatePath, 'utf-8')
    // Create parent directory if it doesn't exist
    const targetDir = join(targetPath, '..')
    await fs.mkdir(targetDir, { recursive: true })
    await fs.writeFile(targetPath, content, 'utf-8')
  }

  getTemplatesDir(templatesDir, subdir) {
    return join(templatesDir, subdir)
  }
}

export class CreateNextAppCommand {
  constructor(packageManagerStrategy, projectName, commandExecutor, useTailwind = false) {
    this.packageManagerStrategy = packageManagerStrategy
    this.projectName = projectName
    this.commandExecutor = commandExecutor
    this.useTailwind = useTailwind
  }

  async execute() {
    const createCmd = this.packageManagerStrategy.getCreateCommand()
    const baseArgs =
      this.packageManagerStrategy.name === 'pnpm' || this.packageManagerStrategy.name === 'yarn'
        ? ['create', 'next-app']
        : ['create-next-app']

    const args = [
      ...baseArgs,
      this.projectName,
      '--typescript',
      this.useTailwind ? '--tailwind' : '--no-tailwind',
      '--no-src-dir',
      '--react-compiler',
      '--no-linter',
      '--app',
      '--import-alias',
      '@/*',
      '--turbopack',
    ]

    await this.commandExecutor.executeWithOutput(createCmd, args)
    return this.projectName
  }
}
