import { log, warn } from "@clack/prompts"
import fs from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

import { SetupCommand } from "./SetupCommand.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class EslintPrettierSetupCommand extends SetupCommand {
  constructor(packageManagerStrategy, projectPath, commandExecutor) {
    super(packageManagerStrategy, projectPath)
    this.commandExecutor = commandExecutor
  }

  startSpinner() {
    this.spinner.start("Installing ESLint + Prettier dependencies...")
  }

  async installDependencies() {
    const { cmd, args } = this.packageManagerStrategy.getInstallCommand()
    const dependencies = [
      "eslint",
      "prettier",
      "eslint-config-prettier",
      "@eslint/eslintrc",
      "@eslint/js",
      "eslint-config-next"
    ]

    this.spinner.stop()

    await this.commandExecutor.execute(cmd, [...args, "-D", ...dependencies], {
      cwd: this.projectPath
    })
  }

  async copyTemplates() {
    const templatesDir = join(__dirname, "..", "..", "templates", "eslint-prettier")

    const templates = [
      { file: ".prettierrc", target: ".prettierrc" },
      { file: "eslint.config.mjs", target: "eslint.config.mjs" },
      { file: ".eslintignore", target: ".eslintignore" },
      { file: ".prettierignore", target: ".prettierignore" }
    ]

    for (const { file, target } of templates) {
      await this.copyTemplate(join(templatesDir, file), join(this.projectPath, target))
    }
  }

  logSuccess() {
    log("✓ ESLint + Prettier configured successfully!")
  }

  logError() {
    console.error("✗ Failed to setup ESLint + Prettier")
  }
}

export class BiomeSetupCommand extends SetupCommand {
  constructor(packageManagerStrategy, projectPath, commandExecutor) {
    super(packageManagerStrategy, projectPath)
    this.commandExecutor = commandExecutor
  }

  startSpinner() {
    this.spinner.start("Installing Biome dependency...")
  }

  async installDependencies() {
    const { cmd, args } = this.packageManagerStrategy.getInstallCommand()

    this.spinner.stop()

    await this.commandExecutor.execute(cmd, [...args, "-D", "@biomejs/biome"], {
      cwd: this.projectPath
    })
  }

  async copyTemplates() {
    const templatesDir = join(__dirname, "..", "..", "templates", "biome")

    const templates = [
      { file: "biome.json", target: "biome.json" },
      { file: ".biomeignore", target: ".biomeignore" }
    ]

    for (const { file, target } of templates) {
      await this.copyTemplate(join(templatesDir, file), join(this.projectPath, target))
    }
  }

  logSuccess() {
    log("✓ Biome configured successfully!")
  }

  logError() {
    console.error("✗ Failed to setup Biome")
  }
}

export class DockerSetupCommand extends SetupCommand {
  constructor(dockerConfig, projectPath) {
    super(null, projectPath)
    this.dockerConfig = dockerConfig
  }

  startSpinner() {
    this.spinner.start("Setting up Docker configuration...")
  }

  async installDependencies() {
    this.spinner.stop()
  }

  async copyTemplates() {
    const templatesDir = join(__dirname, "..", "..", "templates", "docker")

    await this.copyTemplate(join(templatesDir, ".dockerignore"), join(this.projectPath, ".dockerignore"))

    if (this.dockerConfig === "dev" || this.dockerConfig === "both") {
      await this.copyTemplate(join(templatesDir, "Dockerfile.dev"), join(this.projectPath, "Dockerfile.dev"))
      await this.copyTemplate(
        join(templatesDir, "docker-compose.dev.yml"),
        join(this.projectPath, "docker-compose.dev.yml")
      )
    }

    if (this.dockerConfig === "prod" || this.dockerConfig === "both") {
      await this.copyTemplate(join(templatesDir, "Dockerfile.prod"), join(this.projectPath, "Dockerfile.prod"))
      await this.copyTemplate(
        join(templatesDir, "docker-compose.prod.yml"),
        join(this.projectPath, "docker-compose.prod.yml")
      )
    }
  }

  logSuccess() {
    log("✓ Docker configuration setup successfully!")
  }

