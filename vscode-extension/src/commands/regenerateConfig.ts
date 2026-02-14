import * as vscode from "vscode"

import { AvangCliManager } from "../services/avangCliManager"

export class RegenerateConfigCommand {
  constructor(private avangCliManager: AvangCliManager) {}

  public async execute(): Promise<void> {
    // NOTE: Check if AvangCLI is available
    const isAvailable = await this.avangCliManager.isAvangCliAvailable()
    if (!isAvailable) {
      await this.avangCliManager.showInstallationPrompt()
      return
    }

    // NOTE: Check if we're in a project
    const workspaceRoot = await this.avangCliManager.getWorkspaceRoot()
    if (!workspaceRoot) {
      vscode.window.showErrorMessage("Please open a workspace folder first.")
      return
    }

    // NOTE: Confirm action
    const confirm = await vscode.window.showWarningMessage(
      "This will regenerate the avangclirc.json configuration file. Continue?",
      "Yes",
      "Cancel"
    )

    if (confirm !== "Yes") {
      return
    }

    // NOTE: Execute command
    const terminal = vscode.window.createTerminal("AvangCLI Config")
    terminal.show()
    terminal.sendText(`cd "${workspaceRoot}"; avangcli config`)

    vscode.window.showInformationMessage("Regenerating project configuration...")
  }
}
