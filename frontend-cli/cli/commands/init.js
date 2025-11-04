import { outro, note } from '@clack/prompts'
import { PromptsManager } from '../prompts.js'
import { ActionsManager } from '../actions.js'
import { CLIUtils } from '../utils.js'
import { PackageManagerFactory } from '../core/PackageManagerStrategy.js'

export const command = 'init [project-name]'
export const desc = 'Initialize a new Next.js project with optional configurations'

export const builder = (yargs) => {
  return yargs
    .positional('project-name', {
      describe: 'Name of the project to create',
      type: 'string'
    })
    .option('package-manager', {
      alias: 'pm',
      describe: 'Package manager to use (npm, yarn, pnpm, bun)',
      type: 'string',
      choices: ['npm', 'yarn', 'pnpm', 'bun']
    })
    .option('tailwind', {
      alias: 't',
      describe: 'Use Tailwind CSS',
      type: 'boolean'
    })
    .option('linter-formatter', {
      alias: 'lf',
      describe: 'Linter and formatter setup',
      type: 'string',
      choices: ['eslint-prettier', 'biome', 'none']
    })
    .option('docker', {
      alias: 'd',
      describe: 'Docker configuration',
      type: 'string',
      choices: ['dev', 'prod', 'both', 'none']
    })
    .example('$0 init', 'Initialize a new project with interactive prompts')
    .example('$0 init my-app --pm bun --tailwind', 'Create a project with Tailwind CSS')
    .example('$0 init my-app --pm npm --lf biome --docker dev', 'Create a fully configured project')
}

export const handler = async (argv) => {
  const promptsManager = new PromptsManager()
  const actionsManager = new ActionsManager()
  const cliUtils = new CLIUtils()

  try {
    promptsManager.showWelcome()

    let projectName = argv['project-name']
    if (!projectName) {
      projectName = await promptsManager.askProjectName()
      cliUtils.handleCancel(projectName)
    }

    let packageManager = argv['package-manager'] || argv.pm
    if (!packageManager) {
      packageManager = await promptsManager.askPackageManager()
      cliUtils.handleCancel(packageManager)
    }

    let useTailwind = argv.tailwind || argv.t
    if (useTailwind === undefined) {
      useTailwind = await promptsManager.askTailwind()
      cliUtils.handleCancel(useTailwind)
    }

    await actionsManager.runCreateNextApp(packageManager, projectName, useTailwind)

    let linterFormatter = argv['linter-formatter'] || argv.lf
    if (!linterFormatter) {
      linterFormatter = await promptsManager.askLinterFormatter()
      cliUtils.handleCancel(linterFormatter)
    }

    if (linterFormatter === 'eslint-prettier') {
      await actionsManager.setupEslintPrettier(packageManager, projectName)
    } else if (linterFormatter === 'biome') {
      await actionsManager.setupBiome(packageManager, projectName)
    }

    let dockerConfig = argv.docker || argv.d
    if (!dockerConfig) {
      dockerConfig = await promptsManager.askDockerConfig()
      cliUtils.handleCancel(dockerConfig)
    }

    if (dockerConfig !== 'none') {
      await actionsManager.setupDocker(dockerConfig, projectName)
    }

    outro('✅ Project setup complete!')

    const nextSteps = generateNextSteps(projectName, packageManager, dockerConfig)
    note(nextSteps, 'Get started')
  } catch (error) {
    outro('❌ An error occurred during setup')
    console.error(error.message)
    process.exit(1)
  }
}

function generateDockerInstructions(dockerConfig) {
  if (dockerConfig === 'none') return ''

  const devCommand = 'docker-compose -f docker-compose.dev.yml up'
  const prodCommand = 'docker-compose -f docker-compose.prod.yml up'

  if (dockerConfig === 'dev') {
    return `\n  # To run with Docker:\n  ${devCommand}`
  }

  if (dockerConfig === 'prod') {
    return `\n  # To run with Docker:\n  ${prodCommand}`
  }

  if (dockerConfig === 'both') {
    return `\n  # To run with Docker:\n  ${devCommand}\n  # or\n  ${prodCommand}`
  }

  return ''
}

function generateNextSteps(projectName, packageManager, dockerConfig) {
  const strategy = PackageManagerFactory.create(packageManager)
  const runCommand = strategy.getRunCommand()
  const dockerInstructions = generateDockerInstructions(dockerConfig)

  return `Next steps:
  cd ${projectName}
  ${runCommand} dev${dockerInstructions}`
}
