import { spawn } from "child_process"
import * as vscode from "vscode"

export class AvangCliManager {
  private getAvangCliPath(): string {
    // NOTE: Check if avangcli is installed globally
    return "avangcli"
  }

  public async executeCommand(
    command: string,
    args: string[] = [],
    cwd?: string
  ): Promise<{ success: boolean; output: string; error: string }> {
    return new Promise((resolve) => {
      const cmd = this.getAvangCliPath()
      // NOTE: Construct command string

      const child = spawn(cmd, [command, ...args], {
        cwd: cwd || vscode.workspace.rootPath,
        shell: true
      })

      let output = ""
      let error = ""

      child.stdout?.on("data", (data) => {
        output += data.toString()
      })

      child.stderr?.on("data", (data) => {
        error += data.toString()
      })

      child.on("close", (code) => {
        resolve({
          success: code === 0,
          output: output.trim(),
          error: error.trim()
        })
      })

      child.on("error", (err) => {
        resolve({
          success: false,
          output: "",
          error: err.message
        })
      })
    })
  }

  public async isAvangCliAvailable(): Promise<boolean> {
    try {
      const result = await this.executeCommand("--version")
      return result.success
    } catch {
      return false
    }
  }

  public async showInstallationPrompt(): Promise<void> {
    const installOption = await vscode.window.showErrorMessage(
      "AvangCLI is not installed. Would you like to install it?",
      "Install Globally",
      "Learn More"
    )

    if (installOption === "Install Globally") {
      const terminal = vscode.window.createTerminal("AvangCLI Install")
      terminal.show()
      terminal.sendText("npm install -g avangcli")
      vscode.window.showInformationMessage("Installing AvangCLI globally...")
    } else if (installOption === "Learn More") {
      vscode.env.openExternal(vscode.Uri.parse("https://github.com/ClaudiaQueipo/avangcli"))
    }
  }

  public getConfig<T>(key: string): T | undefined {
    return vscode.workspace.getConfiguration("avangcli").get(key)
  }

  public async getWorkspaceRoot(): Promise<string | undefined> {
    if (vscode.workspace.rootPath) {
      return vscode.workspace.rootPath
    }

    const folders = vscode.workspace.workspaceFolders
    if (folders && folders.length > 0) {
      return folders[0].uri.fsPath
    }

    return undefined
  }
}
