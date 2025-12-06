# Configuration

## Introduction

AvangCLI allows you to configure per-project preferences to automate common decisions and speed up your workflow. This guide explains all available configuration options.

## Configuration Files

### Project: `avangclirc.json`

**Location:** Project root

**Purpose:** Project-specific configuration

**Example:**

```json
{
  "packageManager": "pnpm",
  "tailwind": true,
  "linterFormatter": "eslint-prettier",
  "docker": "dev",
  "uiLibrary": "shadcn",
  "gitSetup": true
}
```

## Configuration Options

### Package Manager

**Option:** `defaultPackageManager`

**Values:** `npm` | `yarn` | `pnpm` | `bun`

**Default:** `npm`

**Set per project:**

```bash
# Edit avangclirc.json in project root
{
  "packageManager": "pnpm"
}
```

**Usage:**

```bash
# Without configuration
avangcli init my-app
# → Asks which package manager to use

# With project configuration
avangcli init my-app
# → Uses configured package manager automatically
```

### Store Manager

**Option:** `defaultStoreManager`

**Values:** `zustand` | `redux` | `none`

**Default:** Asks interactively

**Set per project:**

```bash
# During module creation
avangcli module users --store redux -p

# Or manually in avangclirc.json
{
  "defaultStoreManager": "redux"
}
```

**Usage:**

```bash
# Without configuration
avangcli module products
# → Asks which store manager to use

# With project configuration
avangcli module products
# → Uses configured store manager automatically
```

### Linter/Formatter

**Option:** `defaultLinterFormatter`

**Values:** `eslint-prettier` | `biome` | `none`

**Default:** `eslint-prettier`

**Configuration:**

```json
{
  "defaultLinterFormatter": "biome"
}
```

### UI Library

**Option:** `defaultUiLibrary`

**Values:** `mui` | `shadcn` | `heroui` | `none`

**Default:** `none`

**Configuration:**

```json
{
  "defaultUiLibrary": "shadcn"
}
```

## Configuration Priority

When there are multiple configuration sources, AvangCLI applies them in this order (highest to lowest priority):

1. **CLI Arguments** - `--pm bun`
2. **Project Configuration** - `avangclirc.json`
3. **System Defaults**
4. **Interactive Mode**

### Example

```bash
# project/avangclirc.json
{
  "packageManager": "pnpm",
  "defaultStoreManager": "redux"
}

# Command
avangcli module products --pm bun

# Result:
# - Package manager: bun (CLI argument)
# - Store manager: redux (project config)
```

## Initial Setup

```bash
# 1. Create first project
avangcli init my-app --pm bun --ui shadcn

# 2. Set store manager as project default
cd my-app
avangcli module auth --store zustand -p

# 3. All future modules use zustand
avangcli module products  # → uses zustand
avangcli module cart      # → uses zustand
```

## Configuration Commands

### View Current Configuration

```bash
# View project configuration
cat avangclirc.json
```

### Edit Configuration

```bash
# Project
code avangclirc.json
```

### Reset Configuration

```bash
# Project
rm avangclirc.json
```

### Regenerate Project Configuration

If you need to regenerate the `avangclirc.json` file based on your current project configuration:

```bash
# Automatically detects configuration and regenerates avangclirc.json
avangcli config
```

## Configuration by Project Type

### Startup / MVP

```json
{
  "defaultPackageManager": "bun",
  "defaultStoreManager": "zustand",
  "defaultLinterFormatter": "biome",
  "defaultUiLibrary": "shadcn"
}
```

**Reasons:**

- Bun: Fast for iterative development
- Zustand: Simple and lightweight
- Biome: Fast linting
- shadcn: Modern and customizable UI

### Enterprise Application

```json
{
  "defaultPackageManager": "pnpm",
  "defaultStoreManager": "redux",
  "defaultLinterFormatter": "eslint-prettier",
  "defaultUiLibrary": "mui"
}
```

**Reasons:**

- pnpm: Space savings in monorepos
- Redux: Established patterns, advanced DevTools
- ESLint+Prettier: Industry standard
- MUI: Robust enterprise components

### Personal Project

```json
{
  "defaultPackageManager": "bun",
  "defaultStoreManager": "zustand",
  "defaultLinterFormatter": "biome",
  "defaultUiLibrary": "shadcn"
}
```

## Environment Variables

### `.env.local`

AvangCLI respects Next.js environment variables:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=MyApp
NEXT_PUBLIC_ENV=development

# Private (server only)
DATABASE_URL=postgresql://...
API_SECRET_KEY=...
```

### Usage in Application

```typescript
// modules/products/services/products.service.ts
export class ProductsService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL!

  async fetchProducts() {
    return fetch(`${this.apiUrl}/products`)
  }
}
```

## Tool Configuration

### ESLint

**File:** `.eslintrc.json`

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### Prettier

**File:** `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

### TypeScript

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./*"],
      "@/modules/*": ["./modules/*"],
      "@/shared/*": ["./shared/*"]
    }
  }
}
```

### Tailwind CSS

**File:** `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0070f3",
        secondary: "#7928ca"
      }
    }
  },
  plugins: []
}

export default config
```

## Git Configuration

### Husky Hooks

**Pre-commit:**

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

bun run lint
bun run type-check
```

**Commit-msg:**

```bash
# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

### Commitlint

**File:** `commitlint.config.js`

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "test", "chore", "perf", "ci", "build"]]
  }
}
```

## Docker

### Development

**File:** `docker-compose.dev.yml`

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: bun dev
```

### Production

**File:** `docker-compose.prod.yml`

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    command: bun start
```

## Troubleshooting

### Configuration Not Applied

**Problem:** Configuration changes have no effect

**Solution:**

```bash
# Verify JSON syntax
cat avangclirc.json | jq .

# Check permissions
ls -la avangclirc.json

# Recreate file
rm avangclirc.json
avangcli config
```

### Configuration Conflicts

**Problem:** Unclear which configuration is being used

**Solution:**

```bash
# View precedence:
# 1. CLI args
# 2. avangclirc.json (project)

# Check project configuration
cat avangclirc.json
```

## Additional Resources

- [Installation](./installation.md)
- [init Command](../03-commands/init.md)
- [module Command](../03-commands/module.md)
- [Best Practices](../08-guides/best-practices.md)
