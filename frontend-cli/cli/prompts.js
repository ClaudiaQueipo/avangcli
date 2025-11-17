import { log } from "@clack/prompts"

import { PromptFactory } from "./core/Prompt.js"

const ASCII_ART = `
 █████╗ ██╗   ██╗ █████╗ ███╗   ██╗ ██████╗        ██████╗██╗     ██╗
██╔══██╗██║   ██║██╔══██╗████╗  ██║██╔════╝       ██╔════╝██║     ██║
███████║██║   ██║███████║██╔██╗ ██║██║  ███╗█████╗██║     ██║     ██║
██╔══██║╚██╗ ██╔╝██╔══██║██║╚██╗██║██║   ██║╚════╝██║     ██║     ██║
██║  ██║ ╚████╔╝ ██║  ██║██║ ╚████║╚██████╔╝      ╚██████╗███████╗██║
╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝        ╚═════╝╚══════╝╚═╝
`

export class PromptsManager {
  showWelcome() {
    log.info(ASCII_ART)
    const introPrompt = PromptFactory.createIntroPrompt("Next.js Project Generator")
    introPrompt.ask()
  }

  async askPackageManager() {
    const prompt = PromptFactory.createPackageManagerPrompt()
    return await prompt.ask()
  }

  async askProjectName() {
    const prompt = PromptFactory.createProjectNamePrompt()
    return await prompt.ask()
  }

  async askLinterFormatter() {
    const prompt = PromptFactory.createLinterFormatterPrompt()
    return await prompt.ask()
  }

  async askDockerConfig() {
    const prompt = PromptFactory.createDockerConfigPrompt()
    return await prompt.ask()
  }

  async askTailwind() {
    const prompt = PromptFactory.createTailwindPrompt()
    return await prompt.ask()
  }

  async askUILibrary() {
    const prompt = PromptFactory.createUILibraryPrompt()
    return await prompt.ask()
  }

  async askGitSetup() {
    const prompt = PromptFactory.createGitSetupPrompt()
    return await prompt.ask()
  }
}

export const promptsManager = new PromptsManager()

export const showWelcome = () => promptsManager.showWelcome()
export const askPackageManager = () => promptsManager.askPackageManager()
export const askProjectName = () => promptsManager.askProjectName()
export const askLinterFormatter = () => promptsManager.askLinterFormatter()
export const askDockerConfig = () => promptsManager.askDockerConfig()
export const askTailwind = () => promptsManager.askTailwind()
export const askUILibrary = () => promptsManager.askUILibrary()
export const askGitSetup = () => promptsManager.askGitSetup()
