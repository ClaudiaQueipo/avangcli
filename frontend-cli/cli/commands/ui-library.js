import { log, note, outro } from "@clack/prompts"

import { ActionsManager } from "../actions.js"
import { ConfigManager } from "../core/ConfigManager.js"
import { NextJsValidator } from "../core/NextJsValidator.js"
import { PromptsManager } from "../prompts.js"
import { handleCancel } from "../utils.js"

export const command = "ui-library [library]"
export const desc = "Add a UI component library to your Next.js project"

export const builder = (yargs) => {
  return yargs
    .positional("library", {
      describe: "UI library to install (mui, shadcn, heroui)",
      type: "string",
      choices: ["mui", "shadcn", "heroui"]
    })
    .example("$0 ui-library", "Interactive selection of UI library")
    .example("$0 ui-library mui", "Install Material UI")
    .example("$0 ui-library shadcn", "Install shadcn/ui")
    .example("$0 ui-library heroui", "Install HeroUI")
}

export const handler = async (argv) => {
  const promptsManager = new PromptsManager()
  const actionsManager = new ActionsManager()
  const validator = new NextJsValidator()
  const configManager = new ConfigManager()

  try {
    if (!validator.isNextJsProject()) {
      log.error("❌ Error: This command must be run in a Next.js project directory")
      log.info("\nPlease run this command from the root of your Next.js project.")
      process.exit(1)
    }

    let packageManager = configManager.getPackageManager()
    if (!packageManager) {
      packageManager = validator.detectPackageManager()
    }

    if (!packageManager) {
      log.error("❌ Error: Could not detect package manager")
      log.info("\nPlease ensure you have a package.json and lock file in your project.")
      process.exit(1)
    }

    let { library } = argv
    if (!library) {
      const uiLibrary = await promptsManager.askUILibrary()
      handleCancel(uiLibrary)
      library = uiLibrary
    }

    if (library === "none") {
      outro("No UI library selected.")
      return
    }

    if (library === "mui") {
      await actionsManager.setupMaterialUI(packageManager, process.cwd())
    } else if (library === "shadcn") {
      const hasTailwind = validator.hasTailwindConfig()
      if (!hasTailwind) {
        log.warning("\n⚠️  shadcn/ui requires Tailwind CSS. Installing Tailwind CSS first...")
        await actionsManager.setupTailwind(packageManager, process.cwd())

        const currentConfig = configManager.readProjectConfig()
        configManager.writeProjectConfig({ ...currentConfig, tailwind: true })
      }
      await actionsManager.setupShadcn(packageManager, process.cwd())
    } else if (library === "heroui") {
      const hasTailwind = validator.hasTailwindConfig()
      if (!hasTailwind) {
        log.warning("\n⚠️  HeroUI requires Tailwind CSS. Installing Tailwind CSS first...")
        await actionsManager.setupTailwind(packageManager, process.cwd())

        const currentConfig = configManager.readProjectConfig()
        configManager.writeProjectConfig({ ...currentConfig, tailwind: true })
      }
      await actionsManager.setupHeroUI(packageManager, process.cwd())
    }

    outro("✅ UI library setup complete!")

    if (library === "mui") {
      note('You can now import Material UI components:\nimport { Button } from "@mui/material"', "Next steps")
    } else if (library === "shadcn") {
      note(
        "Add components using:\nnpx shadcn@latest add <component-name>\n\nExample:\nnpx shadcn@latest add button",
        "Next steps"
      )
    } else if (library === "heroui") {
      note(
        "Add components using:\nheroui add <component-name>\n\nExample:\nheroui add button\n\nOr install all components:\nheroui add --all",
        "Next steps"
      )
    }
  } catch (error) {
    outro("❌ An error occurred during setup")
    log.error(error.message)
    process.exit(1)
  }
}