  logError() {
    console.error("✗ Failed to setup Docker")
  }
}

export class MaterialUISetupCommand extends SetupCommand {
  constructor(packageManagerStrategy, projectPath, commandExecutor) {
    super(packageManagerStrategy, projectPath)
    this.commandExecutor = commandExecutor
  }

  startSpinner() {
    this.spinner.start("Installing Material UI dependencies...")
  }

  async installDependencies() {
    const { cmd, args } = this.packageManagerStrategy.getInstallCommand()
    const dependencies = ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"]

    this.spinner.stop()

    await this.commandExecutor.execute(cmd, [...args, ...dependencies], {
      cwd: this.projectPath
    })
  }

  async copyTemplates() {
    //
  }

  logSuccess() {
    log("✓ Material UI configured successfully!")
    log("\nNext steps:")
    log("  1. Import ThemeProvider in your layout or _app file")
    log('  2. Start using MUI components: import { Button } from "@mui/material"')
  }

  logError() {
    console.error("✗ Failed to setup Material UI")
  }
}

export class ShadcnSetupCommand extends SetupCommand {
  constructor(packageManagerStrategy, projectPath, commandExecutor) {
    super(packageManagerStrategy, projectPath)
    this.commandExecutor = commandExecutor
  }

  startSpinner() {
    this.spinner.start("Installing shadcn/ui dependencies...")
  }

  async installDependencies() {
    const { cmd, args } = this.packageManagerStrategy.getInstallCommand()
    const dependencies = ["class-variance-authority", "clsx", "tailwind-merge"]

    this.spinner.stop()

    await this.commandExecutor.execute(cmd, [...args, ...dependencies], {
      cwd: this.projectPath
    })

    const devDependencies = ["@types/node", "tailwindcss-animate"]

    await this.commandExecutor.execute(cmd, [...args, "-D", ...devDependencies], {
      cwd: this.projectPath
    })
  }

  async copyTemplates() {
    const templatesDir = join(__dirname, "..", "..", "templates", "shadcn")

    const templates = [
      { file: "components.json", target: "components.json" },
      { file: "lib/utils.ts", target: "lib/utils.ts" }
    ]

    for (const { file, target } of templates) {
      await this.copyTemplate(join(templatesDir, file), join(this.projectPath, target))
    }

    log("\n📦 Installing default shadcn components (button, label)...")

    try {
      await this.commandExecutor.execute("npx", ["shadcn@latest", "add", "button", "--yes", "--overwrite"], {
        cwd: this.projectPath
      })
      log("  ✓ Button component installed")
    } catch (error) {
      warn("  ⚠ Warning: Failed to install button component:", error)
    }

    try {
      await this.commandExecutor.execute("npx", ["shadcn@latest", "add", "label", "--yes", "--overwrite"], {
        cwd: this.projectPath
      })
      log("  ✓ Label component installed")
    } catch (error) {
      warn("  ⚠ Warning: Failed to install label component:", error)
    }
  }

  logSuccess() {
    log("\n✓ shadcn/ui configured successfully!")
    log("\nDefault components installed:")
    log("  - Button (components/ui/button.tsx)")
    log("  - Label (components/ui/label.tsx)")
    log("\nAdd more components:")
    log("  npx shadcn@latest add <component-name>")
    log("\nExample usage:")
    log('  import { Button } from "@/components/ui/button"')
  }

  logError() {
    console.error("✗ Failed to setup shadcn/ui")
  }
}

export class TailwindSetupCommand extends SetupCommand {
  constructor(packageManagerStrategy, projectPath, commandExecutor) {
    super(packageManagerStrategy, projectPath)
    this.commandExecutor = commandExecutor
  }

  startSpinner() {
    this.spinner.start("Installing Tailwind CSS...")
  }

  async installDependencies() {
    const { cmd, args } = this.packageManagerStrategy.getInstallCommand()
    const dependencies = ["tailwindcss", "@tailwindcss/postcss"]

    this.spinner.stop()

    await this.commandExecutor.execute(cmd, [...args, "-D", ...dependencies], {
      cwd: this.projectPath
    })
  }

