export class PackageManagerStrategy {
  constructor(name) {
    if (this.constructor === PackageManagerStrategy) {
      throw new Error("Cannot instantiate abstract class PackageManagerStrategy")
    }
    this.name = name
  }

  getCreateCommand() {
    throw new Error("Method getCreateCommand() must be implemented")
  }

  getInstallCommand() {
    throw new Error("Method getInstallCommand() must be implemented")
  }

  getRunCommand() {
    return `${this.name} run`
  }
}

export class NpmStrategy extends PackageManagerStrategy {
  constructor() {
    super("npm")
  }

  getCreateCommand() {
    return "npx"
  }

  getInstallCommand() {
    return { cmd: "npm", args: ["install"] }
  }

  getRunCommand() {
    return "npm run"
  }
}

export class PnpmStrategy extends PackageManagerStrategy {
  constructor() {
    super("pnpm")
  }

  getCreateCommand() {
    return "pnpm"
  }

  getInstallCommand() {
    return { cmd: "pnpm", args: ["add"] }
  }

  getRunCommand() {
    return "pnpm"
  }
}

export class YarnStrategy extends PackageManagerStrategy {
  constructor() {
    super("yarn")
  }

  getCreateCommand() {
    return "yarn"
  }

  getInstallCommand() {
    return { cmd: "yarn", args: ["add"] }
  }

  getRunCommand() {
    return "yarn"
  }
}

export class BunStrategy extends PackageManagerStrategy {
  constructor() {
    super("bun")
  }

  getCreateCommand() {
    return "bunx"
  }

  getInstallCommand() {
    return { cmd: "bun", args: ["add"] }
  }

  getRunCommand() {
    return "bun"
  }
}

export class PackageManagerFactory {
  static strategies = {
    npm: NpmStrategy,
    pnpm: PnpmStrategy,
    yarn: YarnStrategy,
    bun: BunStrategy
  }

  static create(packageManager) {
    const Strategy = this.strategies[packageManager]
    if (!Strategy) {
      throw new Error(`Unknown package manager: ${packageManager}`)
    }
    return new Strategy()
  }

  static getAvailable() {
    return Object.keys(this.strategies)
  }
}
