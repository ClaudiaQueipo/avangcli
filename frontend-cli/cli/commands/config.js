import fs from "node:fs"
import path from "node:path"

import { log, note, outro } from "@clack/prompts"

import { ConfigManager } from "../core/ConfigManager.js"

export const command = "config"
export const desc = "Regenerate avangclirc.json based on current project configuration"

export const builder = (yargs) => {
  return yargs.example("$0 config", "Regenerate avangclirc.json")
}

export const handler = async (_argv) => {
  const configManager = new ConfigManager()

  try {
    log.info("🔍 Detecting project configuration...")

    const packageJsonPath = path.join(process.cwd(), "package.json")
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error("No package.json found. Are you in a project directory?")
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
    const hasNext =
      (packageJson.dependencies && packageJson.dependencies.next) ||
      (packageJson.devDependencies && packageJson.devDependencies.next)
    if (!hasNext) {
      throw new Error("This doesn't appear to be a Next.js project.")
    }

    let packageManager = "npm"
    if (fs.existsSync(path.join(process.cwd(), "yarn.lock"))) {
      packageManager = "yarn"
    } else if (fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml"))) {
      packageManager = "pnpm"
    } else if (fs.existsSync(path.join(process.cwd(), "bun.lock"))) {
      packageManager = "bun"
    }

    const hasTailwind =
      (packageJson.dependencies && packageJson.dependencies.tailwindcss) ||
      (packageJson.devDependencies && packageJson.devDependencies.tailwindcss) ||
      fs.existsSync(path.join(process.cwd(), "tailwind.config.js")) ||
      fs.existsSync(path.join(process.cwd(), "tailwind.config.ts"))

    let linterFormatter = "none"
    if (fs.existsSync(path.join(process.cwd(), "biome.json"))) {
      linterFormatter = "biome"
    } else if (
      fs.existsSync(path.join(process.cwd(), "eslint.config.js")) ||
      fs.existsSync(path.join(process.cwd(), "eslint.config.mjs")) ||
      fs.existsSync(path.join(process.cwd(), ".eslintrc.js")) ||
      fs.existsSync(path.join(process.cwd(), ".eslintrc.json"))
    ) {
      linterFormatter = "eslint-prettier"
    }

    let docker = "none"
    const hasDevDocker = fs.existsSync(path.join(process.cwd(), "docker-compose.dev.yml"))
    const hasProdDocker = fs.existsSync(path.join(process.cwd(), "docker-compose.prod.yml"))
    if (hasDevDocker && hasProdDocker) {
      docker = "both"
    } else if (hasDevDocker) {
      docker = "dev"
    } else if (hasProdDocker) {
      docker = "prod"
    }

    let uiLibrary = "none"
    if (
      (packageJson.dependencies && packageJson.dependencies["@mui/material"]) ||
      (packageJson.devDependencies && packageJson.devDependencies["@mui/material"])
    ) {
      uiLibrary = "mui"
    } else if (fs.existsSync(path.join(process.cwd(), "components.json"))) {
      uiLibrary = "shadcn"
    } else if (
      (packageJson.dependencies && packageJson.dependencies["@heroui/react"]) ||
      (packageJson.devDependencies && packageJson.devDependencies["@heroui/react"])
    ) {
      uiLibrary = "heroui"
    }

    const hasGitSetup =
      fs.existsSync(path.join(process.cwd(), ".husky")) ||
      (packageJson.devDependencies && packageJson.devDependencies.husky) ||
      fs.existsSync(path.join(process.cwd(), "commitlint.config.js"))

    const currentConfig = configManager.readProjectConfig()
    let openapiDocsDir = currentConfig.openapiDocsDir || "docs"
    let openapiOutputDir = currentConfig.openapiOutputDir || "generated"

    if (!currentConfig.openapiDocsDir) {
      if (fs.existsSync(path.join(process.cwd(), "api-docs"))) {
        openapiDocsDir = "api-docs"
      }
    }

    if (!currentConfig.openapiOutputDir) {
      if (fs.existsSync(path.join(process.cwd(), "src/generated"))) {
        openapiOutputDir = "src/generated"
      }
    }

    const projectConfig = {
      packageManager,
      tailwind: hasTailwind,
      linterFormatter,
      docker,
      uiLibrary,
      gitSetup: hasGitSetup,
      openapiDocsDir,
      openapiOutputDir
    }

    configManager.writeProjectConfig(projectConfig)

    log.success("✅ avangclirc.json regenerated successfully!")
    note(JSON.stringify(projectConfig, null, 2), "Detected configuration")
  } catch (error) {
    outro("❌ Failed to regenerate config")
    log.error(error.message)
    process.exit(1)
  }
}
