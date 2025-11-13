import fs from 'fs'
import path from 'path'

export class NextJsValidator {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath
  }

  /**
   * Validates if the current directory is a Next.js project
   * @returns {Object} { isValid: boolean, errors: string[], nextVersion: string|null }
   */
  validate() {
    const errors = []
    let isValid = false
    let nextVersion = null

    const packageJsonPath = path.join(this.projectPath, 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      errors.push('  ✗ package.json not found')
      return { isValid: false, errors, nextVersion }
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

      if (dependencies.next) {
        isValid = true
        nextVersion = dependencies.next
      } else {
        errors.push('  ✗ Next.js dependency not found in package.json')
      }
    } catch (error) {
      errors.push('  ✗ Error reading package.json: ' + error.message)
      return { isValid: false, errors, nextVersion }
    }

    const nextConfigFiles = ['next.config.js', 'next.config.mjs', 'next.config.ts']
    const hasNextConfig = nextConfigFiles.some(configFile =>
      fs.existsSync(path.join(this.projectPath, configFile))
    )

    const hasAppDir = fs.existsSync(path.join(this.projectPath, 'app'))
    const hasPagesDir = fs.existsSync(path.join(this.projectPath, 'pages'))
    const hasSrcAppDir = fs.existsSync(path.join(this.projectPath, 'src', 'app'))
    const hasSrcPagesDir = fs.existsSync(path.join(this.projectPath, 'src', 'pages'))

    const hasValidStructure = hasAppDir || hasPagesDir || hasSrcAppDir || hasSrcPagesDir

    if (isValid) {
      if (!hasNextConfig) {
        errors.push('  ⚠ Warning: No next.config.{js,mjs,ts} file found (this is optional)')
      }
      if (!hasValidStructure) {
        errors.push('  ⚠ Warning: No app/ or pages/ directory found (this is optional)')
      }
    }

    if (isValid) {
      const hasNodeModules = fs.existsSync(path.join(this.projectPath, 'node_modules'))
      if (!hasNodeModules) {
        errors.push('  ⚠ Warning: node_modules not found. Run npm/yarn/pnpm/bun install first')
      }
    }

    return {
      isValid,
      errors: errors.length > 0 ? errors : [],
      nextVersion,
      structure: {
        hasNextConfig,
        hasAppDir: hasAppDir || hasSrcAppDir,
        hasPagesDir: hasPagesDir || hasSrcPagesDir,
        usingSrcDir: hasSrcAppDir || hasSrcPagesDir
      }
    }
  }

  /**
   * Gets the base source directory (with or without 'src/')
   * @returns {string} The base path for the project structure
   */
  getSourceDirectory() {
    const hasSrcDir = fs.existsSync(path.join(this.projectPath, 'src'))
    return hasSrcDir ? path.join(this.projectPath, 'src') : this.projectPath
  }

  /**
   * Checks if a module already exists
   * @param {string} moduleName - Name of the module to check
   * @returns {boolean}
   */
  moduleExists(moduleName) {
    const sourceDir = this.getSourceDirectory()
    const modulePath = path.join(sourceDir, 'modules', moduleName)
    return fs.existsSync(modulePath)
  }

  /**
   * Checks if this is a Next.js project
   * @returns {boolean}
   */
  isNextJsProject() {
    const packageJsonPath = path.join(this.projectPath, 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      return false
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
      return !!dependencies.next
    } catch (error) {
      return false
    }
  }

  /**
   * Detects the package manager being used
   * @returns {string|null} 'npm', 'yarn', 'pnpm', 'bun', or null
   */
  detectPackageManager() {
    if (fs.existsSync(path.join(this.projectPath, 'bun.lockb'))) {
      return 'bun'
    }
    if (fs.existsSync(path.join(this.projectPath, 'pnpm-lock.yaml'))) {
      return 'pnpm'
    }
    if (fs.existsSync(path.join(this.projectPath, 'yarn.lock'))) {
      return 'yarn'
    }
    if (fs.existsSync(path.join(this.projectPath, 'package-lock.json'))) {
      return 'npm'
    }
    return null
  }

  /**
   * Checks if Tailwind CSS is configured
   * @returns {boolean}
   */
  hasTailwindConfig() {
    const tailwindConfigs = ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.mjs']
    return tailwindConfigs.some(config => fs.existsSync(path.join(this.projectPath, config)))
  }
}