  async copyTemplates() {
    const templatesDir = join(__dirname, "..", "..", "templates", "tailwind")

    const templates = [{ file: "postcss.config.mjs", target: "postcss.config.mjs" }]

    for (const { file, target } of templates) {
      await this.copyTemplate(join(templatesDir, file), join(this.projectPath, target))
    }

    const globalsPath = join(this.projectPath, "app", "globals.css")
    if (fs.existsSync(globalsPath)) {
      const content = fs.readFileSync(globalsPath, "utf-8")
      if (!content.includes('@import "tailwindcss"')) {
        const tailwindImport = '@import "tailwindcss";\n\n'
        fs.writeFileSync(globalsPath, tailwindImport + content)
      }
    }
  }

  logSuccess() {
    log("✓ Tailwind CSS configured successfully!")
  }

  logError() {
    console.error("✗ Failed to setup Tailwind CSS")
  }
}

export class HeroUISetupCommand extends SetupCommand {
  constructor(packageManagerStrategy, projectPath, commandExecutor) {
    super(packageManagerStrategy, projectPath)
    this.commandExecutor = commandExecutor
  }

  startSpinner() {
    this.spinner.start("Installing HeroUI dependencies...")
  }

  async installDependencies() {
    const { cmd, args } = this.packageManagerStrategy.getInstallCommand()
    const dependencies = ["@heroui/react", "framer-motion"]

    this.spinner.stop()

    await this.commandExecutor.execute(cmd, [...args, ...dependencies], {
      cwd: this.projectPath
    })
  }

  async copyTemplates() {
    const templatesDir = join(__dirname, "..", "..", "templates", "heroui")

    const templates = [
      { file: "hero.ts", target: "hero.ts" },
      { file: "app/globals.css", target: "app/globals.css" },
      { file: "app/providers.tsx", target: "app/providers.tsx" },
      { file: "app/layout.tsx", target: "app/layout.tsx" }
    ]

    for (const { file, target } of templates) {
      await this.copyTemplate(join(templatesDir, file), join(this.projectPath, target))
    }
  }

  logSuccess() {
    log("\n✓ HeroUI configured successfully!")
    log("\nConfiguration files created:")
    log("  - hero.ts (HeroUI Tailwind plugin)")
    log("  - app/globals.css (Updated with HeroUI imports)")
    log("  - app/providers.tsx (HeroUIProvider component)")
    log("  - app/layout.tsx (Root layout with HeroUIProvider)")
    log("\nNext steps:")
    log("  1. Install heroui CLI globally: npm install -g heroui-cli")
    log("  2. Add components: heroui add button")
    log('  3. Import components: import { Button } from "@heroui/react"')
    log("\nThe HeroUIProvider is already configured in your layout!")
  }

  logError() {
    console.error("✗ Failed to setup HeroUI")
  }
}

export class GitSetupCommand extends SetupCommand {
  constructor(packageManagerStrategy, projectPath, commandExecutor, linterFormatter) {
    super(packageManagerStrategy, projectPath)
    this.commandExecutor = commandExecutor
    this.linterFormatter = linterFormatter
  }

  startSpinner() {
    this.spinner.start("Setting up Git with Commitizen, Commitlint, Husky & Lint-staged...")
  }

  async installDependencies() {
    const { cmd, args } = this.packageManagerStrategy.getInstallCommand()
    const dependencies = ["commitizen", "@commitlint/cli", "@commitlint/config-conventional", "husky", "lint-staged"]

    this.spinner.stop()

    await this.commandExecutor.execute(cmd, [...args, "-D", ...dependencies], {
      cwd: this.projectPath
    })
  }

  async copyTemplates() {
    const templatesDir = join(__dirname, "..", "..", "templates", "git-setup")

    await this.copyTemplate(join(templatesDir, "commitlint.config.js"), join(this.projectPath, "commitlint.config.js"))

    if (this.linterFormatter === "eslint-prettier") {
      await this.copyTemplate(
        join(templatesDir, "lint-staged.eslint-prettier.js"),
        join(this.projectPath, "lint-staged.config.js")
      )
    } else if (this.linterFormatter === "biome") {
      await this.copyTemplate(
        join(templatesDir, "lint-staged.biome.js"),
        join(this.projectPath, "lint-staged.config.js")
      )
    } else {
      await this.copyTemplate(
        join(templatesDir, "lint-staged.none.js"),
        join(this.projectPath, "lint-staged.config.js")
      )
    }
  }

