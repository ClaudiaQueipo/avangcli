import fs from "fs"
import os from "os"
import path from "path"

export class ConfigManager {
  constructor() {
    this.globalConfigDir = path.join(os.homedir(), ".avangcli")
    this.globalConfigFile = path.join(this.globalConfigDir, "config.json")
    this.projectConfigFile = path.join(process.cwd(), ".avangclirc.json")
  }

  ensureGlobalConfigDir() {
    if (!fs.existsSync(this.globalConfigDir)) {
      fs.mkdirSync(this.globalConfigDir, { recursive: true })
    }
  }

  readGlobalConfig() {
    try {
      if (fs.existsSync(this.globalConfigFile)) {
        const content = fs.readFileSync(this.globalConfigFile, "utf8")
        return JSON.parse(content)
      }
    } catch (error) {
      console.warn("Failed to read global config:", error.message)
    }
    return {}
  }

  writeGlobalConfig(config) {
    try {
      this.ensureGlobalConfigDir()
      fs.writeFileSync(this.globalConfigFile, JSON.stringify(config, null, 2), "utf8")
    } catch (error) {
      console.warn("Failed to write global config:", error.message)
    }
  }

  readProjectConfig() {
    try {
      if (fs.existsSync(this.projectConfigFile)) {
        const content = fs.readFileSync(this.projectConfigFile, "utf8")
        return JSON.parse(content)
      }
    } catch (error) {
      console.warn("Failed to read project config:", error.message)
    }
    return {}
  }

  writeProjectConfig(config) {
    try {
      fs.writeFileSync(this.projectConfigFile, JSON.stringify(config, null, 2), "utf8")
    } catch (error) {
      console.warn("Failed to write project config:", error.message)
    }
  }

  get(key, defaultValue = null) {
    const projectConfig = this.readProjectConfig()
    if (projectConfig[key] !== undefined) {
      return projectConfig[key]
    }

    const globalConfig = this.readGlobalConfig()
    if (globalConfig[key] !== undefined) {
      return globalConfig[key]
    }

    return defaultValue
  }

  setGlobal(key, value) {
    const config = this.readGlobalConfig()
    config[key] = value
    this.writeGlobalConfig(config)
  }

  setProject(key, value) {
    const config = this.readProjectConfig()
    config[key] = value
    this.writeProjectConfig(config)
  }

  getDefaultStoreManager() {
    return this.get("defaultStoreManager", null)
  }

  setDefaultStoreManagerGlobal(storeManager) {
    this.setGlobal("defaultStoreManager", storeManager)
  }

  setDefaultStoreManagerProject(storeManager) {
    this.setProject("defaultStoreManager", storeManager)
  }

  hasProjectConfig() {
    return fs.existsSync(this.projectConfigFile)
  }

  getPackageManager() {
    return this.get("packageManager", null)
  }

  setPackageManagerGlobal(packageManager) {
    this.setGlobal("packageManager", packageManager)
  }

  setPackageManagerProject(packageManager) {
    this.setProject("packageManager", packageManager)
  }
}
