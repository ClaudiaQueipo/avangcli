import { execSync } from "node:child_process"

import { cancel, log, note, outro, spinner } from "@clack/prompts"

import { ConfigManager } from "../core/ConfigManager.js"
import { ModuleGenerator } from "../core/ModuleGenerator.js"
import { NextJsValidator } from "../core/NextJsValidator.js"
import { PromptFactory } from "../core/Prompt.js"
import {
  detectPackageManager,
  handleCancel,
  isPackageInstalled,
  toCamelCase,
  toPascalCase,
  validateModuleName
} from "../utils.js"

export const command = "module <module-name>"
export const desc = "Generate a new module in an existing Next.js application"

export const builder = (yargs) => {
  return yargs
    .positional("module-name", {
      describe: "Name of the module to create",
      type: "string"
    })
    .option("skip-validation", {
      alias: "s",
      describe: "Skip Next.js project validation",
      type: "boolean",
      default: false
    })
    .option("store", {
      alias: "st",
      describe: "Store manager to use (zustand, redux, none)",
      type: "string",
      choices: ["zustand", "redux", "none"]
    })
    .option("set-default-global", {
      alias: "g",
      describe: "Set the chosen store manager as default globally",
      type: "boolean",
      default: false
    })
    .option("set-default-project", {
      alias: "p",
      describe: "Set the chosen store manager as default for this project",
      type: "boolean",
      default: false
    })
    .example("$0 module user", "Create a user module (will prompt for store manager)")
    .example("$0 module shopping-cart --store zustand", "Create a shopping-cart module with Zustand")
    .example("$0 module auth --store redux -g", "Create auth module with Redux and set Redux as global default")
    .example("$0 module products --store zustand -p", "Create products module with Zustand and set as project default")
}

export const handler = async (argv) => {
  const nextJsValidator = new NextJsValidator()
  const moduleGenerator = new ModuleGenerator()
  const configManager = new ConfigManager()

  try {
    const moduleName = argv["module-name"]

    const validation = validateModuleName(moduleName)
    if (!validation.isValid) {
      cancel(`❌ ${validation.error}`)
      process.exit(1)
    }

    if (!argv["skip-validation"]) {
      const validationResult = nextJsValidator.validate()

      if (!validationResult.isValid) {
        cancel(`❌ Not a valid Next.js project:\n${validationResult.errors.join("\n")}`)
        process.exit(1)
      }

      note(`✓ Next.js ${validationResult.nextVersion || "detected"}`, "Valid Next.js project")
    }

    let storeManager = argv.store || argv.st

    if (!storeManager) {
      const defaultStore = configManager.getDefaultStoreManager()
      if (defaultStore) {
        storeManager = defaultStore
        note(`Using configured default: ${defaultStore}`, "⚙️ Store Manager")
      }
    }

    if (!storeManager) {
      const storePrompt = PromptFactory.createStoreManagerPrompt()
      storeManager = await storePrompt.ask()
      handleCancel(storeManager)
    }

    if (argv["set-default-global"] || argv.g) {
      configManager.setDefaultStoreManagerGlobal(storeManager)
      note(`Set ${storeManager} as global default`, "🌍 Global Config")
    }

    if (argv["set-default-project"] || argv.p) {
      configManager.setDefaultStoreManagerProject(storeManager)
      note(`Set ${storeManager} as project default`, "📁 Project Config")
    }

    const result = await moduleGenerator.generate(moduleName, storeManager)

    if (!result.success) {
      cancel(`❌ ${result.error}`)
      process.exit(1)
    }

    await installDependencies(storeManager)

    const filesCreated = result.files.map((f) => `  ✓ ${f}`).join("\n")
    note(filesCreated, "📁 Files created")

    outro(`✅ Module "${moduleName}" created successfully!`)

    const nextSteps = generateNextSteps(moduleName, storeManager)
    note(nextSteps, "🚀 Get started")
  } catch (error) {
    outro("❌ An error occurred while creating the module")
    log.error(error.message)
    process.exit(1)
  }
}

function generateNextSteps(moduleName, storeManager) {
  const pascalName = toPascalCase(moduleName)
  const camelName = toCamelCase(moduleName)

  let steps = `Next steps:
  1. Import the container in your page:
     import { ${pascalName}Container } from '@/modules/${moduleName}/containers/${moduleName}-container'

  2. Use the service in your components:
     import { ${camelName}Service } from '@/modules/${moduleName}/services/${moduleName}.service'`

  if (storeManager === "zustand") {
    steps += `

  3. Use the Zustand store:
     import { use${pascalName}Store } from '@/modules/${moduleName}/store/${moduleName}.store'`
  } else if (storeManager === "redux") {
    steps += `

  3. Configure Redux store in your app:
     - Import the reducer in your store configuration
     - Add ${moduleName}Reducer to your root reducer`
  }

  return steps
}

async function installDependencies(storeManager) {
  if (storeManager === "none") {
    return
  }

  const packageMap = {
    zustand: "zustand",
    redux: "@reduxjs/toolkit"
  }

  const packageToInstall = packageMap[storeManager]

  if (!packageToInstall) {
    return
  }

  if (isPackageInstalled(packageToInstall)) {
    return
  }

  const s = spinner()
  s.start(`Installing ${packageToInstall}...`)

  try {
    const pm = detectPackageManager()
    const installCommands = {
      npm: `npm install ${packageToInstall}`,
      yarn: `yarn add ${packageToInstall}`,
      pnpm: `pnpm add ${packageToInstall}`,
      bun: `bun add ${packageToInstall}`
    }

    execSync(installCommands[pm], {
      stdio: "pipe",
      cwd: process.cwd()
    })

    s.stop(`✓ Installed ${packageToInstall}`)
  } catch (error) {
    s.stop(`⚠ Failed to install ${packageToInstall}:`, error)
    note(`Please install manually: ${packageToInstall}`, "⚠️ Manual Installation Required")
  }
}
