import * as vscode from "vscode"

import { AvangCliManager } from "../services/avangCliManager"

export class InitProjectCommand {
  constructor(private avangCliManager: AvangCliManager) {}

  public async execute(): Promise<void> {
    // NOTE: Check if AvangCLI is available
    const isAvailable = await this.avangCliManager.isAvangCliAvailable()
    if (!isAvailable) {
      await this.avangCliManager.showInstallationPrompt()
      return
    }

    // NOTE: Get workspace root
    const workspaceRoot = await this.avangCliManager.getWorkspaceRoot()
    if (!workspaceRoot) {
      vscode.window.showErrorMessage("Please open a workspace folder first.")
      return
    }

    // NOTE: Show project name input
    const projectName = await vscode.window.showInputBox({
      prompt: "Enter project name",
      placeHolder: "my-next-app"
    })

    if (!projectName) {
      return
    }

    // NOTE: Get configuration defaults
    const config = {
      packageManager: this.avangCliManager.getConfig<string>("packageManager") || "bun",
      useTailwind: this.avangCliManager.getConfig<boolean>("useTailwind") || true,
      linterFormatter: this.avangCliManager.getConfig<string>("linterFormatter") || "biome",
      dockerConfig: this.avangCliManager.getConfig<string>("dockerConfig") || "none",
      uiLibrary: this.avangCliManager.getConfig<string>("uiLibrary") || "none"
    }

    // NOTE: Show configuration quick picks
    const options = await this.showConfigurationOptions(config)
    if (!options) {
      return
    }

    // NOTE: Build command arguments
    const args = [projectName]

    if (options.packageManager !== "bun") {
      args.push("--pm", options.packageManager as string)
    }

    if (options.useTailwind) {
      args.push("--tailwind")
    }

    if (options.linterFormatter !== "none") {
      args.push("--lf", options.linterFormatter as string)
    }

    if (options.dockerConfig !== "none") {
      args.push("--docker", options.dockerConfig as string)
    }

    if (options.uiLibrary !== "none") {
      args.push("--ui", options.uiLibrary as string)
    }

    // NOTE: Execute command
    const terminal = vscode.window.createTerminal("AvangCLI Init")
    terminal.show()
    terminal.sendText(`cd "${workspaceRoot}"; avangcli init ${args.join(" ")}`)

    vscode.window.showInformationMessage(`Creating new project: ${projectName}`)
  }

  private async showConfigurationOptions(_defaults: unknown): Promise<Record<string, unknown> | undefined> {
    const packageManager = await vscode.window.showQuickPick(["npm", "yarn", "pnpm", "bun"], {
      placeHolder: "Select package manager",
      title: "Package Manager"
    })

    if (!packageManager) return undefined

    const useTailwind = await vscode.window.showQuickPick(["Yes", "No"], {
      placeHolder: "Use Tailwind CSS?",
      title: "Tailwind CSS"
    })

    if (!useTailwind) return undefined

    const linterFormatter = await vscode.window.showQuickPick(["eslint-prettier", "biome", "none"], {
      placeHolder: "Select linter/formatter",
      title: "Code Quality Tools"
    })

    if (!linterFormatter) return undefined

    const dockerConfig = await vscode.window.showQuickPick(["none", "dev", "prod", "both"], {
      placeHolder: "Docker configuration",
      title: "Docker Setup"
    })

    if (!dockerConfig) return undefined

    const uiLibrary = await vscode.window.showQuickPick(["none", "mui", "shadcn", "heroui"], {
      placeHolder: "Select UI library",
      title: "UI Component Library"
    })

    if (uiLibrary === undefined) return undefined

    return {
      packageManager,
      useTailwind: useTailwind === "Yes",
      linterFormatter,
      dockerConfig,
      uiLibrary
    }
  }
}
