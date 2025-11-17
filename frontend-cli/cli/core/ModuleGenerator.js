import fs from "fs"
import path from "path"

import { NextJsValidator } from "./NextJsValidator.js"

export class ModuleGenerator {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath
    this.validator = new NextJsValidator(projectPath)
  }

  /**
   * Generates a new module with the specified name
   * @param {string} moduleName - Name of the module (kebab-case)
   * @param {string} storeManager - Store manager to use ('zustand', 'redux', or 'none')
   * @returns {Object} { success: boolean, files: string[], error?: string }
   */
  async generate(moduleName, storeManager = "none") {
    try {
      if (this.validator.moduleExists(moduleName)) {
        return {
          success: false,
          error: `Module "${moduleName}" already exists`,
          files: []
        }
      }

      const sourceDir = this.validator.getSourceDirectory()
      const modulesDir = path.join(sourceDir, "modules")
      const modulePath = path.join(modulesDir, moduleName)

      if (!fs.existsSync(modulesDir)) {
        fs.mkdirSync(modulesDir, { recursive: true })
      }

      fs.mkdirSync(modulePath, { recursive: true })

      const folders = ["components", "containers", "adapters", "types", "services", "hooks", "store", "lib", "helpers"]

      folders.forEach((folder) => {
        const folderPath = path.join(modulePath, folder)
        fs.mkdirSync(folderPath, { recursive: true })
      })

      const createdFiles = []

      const containerFile = this.generateContainer(moduleName, modulePath)
      createdFiles.push(containerFile)

      const serviceFile = this.generateService(moduleName, modulePath)
      createdFiles.push(serviceFile)

      const typesFile = this.generateTypes(moduleName, modulePath)
      createdFiles.push(typesFile)

      if (storeManager === "zustand") {
        const storeFile = this.generateZustandStore(moduleName, modulePath)
        createdFiles.push(storeFile)
      } else if (storeManager === "redux") {
        const storeFile = this.generateReduxStore(moduleName, modulePath)
        createdFiles.push(storeFile)
      }

      const indexFile = this.generateIndexFile(moduleName, modulePath, storeManager)
      createdFiles.push(indexFile)

      const relativeFiles = createdFiles.map((file) => path.relative(this.projectPath, file))

      return {
        success: true,
        files: relativeFiles,
        modulePath: path.relative(this.projectPath, modulePath),
        storeManager
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate module: ${error.message}`,
        files: []
      }
    }
  }

  generateContainer(moduleName, modulePath) {
    const pascalName = this.toPascalCase(moduleName)
    const containerFileName = `${moduleName}-container.tsx`
    const containerPath = path.join(modulePath, "containers", containerFileName)

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
    const servicePath = path.join(modulePath, "services", serviceFileName)

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
    const typesPath = path.join(modulePath, "types", typesFileName)

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
   * Generates the Zustand store file
   * @param {string} moduleName - Name of the module
   * @param {string} modulePath - Path to the module directory
   * @returns {string} Path to the created file
   */
  generateZustandStore(moduleName, modulePath) {
    const pascalName = this.toPascalCase(moduleName)
    const storeFileName = `${moduleName}.store.ts`
    const storePath = path.join(modulePath, "store", storeFileName)

    const storeContent = `import { create } from 'zustand'
import type { ${pascalName}Data, ${pascalName}State } from '../types/${moduleName}.types'

interface ${pascalName}Store extends ${pascalName}State {
  // Actions
  setData: (data: ${pascalName}Data | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState: ${pascalName}State = {
  isLoading: false,
  error: null,
  data: null,
}

/**
 * ${pascalName} Zustand Store
 *
 * Manages state for the ${moduleName} module using Zustand.
 */
export const use${pascalName}Store = create<${pascalName}Store>((set) => ({
  ...initialState,

  setData: (data) => set({ data, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  reset: () => set(initialState),
}))
`

    fs.writeFileSync(storePath, storeContent)
    return storePath
  }

  generateReduxStore(moduleName, modulePath) {
    const pascalName = this.toPascalCase(moduleName)
    const camelName = this.toCamelCase(moduleName)
    const storeFileName = `${moduleName}.slice.ts`
    const storePath = path.join(modulePath, "store", storeFileName)

    const storeContent = `import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ${pascalName}Data, ${pascalName}State } from '../types/${moduleName}.types'

const initialState: ${pascalName}State = {
  isLoading: false,
  error: null,
  data: null,
}

/**
 * ${pascalName} Redux Slice
 *
 * Manages state for the ${moduleName} module using Redux Toolkit.
 */
const ${camelName}Slice = createSlice({
  name: '${moduleName}',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<${pascalName}Data | null>) => {
      state.data = action.payload
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    reset: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const ${camelName}Actions = ${camelName}Slice.actions
export const ${camelName}Reducer = ${camelName}Slice.reducer

// Selectors
export const select${pascalName}Data = (state: { ${camelName}: ${pascalName}State }) => state.${camelName}.data
export const select${pascalName}Loading = (state: { ${camelName}: ${pascalName}State }) => state.${camelName}.isLoading
export const select${pascalName}Error = (state: { ${camelName}: ${pascalName}State }) => state.${camelName}.error
`

    fs.writeFileSync(storePath, storeContent)
    return storePath
  }

  generateIndexFile(moduleName, modulePath, storeManager = "none") {
    const pascalName = this.toPascalCase(moduleName)
    const camelName = this.toCamelCase(moduleName)
    const indexPath = path.join(modulePath, "index.ts")

    let indexContent = `/**
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

    if (storeManager === "zustand") {
      indexContent += `
// Zustand Store
export { use${pascalName}Store } from './store/${moduleName}.store'
`
    } else if (storeManager === "redux") {
      indexContent += `
// Redux Store
export { ${camelName}Actions, ${camelName}Reducer } from './store/${moduleName}.slice'
export { select${pascalName}Data, select${pascalName}Loading, select${pascalName}Error } from './store/${moduleName}.slice'
`
    }

    fs.writeFileSync(indexPath, indexContent)
    return indexPath
  }
  toPascalCase(str) {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")
  }

  toCamelCase(str) {
    const pascal = this.toPascalCase(str)
    return pascal.charAt(0).toLowerCase() + pascal.slice(1)
  }
}
