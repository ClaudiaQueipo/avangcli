import { isCancel, cancel } from '@clack/prompts'
import { CommandExecutor } from './core/CommandExecutor.js'
import { PackageManagerFactory } from './core/PackageManagerStrategy.js'
import fs from 'fs'
import path from 'path'

export function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

export function toCamelCase(str) {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

export function detectPackageManager(cwd = process.cwd()) {
  if (fs.existsSync(path.join(cwd, 'bun.lockb')) || fs.existsSync(path.join(cwd, 'bun.lock'))) {
    return 'bun'
  }
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm'
  }
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    return 'yarn'
  }
  return 'npm'
}

export function isPackageInstalled(packageName, cwd = process.cwd()) {
  const packageJsonPath = path.join(cwd, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    return false
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }
    return packageName in allDeps
  } catch (error) {
    return false
  }
}

export function readPackageJson(cwd = process.cwd()) {
  const packageJsonPath = path.join(cwd, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    return null
  }

  try {
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  } catch (error) {
    console.warn('Failed to read package.json:', error.message)
    return null
  }
}

export function isValidKebabCase(str) {
  const kebabCasePattern = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/
  return kebabCasePattern.test(str)
}

export function validateModuleName(moduleName) {
  if (!moduleName || moduleName.trim() === '') {
    return {
      isValid: false,
      error: 'Module name is required'
    }
  }

  if (!isValidKebabCase(moduleName)) {
    return {
      isValid: false,
      error: 'Module name must be in kebab-case format (e.g., user, shopping-cart, user-profile)'
    }
  }

  return { isValid: true }
}

const commandExecutor = new CommandExecutor()

export function handleCancel(value) {
  if (isCancel(value)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }
}

export function getPackageManagerStrategy(packageManager) {
  return PackageManagerFactory.create(packageManager)
}

export async function executeCommand(command, args = [], options = {}) {
  return commandExecutor.execute(command, args, options)
}

export async function executeCommandWithOutput(command, args = [], options = {}) {
  return commandExecutor.executeWithOutput(command, args, options)
}

export function getCreateCommand(packageManager) {
  return getPackageManagerStrategy(packageManager).getCreateCommand()
}

export function getInstallCommand(packageManager) {
  return getPackageManagerStrategy(packageManager).getInstallCommand()
}
