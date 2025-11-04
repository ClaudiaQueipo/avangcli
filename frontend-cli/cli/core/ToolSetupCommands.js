import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { SetupCommand } from './SetupCommand.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class EslintPrettierSetupCommand extends SetupCommand {
  constructor(packageManagerStrategy, projectPath, commandExecutor) {
    super(packageManagerStrategy, projectPath)
    this.commandExecutor = commandExecutor
  }

  startSpinner() {
    this.spinner.start('Installing ESLint + Prettier dependencies...')
  }

  async installDependencies() {
    const { cmd, args } = this.packageManagerStrategy.getInstallCommand()
    const dependencies = [
      'eslint',
      'prettier',
      'eslint-config-prettier',
      '@eslint/eslintrc',
      '@eslint/js',
      'eslint-config-next',
    ]

    this.spinner.stop()

    await this.commandExecutor.execute(cmd, [...args, '-D', ...dependencies], {
      cwd: this.projectPath,
    })
  }

  async copyTemplates() {
    const templatesDir = join(__dirname, '..', '..', 'templates', 'eslint-prettier')

    const templates = [
      { file: '.prettierrc', target: '.prettierrc' },
      { file: 'eslint.config.mjs', target: 'eslint.config.mjs' },
      { file: '.eslintignore', target: '.eslintignore' },
      { file: '.prettierignore', target: '.prettierignore' },
    ]

    for (const { file, target } of templates) {
      await this.copyTemplate(join(templatesDir, file), join(this.projectPath, target))
    }
  }

  logSuccess() {
    console.log('✓ ESLint + Prettier configured successfully!')
  }

  logError() {
    console.error('✗ Failed to setup ESLint + Prettier')
  }
}

export class BiomeSetupCommand extends SetupCommand {
  constructor(packageManagerStrategy, projectPath, commandExecutor) {
    super(packageManagerStrategy, projectPath)
    this.commandExecutor = commandExecutor
  }

  startSpinner() {
    this.spinner.start('Installing Biome dependency...')
  }

  async installDependencies() {
    const { cmd, args } = this.packageManagerStrategy.getInstallCommand()

    this.spinner.stop()

    await this.commandExecutor.execute(cmd, [...args, '-D', '@biomejs/biome'], {
      cwd: this.projectPath,
    })
  }

  async copyTemplates() {
    const templatesDir = join(__dirname, '..', '..', 'templates', 'biome')

    const templates = [
      { file: 'biome.json', target: 'biome.json' },
      { file: '.biomeignore', target: '.biomeignore' },
    ]

    for (const { file, target } of templates) {
      await this.copyTemplate(join(templatesDir, file), join(this.projectPath, target))
    }
  }

  logSuccess() {
    console.log('✓ Biome configured successfully!')
  }

  logError() {
    console.error('✗ Failed to setup Biome')
  }
}

export class DockerSetupCommand extends SetupCommand {
  constructor(dockerConfig, projectPath) {
    super(null, projectPath)
    this.dockerConfig = dockerConfig
  }

  startSpinner() {
    this.spinner.start('Setting up Docker configuration...')
  }

  async installDependencies() {
    this.spinner.stop()
  }

  async copyTemplates() {
    const templatesDir = join(__dirname, '..', '..', 'templates', 'docker')

    await this.copyTemplate(join(templatesDir, '.dockerignore'), join(this.projectPath, '.dockerignore'))

    if (this.dockerConfig === 'dev' || this.dockerConfig === 'both') {
      await this.copyTemplate(
        join(templatesDir, 'Dockerfile.dev'),
        join(this.projectPath, 'Dockerfile.dev')
      )
      await this.copyTemplate(
        join(templatesDir, 'docker-compose.dev.yml'),
        join(this.projectPath, 'docker-compose.dev.yml')
      )
    }

    if (this.dockerConfig === 'prod' || this.dockerConfig === 'both') {
      await this.copyTemplate(
        join(templatesDir, 'Dockerfile.prod'),
        join(this.projectPath, 'Dockerfile.prod')
      )
      await this.copyTemplate(
        join(templatesDir, 'docker-compose.prod.yml'),
        join(this.projectPath, 'docker-compose.prod.yml')
      )
    }
  }

  logSuccess() {
    console.log('✓ Docker configuration setup successfully!')
  }

  logError() {
    console.error('✗ Failed to setup Docker')
  }
}

export class SetupCommandFactory {
  static createEslintPrettierSetup(packageManagerStrategy, projectPath, commandExecutor) {
    return new EslintPrettierSetupCommand(packageManagerStrategy, projectPath, commandExecutor)
  }

  static createBiomeSetup(packageManagerStrategy, projectPath, commandExecutor) {
    return new BiomeSetupCommand(packageManagerStrategy, projectPath, commandExecutor)
  }

  static createDockerSetup(dockerConfig, projectPath) {
    return new DockerSetupCommand(dockerConfig, projectPath)
  }
}
