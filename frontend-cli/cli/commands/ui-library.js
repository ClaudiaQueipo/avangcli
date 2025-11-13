import { outro, note } from '@clack/prompts'
import { PromptsManager } from '../prompts.js'
import { ActionsManager } from '../actions.js'
import { handleCancel } from '../utils.js'
import { NextJsValidator } from '../core/NextJsValidator.js'
import { ConfigManager } from '../core/ConfigManager.js'

export const command = 'ui-library [library]'
export const desc = 'Add a UI component library to your Next.js project'

export const builder = (yargs) => {
  return yargs
    .positional('library', {
      describe: 'UI library to install (mui, shadcn, heroui)',
      type: 'string',
      choices: ['mui', 'shadcn', 'heroui']
    })
    .example('$0 ui-library', 'Interactive selection of UI library')
    .example('$0 ui-library mui', 'Install Material UI')
    .example('$0 ui-library shadcn', 'Install shadcn/ui')
    .example('$0 ui-library heroui', 'Install HeroUI')
}

export const handler = async (argv) => {
  const promptsManager = new PromptsManager()
  const actionsManager = new ActionsManager()
  const validator = new NextJsValidator()
  const configManager = new ConfigManager()

  try {
    // Validate we're in a Next.js project
    if (!validator.isNextJsProject()) {
      console.error('❌ Error: This command must be run in a Next.js project directory')
      console.log('\nPlease run this command from the root of your Next.js project.')
      process.exit(1)
    }

    // Get package manager from config or detect it
    let packageManager = configManager.getPackageManager()
    if (!packageManager) {
      packageManager = validator.detectPackageManager()
    }

    if (!packageManager) {
      console.error('❌ Error: Could not detect package manager')
      console.log('\nPlease ensure you have a package.json and lock file in your project.')
      process.exit(1)
    }

    let library = argv.library
    if (!library) {
      const uiLibrary = await promptsManager.askUILibrary()
      handleCancel(uiLibrary)
      library = uiLibrary
    }

    if (library === 'none') {
      outro('No UI library selected.')
      return
    }

    if (library === 'mui') {
      await actionsManager.setupMaterialUI(packageManager, process.cwd())
    } else if (library === 'shadcn') {
      // Check if Tailwind is installed
      const hasTailwind = validator.hasTailwindConfig()
      if (!hasTailwind) {
        console.log('\n⚠️  shadcn/ui requires Tailwind CSS. Installing Tailwind CSS first...')
        await actionsManager.setupTailwind(packageManager, process.cwd())
      }
      await actionsManager.setupShadcn(packageManager, process.cwd())
    } else if (library === 'heroui') {
      // Check if Tailwind is installed
      const hasTailwind = validator.hasTailwindConfig()
      if (!hasTailwind) {
        console.log('\n⚠️  HeroUI requires Tailwind CSS. Installing Tailwind CSS first...')
        await actionsManager.setupTailwind(packageManager, process.cwd())
      }
      await actionsManager.setupHeroUI(packageManager, process.cwd())
    }

    outro('✅ UI library setup complete!')

    if (library === 'mui') {
      note(
        'You can now import Material UI components:\nimport { Button } from "@mui/material"',
        'Next steps'
      )
    } else if (library === 'shadcn') {
      note(
        'Add components using:\nnpx shadcn@latest add <component-name>\n\nExample:\nnpx shadcn@latest add button',
        'Next steps'
      )
    } else if (library === 'heroui') {
      note(
        'Add components using:\nheroui add <component-name>\n\nExample:\nheroui add button\n\nOr install all components:\nheroui add --all',
        'Next steps'
      )
    }
  } catch (error) {
    outro('❌ An error occurred during setup')
    console.error(error.message)
    process.exit(1)
  }
}
