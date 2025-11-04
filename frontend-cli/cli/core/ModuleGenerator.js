import fs from 'fs'
import path from 'path'
import { NextJsValidator } from './NextJsValidator.js'

export class ModuleGenerator {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath
    this.validator = new NextJsValidator(projectPath)
  }

  /**
   * Generates a new module with the specified name
   * @param {string} moduleName - Name of the module (kebab-case)
   * @returns {Object} { success: boolean, files: string[], error?: string }
   */
  async generate(moduleName) {
    try {
      // Check if module already exists
      if (this.validator.moduleExists(moduleName)) {
        return {
          success: false,
          error: `Module "${moduleName}" already exists`,
          files: []
        }
      }

      // Get source directory
      const sourceDir = this.validator.getSourceDirectory()
      const modulesDir = path.join(sourceDir, 'modules')
      const modulePath = path.join(modulesDir, moduleName)

      // Create modules directory if it doesn't exist
      if (!fs.existsSync(modulesDir)) {
        fs.mkdirSync(modulesDir, { recursive: true })
      }

      // Create module directory
      fs.mkdirSync(modulePath, { recursive: true })

      // Define folder structure
      const folders = [
        'components',
        'containers',
        'adapters',
        'types',
        'services',
        'hooks',
        'store',
        'lib',
        'helpers'
      ]

      // Create all folders
      folders.forEach(folder => {
        const folderPath = path.join(modulePath, folder)
        fs.mkdirSync(folderPath, { recursive: true })
      })

      // Generate boilerplate files
      const createdFiles = []

      // 1. Generate Container
      const containerFile = this.generateContainer(moduleName, modulePath)
      createdFiles.push(containerFile)

      // 2. Generate Service
      const serviceFile = this.generateService(moduleName, modulePath)
      createdFiles.push(serviceFile)

      // 3. Generate types file
      const typesFile = this.generateTypes(moduleName, modulePath)
      createdFiles.push(typesFile)

      // 4. Generate index file for barrel exports
      const indexFile = this.generateIndexFile(moduleName, modulePath)
      createdFiles.push(indexFile)

      // Return relative paths from project root
      const relativeFiles = createdFiles.map(file =>
        path.relative(this.projectPath, file)
      )

      return {
        success: true,
        files: relativeFiles,
        modulePath: path.relative(this.projectPath, modulePath)
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate module: ${error.message}`,
        files: []
      }
    }
  }

  /**
   * Generates the container component file
   * @param {string} moduleName - Name of the module
   * @param {string} modulePath - Path to the module directory
   * @returns {string} Path to the created file
   */
  generateContainer(moduleName, modulePath) {
    const pascalName = this.toPascalCase(moduleName)
    const containerFileName = `${moduleName}-container.tsx`
    const containerPath = path.join(modulePath, 'containers', containerFileName)

    const containerContent = `'use client'

import React from 'react'

interface ${pascalName}ContainerProps {
  // Add your props here
}

/**
 * ${pascalName}Container
 *
 * Main container component for the ${moduleName} module.
 * Handles the main logic and state management for this feature.
 */
export const ${pascalName}Container: React.FC<${pascalName}ContainerProps> = (props) => {
  // Add your logic here

  return (
    <div className="${moduleName}-container">
      <h1>${pascalName} Module</h1>
      <p>This is the main container for the ${moduleName} module.</p>
    </div>
  )
}

${pascalName}Container.displayName = '${pascalName}Container'
`

    fs.writeFileSync(containerPath, containerContent)
    return containerPath
  }

  /**
   * Generates the service file
   * @param {string} moduleName - Name of the module
   * @param {string} modulePath - Path to the module directory
   * @returns {string} Path to the created file
   */
  generateService(moduleName, modulePath) {
    const pascalName = this.toPascalCase(moduleName)
    const camelName = this.toCamelCase(moduleName)
    const serviceFileName = `${moduleName}.service.ts`
    const servicePath = path.join(modulePath, 'services', serviceFileName)

    const serviceContent = `/**
 * ${pascalName}Service
 *
 * Service class for handling ${moduleName} module business logic.
 * Implements the singleton pattern for consistent state management.
 */
export class ${pascalName}Service {
  private static instance: ${pascalName}Service

  private constructor() {
    // Private constructor to prevent direct instantiation
    this.initialize()
  }

  /**
   * Gets the singleton instance of ${pascalName}Service
   */
  public static getInstance(): ${pascalName}Service {
    if (!${pascalName}Service.instance) {
      ${pascalName}Service.instance = new ${pascalName}Service()
    }
    return ${pascalName}Service.instance
  }

  /**
   * Initialize the service
   */
  private initialize(): void {
    // Add initialization logic here
  }

  /**
   * Example method - Replace with your actual business logic
   */
  public async fetchData(): Promise<any> {
    try {
      // Add your data fetching logic here
      return { message: '${pascalName} data' }
    } catch (error) {
      console.error('Error fetching ${moduleName} data:', error)
      throw error
    }
  }

  /**
   * Example method - Replace with your actual business logic
   */
  public processData(data: any): any {
    // Add your data processing logic here
    return data
  }
}

// Export singleton instance
export const ${camelName}Service = ${pascalName}Service.getInstance()
`

    fs.writeFileSync(servicePath, serviceContent)
    return servicePath
  }

  /**
   * Generates the types file
   * @param {string} moduleName - Name of the module
   * @param {string} modulePath - Path to the module directory
   * @returns {string} Path to the created file
   */
  generateTypes(moduleName, modulePath) {
    const pascalName = this.toPascalCase(moduleName)
    const typesFileName = `${moduleName}.types.ts`
    const typesPath = path.join(modulePath, 'types', typesFileName)

    const typesContent = `/**
 * Type definitions for ${moduleName} module
 */

export interface ${pascalName}Data {
  id: string
  // Add your data properties here
}

export interface ${pascalName}State {
  isLoading: boolean
  error: string | null
  data: ${pascalName}Data | null
}

export interface ${pascalName}Actions {
  // Add your action types here
  fetch: () => Promise<void>
  reset: () => void
}

export type ${pascalName}Status = 'idle' | 'loading' | 'success' | 'error'
`

    fs.writeFileSync(typesPath, typesContent)
    return typesPath
  }

  /**
   * Generates the index file for barrel exports
   * @param {string} moduleName - Name of the module
   * @param {string} modulePath - Path to the module directory
   * @returns {string} Path to the created file
   */
  generateIndexFile(moduleName, modulePath) {
    const pascalName = this.toPascalCase(moduleName)
    const camelName = this.toCamelCase(moduleName)
    const indexPath = path.join(modulePath, 'index.ts')

    const indexContent = `/**
 * ${pascalName} Module
 *
 * Barrel export file for the ${moduleName} module.
 * Import from this file to access the module's public API.
 */

// Containers
export { ${pascalName}Container } from './containers/${moduleName}-container'

// Services
export { ${pascalName}Service, ${camelName}Service } from './services/${moduleName}.service'

// Types
export type {
  ${pascalName}Data,
  ${pascalName}State,
  ${pascalName}Actions,
  ${pascalName}Status
} from './types/${moduleName}.types'
`

    fs.writeFileSync(indexPath, indexContent)
    return indexPath
  }

  /**
   * Converts kebab-case to PascalCase
   * @param {string} str - String in kebab-case
   * @returns {string} String in PascalCase
   */
  toPascalCase(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  /**
   * Converts kebab-case to camelCase
   * @param {string} str - String in kebab-case
   * @returns {string} String in camelCase
   */
  toCamelCase(str) {
    const pascal = this.toPascalCase(str)
    return pascal.charAt(0).toLowerCase() + pascal.slice(1)
  }
}
