import { intro, select, text } from "@clack/prompts"

import { ProjectNameValidator } from "./Validator.js"

export class Prompt {
  constructor(config = {}) {
    this.config = config
  }

  async ask() {
    throw new Error("Method ask() must be implemented")
  }
}

export class SelectPrompt extends Prompt {
  constructor(message, options) {
    super({ message, options })
  }

  async ask() {
    return await select({
      message: this.config.message,
      options: this.config.options
    })
  }
}

export class TextPrompt extends Prompt {
  constructor(message, placeholder = "", validator = null) {
    super({ message, placeholder, validator })
  }

  async ask() {
    return await text({
      message: this.config.message,
      placeholder: this.config.placeholder,
      validate: this.config.validator ? (value) => this.config.validator.validate(value) : undefined
    })
  }
}

export class IntroPrompt extends Prompt {
  constructor(message) {
    super({ message })
  }

  ask() {
    intro(this.config.message)
  }
}

export class PromptFactory {
  static createPackageManagerPrompt() {
    return new SelectPrompt("Select a package manager:", [
      { value: "npm", label: "npm" },
      { value: "pnpm", label: "pnpm" },
      { value: "yarn", label: "yarn" },
      { value: "bun", label: "bun" }
    ])
  }

  static createProjectNamePrompt() {
    return new TextPrompt("What is your project name?", "my-next-app", new ProjectNameValidator())
  }

  static createLinterFormatterPrompt() {
    return new SelectPrompt("Configure linter and formatter:", [
      { value: "eslint-prettier", label: "ESLint + Prettier", hint: "Recommended" },
      { value: "biome", label: "Biome" },
      { value: "none", label: "None" }
    ])
  }

  static createDockerConfigPrompt() {
    return new SelectPrompt("Configure Docker:", [
      { value: "dev", label: "Development (Dockerfile.dev + docker-compose.dev.yml)" },
      { value: "prod", label: "Production (Dockerfile.prod + docker-compose.prod.yml)" },
      { value: "both", label: "Both (Dev + Prod)" },
      { value: "none", label: "None" }
    ])
  }

  static createTailwindPrompt() {
    return new SelectPrompt("Do you want to use Tailwind CSS?", [
      { value: true, label: "Yes", hint: "Recommended" },
      { value: false, label: "No" }
    ])
  }

  static createIntroPrompt(message) {
    return new IntroPrompt(message)
  }

  static createStoreManagerPrompt() {
    return new SelectPrompt("Select a store manager for this module:", [
      { value: "zustand", label: "Zustand", hint: "Lightweight and simple" },
      { value: "redux", label: "Redux", hint: "Full-featured state management" },
      { value: "none", label: "None", hint: "No store boilerplate" }
    ])
  }

  static createUILibraryPrompt() {
    return new SelectPrompt("Configure UI component library:", [
      { value: "mui", label: "Material UI", hint: "Complete component library" },
      { value: "shadcn", label: "shadcn/ui", hint: "Customizable components with Tailwind" },
      { value: "heroui", label: "HeroUI", hint: "Modern React UI with Tailwind v4" },
      { value: "none", label: "None", hint: "Skip UI library setup" }
    ])
  }

  static createGitSetupPrompt() {
    return new SelectPrompt("Configure Git with Commitizen, Commitlint, Husky & Lint-staged?", [
      { value: true, label: "Yes", hint: "Recommended for better commit quality" },
      { value: false, label: "No" }
    ])
  }

  static createOpenAPIDocsDirPrompt() {
    return new TextPrompt("OpenAPI docs directory:", "docs", null)
  }

  static createOpenAPIOutputDirPrompt() {
    return new TextPrompt("Generated clients output directory:", "generated", null)
  }
}
