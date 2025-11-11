import fs from 'fs'
import path from 'path'
import { NextJsValidator } from './NextJsValidator.js'
import { toPascalCase, toCamelCase } from '../utils.js'

export class ModuleGenerator {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath
    this.validator = new NextJsValidator(projectPath)
  }

  async generate(moduleName, storeManager = 'none') {
    try {
      if (this.validator.moduleExists(moduleName)) {
        return {
          success: false,
          error: `Module "${moduleName}" already exists`,
          files: []
        }
      }

      const sourceDir = this.validator.getSourceDirectory()
      const modulesDir = path.join(sourceDir, 'modules')
      const modulePath = path.join(modulesDir, moduleName)

      if (!fs.existsSync(modulesDir)) {
        fs.mkdirSync(modulesDir, { recursive: true })
      }

      fs.mkdirSync(modulePath, { recursive: true })

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

      folders.forEach(folder => {
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

      if (storeManager === 'zustand') {
        const storeFile = this.generateZustandStore(moduleName, modulePath)
        createdFiles.push(storeFile)
      } else if (storeManager === 'redux') {
        const storeFile = this.generateReduxStore(moduleName, modulePath)
        createdFiles.push(storeFile)
      }

      const indexFile = this.generateIndexFile(moduleName, modulePath, storeManager)
      createdFiles.push(indexFile)

      const relativeFiles = createdFiles.map(file =>
        path.relative(this.projectPath, file)
      )

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
    const pascalName = toPascalCase(moduleName)
    const containerFileName = `${moduleName}-container.tsx`
    const containerPath = path.join(modulePath, 'containers', containerFileName)

    const containerContent = `'use client'

import React from 'react'

interface ${pascalName}ContainerProps {}

export const ${pascalName}Container: React.FC<${pascalName}ContainerProps> = (props) => {
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

  generateService(moduleName, modulePath) {
    const pascalName = toPascalCase(moduleName)
    const camelName = toCamelCase(moduleName)
    const serviceFileName = `${moduleName}.service.ts`
    const servicePath = path.join(modulePath, 'services', serviceFileName)

    const serviceContent = `export class ${pascalName}Service {
  private static instance: ${pascalName}Service

  private constructor() {
    this.initialize()
  }

  public static getInstance(): ${pascalName}Service {
    if (!${pascalName}Service.instance) {
      ${pascalName}Service.instance = new ${pascalName}Service()
    }
    return ${pascalName}Service.instance
  }

  private initialize(): void {}

  public async fetchData(): Promise<any> {
    try {
      return { message: '${pascalName} data' }
    } catch (error) {
      console.error('Error fetching ${moduleName} data:', error)
      throw error
    }
  }

  public processData(data: any): any {
    return data
  }
}

export const ${camelName}Service = ${pascalName}Service.getInstance()
`

    fs.writeFileSync(servicePath, serviceContent)
    return servicePath
  }

  generateTypes(moduleName, modulePath) {
    const pascalName = toPascalCase(moduleName)
    const typesFileName = `${moduleName}.types.ts`
    const typesPath = path.join(modulePath, 'types', typesFileName)

    const typesContent = `export interface ${pascalName}Data {
  id: string
}

export interface ${pascalName}State {
  isLoading: boolean
  error: string | null
  data: ${pascalName}Data | null
}

export interface ${pascalName}Actions {
  fetch: () => Promise<void>
  reset: () => void
}

export type ${pascalName}Status = 'idle' | 'loading' | 'success' | 'error'
`

    fs.writeFileSync(typesPath, typesContent)
    return typesPath
  }

  generateZustandStore(moduleName, modulePath) {
    const pascalName = toPascalCase(moduleName)
    const storeFileName = `${moduleName}.store.ts`
    const storePath = path.join(modulePath, 'store', storeFileName)

    const storeContent = `import { create } from 'zustand'
import type { ${pascalName}Data, ${pascalName}State } from '../types/${moduleName}.types'

interface ${pascalName}Store extends ${pascalName}State {
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
    const pascalName = toPascalCase(moduleName)
    const camelName = toCamelCase(moduleName)
    const storeFileName = `${moduleName}.slice.ts`
    const storePath = path.join(modulePath, 'store', storeFileName)

    const storeContent = `import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ${pascalName}Data, ${pascalName}State } from '../types/${moduleName}.types'

const initialState: ${pascalName}State = {
  isLoading: false,
  error: null,
  data: null,
}

const ${camelName}Slice = createSlice({
  name: '${camelName}',
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

export const select${pascalName}Data = <T extends { ${camelName}: ${pascalName}State }>(state: T) => state.${camelName}.data
export const select${pascalName}Loading = <T extends { ${camelName}: ${pascalName}State }>(state: T) => state.${camelName}.isLoading
export const select${pascalName}Error = <T extends { ${camelName}: ${pascalName}State }>(state: T) => state.${camelName}.error
`

    fs.writeFileSync(storePath, storeContent)
    return storePath
  }

  generateIndexFile(moduleName, modulePath, storeManager = 'none') {
    const pascalName = toPascalCase(moduleName)
    const camelName = toCamelCase(moduleName)
    const indexPath = path.join(modulePath, 'index.ts')

    let indexContent = `export { ${pascalName}Container } from './containers/${moduleName}-container'
export { ${pascalName}Service, ${camelName}Service } from './services/${moduleName}.service'
export type {
  ${pascalName}Data,
  ${pascalName}State,
  ${pascalName}Actions,
  ${pascalName}Status
} from './types/${moduleName}.types'
`

    if (storeManager === 'zustand') {
      indexContent += `export { use${pascalName}Store } from './store/${moduleName}.store'
`
    } else if (storeManager === 'redux') {
      indexContent += `export { ${camelName}Actions, ${camelName}Reducer } from './store/${moduleName}.slice'
export { select${pascalName}Data, select${pascalName}Loading, select${pascalName}Error } from './store/${moduleName}.slice'
`
    }

    fs.writeFileSync(indexPath, indexContent)
    return indexPath
  }
}
