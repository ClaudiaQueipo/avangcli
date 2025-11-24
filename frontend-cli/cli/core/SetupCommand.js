import { spinner } from "@clack/prompts"
import { promises as fs } from "fs"
import { join } from "path"

export class SetupCommand {
  constructor(packageManagerStrategy, projectPath) {
    if (this.constructor === SetupCommand) {
      throw new Error("Cannot instantiate abstract class SetupCommand")
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
    throw new Error("Method startSpinner() must be implemented")
  }

  async installDependencies() {
    throw new Error("Method installDependencies() must be implemented")
  }

  async copyTemplates() {
    throw new Error("Method copyTemplates() must be implemented")
  }

  logSuccess() {
    throw new Error("Method logSuccess() must be implemented")
  }

  logError() {
    throw new Error("Method logError() must be implemented")
  }

  async copyTemplate(templatePath, targetPath) {
    const content = await fs.readFile(templatePath, "utf-8")

    const targetDir = join(targetPath, "..")
    await fs.mkdir(targetDir, { recursive: true })
    await fs.writeFile(targetPath, content, "utf-8")
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
      this.packageManagerStrategy.name === "pnpm" || this.packageManagerStrategy.name === "yarn"
        ? ["create", "next-app"]
        : ["create-next-app"]

    const args = [
      ...baseArgs,
      this.projectName,
      "--typescript",
      this.useTailwind ? "--tailwind" : "--no-tailwind",
      "--no-src-dir",
      "--react-compiler",
      "--no-linter",
      "--app",
      "--import-alias",
      "@/*",
      "--turbopack",
      `--use-${this.packageManagerStrategy.name}`
    ]

    await this.commandExecutor.executeWithOutput(createCmd, args)

    await this.fixLayout()
    return this.projectName
  }

  async fixLayout() {
    const layoutPath = join(this.projectName, "app", "layout.tsx")
    try {
      let content = await fs.readFile(layoutPath, "utf-8")
      if (content.includes("children: React.ReactNode")) {
        content = content.replace(
          'import type { Metadata } from "next";',
          'import type { Metadata } from "next";\nimport type { ReactNode } from "react";'
        )
        content = content.replace("children: React.ReactNode;", "children: ReactNode;")
        await fs.writeFile(layoutPath, content, "utf-8")
      }
    } catch (error) {
      console.error(error)
    }
  }
}
