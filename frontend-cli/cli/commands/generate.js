import fs from "node:fs"
import path from "node:path"

import { log, outro, spinner } from "@clack/prompts"

import { ConfigManager } from "../core/ConfigManager.js"
import { processOpenAPIFile } from "../core/OpenAPIGenerator.js"

export const command = "generate"
export const desc = "Generate TypeScript clients from OpenAPI specifications"

export const builder = (yargs) => {
  return yargs
    .option("docs-dir", {
      alias: "d",
      describe: "Directory containing OpenAPI JSON files",
      type: "string"
    })
    .option("output-dir", {
      alias: "o",
      describe: "Output directory for generated clients",
      type: "string"
    })
    .example("$0 generate", "Generate clients using project configuration")
    .example("$0 generate --docs-dir ./api-docs --output-dir ./src/generated", "Generate with custom paths")
}

export const handler = async (argv) => {
  const configManager = new ConfigManager()

  try {
    if (!configManager.hasProjectConfig()) {
      log.warning("⚠️  No project configuration found. Running config command first...")
      const configCommand = await import("./config.js")
      await configCommand.handler({})
    }

    const projectConfig = configManager.readProjectConfig()
    const docsDir = argv["docs-dir"] || argv.d || projectConfig.openapiDocsDir || "./docs"
    const outputDir = argv["output-dir"] || argv.o || projectConfig.openapiOutputDir || "./generated"

    await generateClient(docsDir, outputDir)
  } catch (error) {
    outro("❌ Failed to generate clients")
    log.error(error.message)
    process.exit(1)
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Main function - Generate clients from OpenAPI files in docs/
 */
async function generateClient(docsDir = "./docs", outputDir = "./generated") {
  const absoluteDocsDir = path.resolve(docsDir)
  const absoluteOutputDir = path.resolve(outputDir)

  const s = spinner()
  s.start("Starting generation process...")
  await sleep(800)

  if (!fs.existsSync(absoluteDocsDir)) {
    throw new Error(`Docs directory not found: ${absoluteDocsDir}`)
  }

  s.message("Scanning docs folder for OpenAPI files...")
  const openapiFiles = fs
    .readdirSync(absoluteDocsDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.join(absoluteDocsDir, file))

  if (openapiFiles.length === 0) {
    throw new Error("No OpenAPI JSON files found in docs/ directory")
  }

  s.message(`Found ${openapiFiles.length} OpenAPI file(s)! 📋`)
  await sleep(600)

  if (!fs.existsSync(absoluteOutputDir)) {
    fs.mkdirSync(absoluteOutputDir, { recursive: true })
  }

  for (let i = 0; i < openapiFiles.length; i++) {
    const openapiFile = openapiFiles[i]
    const fileName = path.basename(openapiFile)

    s.message(`Processing ${fileName} (${i + 1}/${openapiFiles.length})...`)
    await sleep(400)

    try {
      await processOpenAPIFile(openapiFile, absoluteOutputDir, s)
    } catch (err) {
      log.warning(`Warning: Failed to process ${fileName}: ${err.message}`)
      console.error(err)
    }
  }

  s.stop(`All done! Generated clients for ${openapiFiles.length} API(s)! 🎉`)
  outro("✅ Client generation complete!")
}