  async setupAdditionalConfig() {
    log("\n📦 Initializing Git repository...")
    await this.commandExecutor.execute("git", ["init"], {
      cwd: this.projectPath
    })
    log("  ✓ Git repository initialized")
  }

  async postInstall() {
    log("\n📦 Setting up Commitizen...")
    await this.commandExecutor.execute(
      "npx",
      ["commitizen", "init", "cz-conventional-changelog", "--save-dev", "--save-exact"],
      {
        cwd: this.projectPath
      }
    )
    log("  ✓ Commitizen configured")

    log("\n📦 Setting up Husky...")
    await this.commandExecutor.execute("npx", ["husky", "init"], {
      cwd: this.projectPath
    })
    log("  ✓ Husky initialized")

    const commitMsgHook = `npx --no -- commitlint --edit \${1}`
    fs.writeFileSync(
      join(this.projectPath, ".husky", "commit-msg"),
      `#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\n${commitMsgHook}\n`
    )

    const preCommitHook = `npx lint-staged`
    fs.writeFileSync(
      join(this.projectPath, ".husky", "pre-commit"),
      `#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\n${preCommitHook}\n`
    )

    log("  ✓ Husky hooks configured (commit-msg, pre-commit)")
  }

  async execute() {
    try {
      await this.setupAdditionalConfig()

      await super.execute()

      await this.postInstall()

      this.logSuccess()
    } catch (error) {
      this.logError()
      throw error
    }
  }

  logSuccess() {
    log("\n✓ Git setup completed successfully!")
    log("\nConfigured tools:")
    log("  - Git repository initialized")
    log("  - Commitizen (conventional commits)")
    log("  - Commitlint (commit message validation)")
    log("  - Husky (Git hooks)")
    log("  - Lint-staged (pre-commit linting)")
    log("\nUsage:")
    log("  - Make your changes and stage them: git add .")
    log("  - Create a commit with Commitizen: npx cz")
    log('  - Or use regular commit: git commit -m "feat: your message"')
    log("  - Pre-commit hook will automatically format and lint your code")
  }

  logError() {
    console.error("✗ Failed to setup Git configuration")
  }
}

export class SetupCommandFactory {
  static createEslintPrettierSetup(packageManagerStrategy, projectPath, commandExecutor) {
    return new EslintPrettierSetupCommand(packageManagerStrategy, projectPath, commandExecutor)
  }

  static createBiomeSetup(packageManagerStrategy, projectPath, commandExecutor) {
    return new BiomeSetupCommand(packageManagerStrategy, projectPath, commandExecutor)
  }

  static createDockerSetup(dockerConfig, projectPath) {
    return new DockerSetupCommand(dockerConfig, projectPath)
  }

  static createTailwindSetup(packageManagerStrategy, projectPath, commandExecutor) {
    return new TailwindSetupCommand(packageManagerStrategy, projectPath, commandExecutor)
  }

  static createMaterialUISetup(packageManagerStrategy, projectPath, commandExecutor) {
    return new MaterialUISetupCommand(packageManagerStrategy, projectPath, commandExecutor)
  }

  static createShadcnSetup(packageManagerStrategy, projectPath, commandExecutor) {
    return new ShadcnSetupCommand(packageManagerStrategy, projectPath, commandExecutor)
  }

  static createHeroUISetup(packageManagerStrategy, projectPath, commandExecutor) {
    return new HeroUISetupCommand(packageManagerStrategy, projectPath, commandExecutor)
  }

  static createGitSetup(packageManagerStrategy, projectPath, commandExecutor, linterFormatter) {
    return new GitSetupCommand(packageManagerStrategy, projectPath, commandExecutor, linterFormatter)
  }
}
