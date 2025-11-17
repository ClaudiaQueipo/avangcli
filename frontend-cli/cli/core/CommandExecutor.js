import { spawn } from "child_process"

export class CommandExecutor {
  async execute(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: "inherit",
        shell: true,
        ...options
      })

      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Command failed with exit code ${code}`))
          return
        }
        resolve()
      })

      child.on("error", (error) => {
        reject(error)
      })
    })
  }

  async executeWithOutput(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const stdout = ""
      const stderr = ""

      const child = spawn(command, args, {
        stdio: "inherit",
        shell: true,
        ...options
      })

      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Command failed with exit code ${code}`))
          return
        }
        resolve({ stdout, stderr })
      })

      child.on("error", (error) => {
        reject(error)
      })
    })
  }
}
