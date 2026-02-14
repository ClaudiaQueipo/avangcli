import * as vscode from "vscode"

import { AvangCliManager } from "../services/avangCliManager"

export class GenerateClientsCommand {
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

    // NOTE: Get configuration for directories
    const docsDir = await vscode.window.showInputBox({
      prompt: "OpenAPI docs directory (optional)",
      placeHolder: "./api-docs"
    })

    const outputDir = await vscode.window.showInputBox({
      prompt: "Output directory for generated clients (optional)",
      placeHolder: "./src/generated"
    })

    // NOTE: Build command
    const args = []

    if (docsDir) {
      args.push("--docs-dir", docsDir)
    }

    if (outputDir) {
      args.push("--output-dir", outputDir)
    }

    // NOTE: Execute command
    const terminal = vscode.window.createTerminal("AvangCLI Generate")
    terminal.show()
    terminal.sendText(`cd "${workspaceRoot}"; avangcli generate ${args.join(" ")}`)

    vscode.window.showInformationMessage("Generating TypeScript clients from OpenAPI specs...")
  }
}
