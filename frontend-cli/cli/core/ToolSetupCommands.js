import { log } from "@clack/prompts"
import { promises as fs } from "fs"
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
      "@eslint/js",
      "globals",
      "@typescript-eslint/eslint-plugin",
      "@typescript-eslint/parser",
      "eslint-plugin-react",
      "eslint-plugin-react-hooks",
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
      { file: ".prettierignore", target: ".prettierignore" }
    ]

    for (const { file, target } of templates) {
      await this.copyTemplate(join(templatesDir, file), join(this.projectPath, target))
    }

    await this.updatePackageJson()
  }

  async updatePackageJson() {
    const packageJsonPath = join(this.projectPath, "package.json")
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"))

    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }

    packageJson.scripts.format = "prettier --write ."
    packageJson.scripts.lint = "eslint ."

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
  }

  logSuccess() {
    log.success("✓ ESLint + Prettier configured successfully!")
  }

  logError() {
    log.error("✗ Failed to setup ESLint + Prettier")
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

    await this.updatePackageJson()
  }

  async updatePackageJson() {
    const packageJsonPath = join(this.projectPath, "package.json")
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"))

    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }

    packageJson.scripts.format = "biome format --write ."
    packageJson.scripts.lint = "biome check ."

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
  }

  logSuccess() {
    log.success("✓ Biome configured successfully!")
  }

  logError() {
    log.error("✗ Failed to setup Biome")
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
    log.success("✓ Docker configuration setup successfully!")
  }

  logError() {
    log.error("✗ Failed to setup Docker")
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
    log.success("✓ Material UI configured successfully!")
    log.info("\nNext steps:")
    log.info("  1. Import ThemeProvider in your layout or _app file")
    log.info('  2. Start using MUI components: import { Button } from "@mui/material"')
  }

  logError() {
    log.error("✗ Failed to setup Material UI")
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

    log.info("\n📦 Installing default shadcn components (button, label)...")

    try {
      await this.commandExecutor.execute("npx", ["shadcn@latest", "add", "button", "--yes", "--overwrite"], {
        cwd: this.projectPath
      })
      log.success("  ✓ Button component installed")
    } catch (error) {
      log.warning(`  ⚠ Warning: Failed to install button component: ${error.message}`)
    }

    try {
      await this.commandExecutor.execute("npx", ["shadcn@latest", "add", "label", "--yes", "--overwrite"], {
        cwd: this.projectPath
      })
      log.success("  ✓ Label component installed")
    } catch (error) {
      log.warning(`  ⚠ Warning: Failed to install label component: ${error.message}`)
    }
  }

  logSuccess() {
    log.success("\n✓ shadcn/ui configured successfully!")
    log.info("\nDefault components installed:")
    log.info("  - Button (components/ui/button.tsx)")
    log.info("  - Label (components/ui/label.tsx)")
    log.info("\nAdd more components:")
    log.info("  npx shadcn@latest add <component-name>")
    log.info("\nExample usage:")
    log.info('  import { Button } from "@/components/ui/button"')
  }

  logError() {
    log.error("✗ Failed to setup shadcn/ui")
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
    log.success("✓ Tailwind CSS configured successfully!")
  }

  logError() {
    log.error("✗ Failed to setup Tailwind CSS")
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
    log.success("\n✓ HeroUI configured successfully!")
    log.info("\nConfiguration files created:")
    log.info("  - hero.ts (HeroUI Tailwind plugin)")
    log.info("  - app/globals.css (Updated with HeroUI imports)")
    log.info("  - app/providers.tsx (HeroUIProvider component)")
    log.info("  - app/layout.tsx (Root layout with HeroUIProvider)")
    log.info("\nNext steps:")
    log.info("  1. Install heroui CLI globally: npm install -g heroui-cli")
    log.info("  2. Add components: heroui add button")
    log.info('  3. Import components: import { Button } from "@heroui/react"')
    log.info("\nThe HeroUIProvider is already configured in your layout!")
  }

  logError() {
    log.error("✗ Failed to setup HeroUI")
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

    await this.updatePackageJson()
  }

  async updatePackageJson() {
    const packageJsonPath = join(this.projectPath, "package.json")
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"))

    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }

    packageJson.scripts.commit = "cz"
    packageJson.type = "module"

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
  }

  async setupAdditionalConfig() {
    log.info("\n📦 Initializing Git repository...")
    await this.commandExecutor.execute("git", ["init"], {
      cwd: this.projectPath
    })
    log.success("  ✓ Git repository initialized")
  }

  async postInstall() {
    log.info("\n📦 Setting up Commitizen...")
    await this.commandExecutor.execute(
      "npx",
      ["commitizen", "init", "cz-conventional-changelog", "--save-dev", "--save-exact"],
      {
        cwd: this.projectPath
      }
    )
    log.success("  ✓ Commitizen configured")

    log.info("\n📦 Setting up Husky...")
    await this.commandExecutor.execute("npx", ["husky", "init"], {
      cwd: this.projectPath
    })
    log.success("  ✓ Husky initialized")

    const commitMsgHook = `npx --no -- commitlint --edit \${1}`
    await fs.writeFile(join(this.projectPath, ".husky", "commit-msg"), `#!/usr/bin/env sh\n${commitMsgHook}\n`)

    const preCommitHook = `npx lint-staged`
    await fs.writeFile(join(this.projectPath, ".husky", "pre-commit"), `#!/usr/bin/env sh\n${preCommitHook}\n`)

    log.success("  ✓ Husky hooks configured (commit-msg, pre-commit)")
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
    log.success("\n✓ Git setup completed successfully!")
    log.info("\nConfigured tools:")
    log.info("  - Git repository initialized")
    log.info("  - Commitizen (conventional commits)")
    log.info("  - Commitlint (commit message validation)")
    log.info("  - Husky (Git hooks)")
    log.info("  - Lint-staged (pre-commit linting)")
    log.info("\nUsage:")
    log.info("  - Make your changes and stage them: git add .")
    log.info("  - Create a commit with Commitizen: npx cz")
    log.info('  - Or use regular commit: git commit -m "feat: your message"')
    log.info("  - Pre-commit hook will automatically format and lint your code")
  }

  logError() {
    log.error("✗ Failed to setup Git configuration")
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
