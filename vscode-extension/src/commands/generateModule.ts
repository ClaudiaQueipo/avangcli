import * as vscode from "vscode"

import { AvangCliManager } from "../services/avangCliManager"

export class GenerateModuleCommand {
  constructor(private avangCliManager: AvangCliManager) {}

  public async execute(): Promise<void> {
    // NOTE: Check if AvangCLI is available
    const isAvailable = await this.avangCliManager.isAvangCliAvailable()
    if (!isAvailable) {
      await this.avangCliManager.showInstallationPrompt()
      return
    }

    // NOTE: Check if we're in a Next.js project
    const workspaceRoot = await this.avangCliManager.getWorkspaceRoot()
    if (!workspaceRoot) {
      vscode.window.showErrorMessage("Please open a workspace folder first.")
      return
    }

    // NOTE: Show module name input
    const moduleName = await vscode.window.showInputBox({
      prompt: "Enter module name (kebab-case)",
      placeHolder: "user-profile",
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return "Module name is required"
        }
        if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(value)) {
          return "Module name must be in kebab-case (lowercase letters, numbers, hyphens)"
        }
        return null
      }
    })

    if (!moduleName) {
      return
    }

    // NOTE: Show store manager selection
    const storeManager = await vscode.window.showQuickPick(["none", "zustand", "redux"], {
      placeHolder: "Select state management solution",
      title: "State Management"
    })

    if (storeManager === undefined) {
      return
    }

    // NOTE: Build command
    const args = [moduleName]

    if (storeManager !== "none") {
      args.push("--store", storeManager)
    }

    // NOTE: Execute command
    const terminal = vscode.window.createTerminal("AvangCLI Module")
    terminal.show()
    terminal.sendText(`cd "${workspaceRoot}"; avangcli module ${args.join(" ")}`)

    vscode.window.showInformationMessage(`Generating module: ${moduleName}`)
  }
}
