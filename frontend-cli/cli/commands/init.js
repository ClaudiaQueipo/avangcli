import { note, outro } from "@clack/prompts"
import { log } from "@clack/prompts"

import { ActionsManager } from "../actions.js"
import { PackageManagerFactory } from "../core/PackageManagerStrategy.js"
import { PromptsManager } from "../prompts.js"
import { handleCancel } from "../utils.js"

export const command = "init [project-name]"
export const desc = "Initialize a new Next.js project with optional configurations"

export const builder = (yargs) => {
  return yargs
    .positional("project-name", {
      describe: "Name of the project to create",
      type: "string"
    })
    .option("package-manager", {
      alias: "pm",
      describe: "Package manager to use (npm, yarn, pnpm, bun)",
      type: "string",
      choices: ["npm", "yarn", "pnpm", "bun"]
    })
    .option("tailwind", {
      alias: "t",
      describe: "Use Tailwind CSS",
      type: "boolean"
    })
    .option("linter-formatter", {
      alias: "lf",
      describe: "Linter and formatter setup",
      type: "string",
      choices: ["eslint-prettier", "biome", "none"]
    })
    .option("docker", {
      alias: "d",
      describe: "Docker configuration",
      type: "string",
      choices: ["dev", "prod", "both", "none"]
    })
    .option("ui-library", {
      alias: "ui",
      describe: "UI component library",
      type: "string",
      choices: ["mui", "shadcn", "heroui", "none"]
    })
    .option("git-setup", {
      alias: "git",
      describe: "Setup Git with Commitizen, Commitlint, Husky & Lint-staged",
      type: "boolean"
    })
    .example("$0 init", "Initialize a new project with interactive prompts")
    .example("$0 init my-app --pm bun --tailwind", "Create a project with Tailwind CSS")
    .example("$0 init my-app --pm npm --lf biome --docker dev", "Create a fully configured project")
    .example("$0 init my-app --pm npm --ui mui", "Create a project with Material UI")
    .example("$0 init my-app --pm npm --ui heroui --tailwind", "Create a project with HeroUI")
    .example("$0 init my-app --pm npm --git-setup", "Create a project with Git setup")
}

export const handler = async (argv) => {
  const promptsManager = new PromptsManager()
  const actionsManager = new ActionsManager()

  try {
    promptsManager.showWelcome()

    let projectName = argv["project-name"]
    if (!projectName) {
      projectName = await promptsManager.askProjectName()
      handleCancel(projectName)
    }

    let packageManager = argv["package-manager"] || argv.pm
    if (!packageManager) {
      packageManager = await promptsManager.askPackageManager()
      handleCancel(packageManager)
    }

    let useTailwind = argv.tailwind || argv.t
    if (useTailwind === undefined) {
      useTailwind = await promptsManager.askTailwind()
      handleCancel(useTailwind)
    }

    await actionsManager.runCreateNextApp(packageManager, projectName, useTailwind)

    let linterFormatter = argv["linter-formatter"] || argv.lf
    if (!linterFormatter) {
      linterFormatter = await promptsManager.askLinterFormatter()
      handleCancel(linterFormatter)
    }

    if (linterFormatter === "eslint-prettier") {
      await actionsManager.setupEslintPrettier(packageManager, projectName)
    } else if (linterFormatter === "biome") {
      await actionsManager.setupBiome(packageManager, projectName)
    }

    let dockerConfig = argv.docker || argv.d
    if (!dockerConfig) {
      dockerConfig = await promptsManager.askDockerConfig()
      handleCancel(dockerConfig)
    }

    if (dockerConfig !== "none") {
      await actionsManager.setupDocker(dockerConfig, projectName)
    }

    let uiLibrary = argv["ui-library"] || argv.ui
    if (!uiLibrary) {
      uiLibrary = await promptsManager.askUILibrary()
      handleCancel(uiLibrary)
    }

    if (uiLibrary === "mui") {
      await actionsManager.setupMaterialUI(packageManager, projectName)
    } else if (uiLibrary === "shadcn") {
      if (!useTailwind) {
        log("\n⚠️  shadcn/ui requires Tailwind CSS. Installing Tailwind CSS first...")
        await actionsManager.setupTailwind(packageManager, projectName)
      }
      await actionsManager.setupShadcn(packageManager, projectName)
    } else if (uiLibrary === "heroui") {
      if (!useTailwind) {
        log("\n⚠️  HeroUI requires Tailwind CSS. Installing Tailwind CSS first...")
        await actionsManager.setupTailwind(packageManager, projectName)
      }
      await actionsManager.setupHeroUI(packageManager, projectName)
    }

    let gitSetup = argv["git-setup"] || argv.git
    if (gitSetup === undefined) {
      gitSetup = await promptsManager.askGitSetup()
      handleCancel(gitSetup)
    }

    if (gitSetup) {
      await actionsManager.setupGit(packageManager, projectName, linterFormatter)
    }

    outro("✅ Project setup complete!")

    const nextSteps = generateNextSteps(projectName, packageManager, dockerConfig, gitSetup)
    note(nextSteps, "Get started")
  } catch (error) {
    outro("❌ An error occurred during setup")
    console.error(error.message)
    process.exit(1)
  }
}

function generateDockerInstructions(dockerConfig) {
  if (dockerConfig === "none") return ""

  const devCommand = "docker-compose -f docker-compose.dev.yml up"
  const prodCommand = "docker-compose -f docker-compose.prod.yml up"

  if (dockerConfig === "dev") {
    return `\n  # To run with Docker:\n  ${devCommand}`
  }

  if (dockerConfig === "prod") {
    return `\n  # To run with Docker:\n  ${prodCommand}`
  }

  if (dockerConfig === "both") {
    return `\n  # To run with Docker:\n  ${devCommand}\n  # or\n  ${prodCommand}`
  }

  return ""
}

function generateNextSteps(projectName, packageManager, dockerConfig, gitSetup) {
  const strategy = PackageManagerFactory.create(packageManager)
  const runCommand = strategy.getRunCommand()
  const dockerInstructions = generateDockerInstructions(dockerConfig)
  const gitInstructions = gitSetup ? "\n  # To commit changes:\n  npx cz" : ""

  return `Next steps:
  cd ${projectName}
  ${runCommand} dev${dockerInstructions}${gitInstructions}`
}
