import * as vscode from "vscode"

import { GenerateClientsCommand } from "./commands/generateClients"
import { GenerateModuleCommand } from "./commands/generateModule"
import { InitProjectCommand } from "./commands/initProject"
import { RegenerateConfigCommand } from "./commands/regenerateConfig"
import { AvangCliManager } from "./services/avangCliManager"

export async function activate(context: vscode.ExtensionContext) {
  console.warn("AvangCLI extension is now active!")

  const avangCliManager = new AvangCliManager()

  const isAvailable = await avangCliManager.isAvangCliAvailable()
  if (!isAvailable) {
    console.warn("AvangCLI not found, installing...")
    const terminal = vscode.window.createTerminal("AvangCLI Install")
    terminal.show()
    terminal.sendText("npm install -g avangcli")
    vscode.window.showInformationMessage("Installing AvangCLI globally...")
  }

  const initProjectCommand = new InitProjectCommand(avangCliManager)
  const generateModuleCommand = new GenerateModuleCommand(avangCliManager)
  const regenerateConfigCommand = new RegenerateConfigCommand(avangCliManager)
  const generateClientsCommand = new GenerateClientsCommand(avangCliManager)

  context.subscriptions.push(
    vscode.commands.registerCommand("avangcli.initProject", () => initProjectCommand.execute()),
    vscode.commands.registerCommand("avangcli.generateModule", () => generateModuleCommand.execute()),
    vscode.commands.registerCommand("avangcli.regenerateConfig", () => regenerateConfigCommand.execute()),
    vscode.commands.registerCommand("avangcli.generateClients", () => generateClientsCommand.execute())
  )
}

export function deactivate() {
  // NOTE: Cleanup extension resources
}
