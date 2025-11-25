# Command: config

## Description

The `config` command regenerates the `avangclirc.json` file in the current project directory, automatically detecting the existing Next.js project configuration. This is useful if the configuration file has been deleted or if you want to update it after manual changes.

## Syntax

```bash
avangcli config
```

## What Does the Command Do?

The command analyzes the current project and detects:

### 1. Package Manager

- Checks for lock files:
  - `yarn.lock` → `yarn`
  - `pnpm-lock.yaml` → `pnpm`
  - `bun.lock` → `bun`
  - Otherwise → `npm`

### 2. Tailwind CSS

- Searches for `tailwindcss` in `dependencies` or `devDependencies`
- Checks for existence of `tailwind.config.js` or `tailwind.config.ts`

### 3. Linter/Formatter

- `biome.json` present → `biome`
- ESLint files present (`.eslintrc.js`, `eslint.config.js`, etc.) → `eslint-prettier`
- Otherwise → `none`

### 4. Docker

- `docker-compose.dev.yml` and `docker-compose.prod.yml` → `both`
- Only `docker-compose.dev.yml` → `dev`
- Only `docker-compose.prod.yml` → `prod`
- None → `none`

### 5. UI Library

- `@mui/material` present → `mui`
- `components.json` present → `shadcn`
- `@heroui/react` present → `heroui`
- None → `none`

### 6. Git Setup

- `husky` in `devDependencies` or `.husky` directory present
- `commitlint.config.js` present → `true`
- Otherwise → `false`

### 7. Project Validation

- Verifies that `package.json` exists
- Confirms that `next` is in `dependencies` or `devDependencies`

## Usage Examples

### Example 1: Regenerate Configuration

```bash
cd my-nextjs-project
avangcli config
```

### Example 2: After Manual Changes

```bash
# You manually added Docker
echo "I added docker-compose.yml"
avangcli config  # Updates avangclirc.json
```

## Generated File

Creates `avangclirc.json` in the project root:

```json
{
  "packageManager": "bun",
  "tailwind": true,
  "linterFormatter": "eslint-prettier",
  "docker": "both",
  "uiLibrary": "heroui",
  "gitSetup": true
}
```

## Requirements

- You must run the command within a valid Next.js project directory
- The project must have `package.json` with Next.js installed
- The `avangclirc.json` file will be overwritten if it exists

## Next Steps After Config

Once the file is regenerated:

```bash
# Verify configuration
cat avangclirc.json

# Use other commands that depend on config
avangcli module my-module
```

## Tips and Notes

### Note on Automatic Detection

Detection is based on present files and dependencies. If you installed something manually but it doesn't appear in `package.json`, it might not be detected.

### Custom Configuration

If you need a specific configuration that isn't automatically detected, edit `avangclirc.json` manually after regenerating it.

### Invalid Project

If you run `config` outside a Next.js project, you will receive an error.

## Troubleshooting

### Error: "No package.json found"

**Cause:** You're not in a project directory

**Solution:**

```bash
cd my-nextjs-project
avangcli config
```

### Error: "This doesn't appear to be a Next.js project"

**Cause:** The project doesn't have Next.js installed

**Solution:**

```bash
# Check installation
cat package.json | grep next

# Install if missing
npm install next
avangcli config
```

### Error: "Failed to write project config"

**Cause:** Permission issues

**Solution:**

```bash
# Linux/Mac
chmod 755 .
avangcli config
```

### Configuration Not Detected Correctly

**Cause:** Manual changes not reflected in standard files

**Solution:**

```bash
# Check dependencies
npm list tailwindcss  # For Tailwind
npm list @heroui/react  # For HeroUI

# Regenerate
avangcli config
```

## Related Resources

- [Init command](./init.md)
- [Module command](./module.md)
- [Configuration](../02-getting-started/configuration.md)
- [Project Structure](../02-getting-started/project-structure.md)
