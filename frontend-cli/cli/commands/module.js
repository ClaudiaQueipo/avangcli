import { outro, note, cancel, isCancel } from '@clack/prompts'
import { ModuleGenerator } from '../core/ModuleGenerator.js'
import { NextJsValidator } from '../core/NextJsValidator.js'
import { CLIUtils } from '../utils.js'

export const command = 'module <module-name>'
export const desc = 'Generate a new module in an existing Next.js application'

export const builder = (yargs) => {
  return yargs
    .positional('module-name', {
      describe: 'Name of the module to create',
      type: 'string'
    })
    .option('skip-validation', {
      alias: 's',
      describe: 'Skip Next.js project validation',
      type: 'boolean',
      default: false
    })
    .example('$0 module user', 'Create a user module')
    .example('$0 module shopping-cart', 'Create a shopping-cart module')
}

export const handler = async (argv) => {
  const cliUtils = new CLIUtils()
  const nextJsValidator = new NextJsValidator()
  const moduleGenerator = new ModuleGenerator()

  try {
    const moduleName = argv['module-name']

    // Validate module name
    if (!moduleName || moduleName.trim() === '') {
      cancel('❌ Module name is required')
      process.exit(1)
    }

    // Validate module name format (kebab-case)
    const moduleNamePattern = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/
    if (!moduleNamePattern.test(moduleName)) {
      cancel('❌ Module name must be in kebab-case format (e.g., user, shopping-cart, user-profile)')
      process.exit(1)
    }

    // Validate that we're in a Next.js project (unless skipped)
    if (!argv['skip-validation']) {
      const validationResult = nextJsValidator.validate()

      if (!validationResult.isValid) {
        cancel(`❌ Not a valid Next.js project:\n${validationResult.errors.join('\n')}`)
        process.exit(1)
      }

      note(`✓ Next.js ${validationResult.nextVersion || 'detected'}`, 'Valid Next.js project')
    }

    // Generate module
    const result = await moduleGenerator.generate(moduleName)

    if (!result.success) {
      cancel(`❌ ${result.error}`)
      process.exit(1)
    }

    // Show success message with created files
    const filesCreated = result.files.map(f => `  ✓ ${f}`).join('\n')
    note(filesCreated, '📁 Files created')

    outro(`✅ Module "${moduleName}" created successfully!`)

    // Show next steps
    const nextSteps = `Next steps:
  1. Import the container in your page:
     import { ${toPascalCase(moduleName)}Container } from '@/modules/${moduleName}/containers/${moduleName}-container'

  2. Use the service in your components:
     import { ${toCamelCase(moduleName)}Service } from '@/modules/${moduleName}/services/${moduleName}.service'`

    note(nextSteps, '🚀 Get started')

  } catch (error) {
    outro('❌ An error occurred while creating the module')
    console.error(error.message)
    process.exit(1)
  }
}

// Helper functions for name conversion
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function toCamelCase(str) {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}
