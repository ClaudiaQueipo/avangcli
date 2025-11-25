# Troubleshooting

## Introduction

This guide will help you resolve the most common issues you may encounter when using AvangCLI. If you don't find your problem here, please [report an issue](https://github.com/avangenio/avangcli/issues).

## Installation Issues

### Error: "command not found: avangcli"

**Symptom:** The `avangcli` command is not recognized after installation.

**Solution:**

```bash
# Check if it's globally installed
npm list -g avangcli

# If not installed, install globally
npm install -g avangcli

# Or with Bun
bun install -g avangcli

# Check PATH variable
echo $PATH

# If using bun, make sure bin path is in PATH
export PATH="$HOME/.bun/bin:$PATH"

# If using npm
export PATH="$HOME/.npm-global/bin:$PATH"
```

### Permission Errors on Linux/Mac

**Symptom:** `EACCES` or `permission denied` during installation.

**Solution:**

```bash
# Option 1: Use a local prefix for npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
source ~/.profile

# Option 2: Change npm directory permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Option 3: Use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
npm install -g avangcli
```

### Incompatible Node Version

**Symptom:** Error about incompatible Node.js version.

**Solution:**

```bash
# Check current version
node --version

# Install compatible version (>=18.0.0)
nvm install 18
nvm use 18

# Or use Bun (recommended)
curl -fsSL https://bun.sh/install | bash
```

## Command Issues

### `avangcli init` Fails

#### Error: "Directory already exists"

**Symptom:** Cannot create project because directory already exists.

**Solution:**

```bash
# Option 1: Use a different name
avangcli init my-app-v2

# Option 2: Remove existing directory
rm -rf my-app
avangcli init my-app

# Option 3: Rename existing directory
mv my-app my-app-old
avangcli init my-app
```

#### Error: "Failed to install dependencies"

**Symptom:** Dependency installation fails during `avangcli init`.

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Try with another package manager
avangcli init my-app --pm bun

# If it persists, install manually
avangcli init my-app --skip-install
cd my-app
npm install
```

### `avangcli module` Fails

#### Error: "Not in a valid project"

**Symptom:** The module command doesn't work.

**Solution:**

```bash
# Make sure you're in the project root
cd /path/to/your/project

# Verify package.json exists
ls -la package.json

# Verify it's a Next.js project
cat package.json | grep "next"
```

#### Error: "Module already exists"

**Symptom:** The module you're trying to create already exists.

**Solution:**

```bash
# Check existing modules
ls -la modules/

# Use a different name
avangcli module user-management

# Or remove the existing module
rm -rf modules/user
avangcli module user
```

### `avangcli ui-library` Fails

#### Error: "UI library already configured"

**Symptom:** A UI library is already configured.

**Solution:**

```bash
# See which one is configured
cat package.json | grep -E "(mui|shadcn|heroui)"

# If you want to change, manually remove the previous one
npm uninstall @mui/material @emotion/react @emotion/styled

# Then install the new one
avangcli ui-library --ui shadcn
```

## Development Issues

### TypeScript Errors

#### Error: "Cannot find module '@/modules/...'"

**Symptom:** TypeScript can't find module imports.

**Solution:**

```bash
# Check tsconfig.json
cat tsconfig.json

# Make sure paths are configured
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/modules/*": ["./modules/*"]
    }
  }
}

# Restart development server
npm run dev
```

#### Error: "Type 'X' is not assignable to type 'Y'"

**Symptom:** Type errors in generated code.

**Solution:**

```typescript
// Verify types are correctly imported
import type { UserProfile } from "../types/user-profile.types"

// Use type assertions if necessary
const profile = data as UserProfile

// Or type guards
function isUserProfile(data: any): data is UserProfile {
  return "id" in data && "name" in data
}
```

### Build Errors

#### Error: "Module not found" during build

**Symptom:** Build fails with module not found errors.

**Solution:**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### Error: "Out of memory"

**Symptom:** Build runs out of memory.

**Solution:**

```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"

# Or in package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

### Runtime Errors

#### Error: "Hydration failed"

**Symptom:** Hydration error in Next.js.

**Solution:**

```typescript
// Make sure server/client HTML matches
// Avoid:
<div>
  {typeof window !== 'undefined' && <ClientComponent />}
</div>

// Use:
'use client'

import { useEffect, useState } from 'react'

export function Component() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <ClientComponent />
}
```

#### Error: "useStore is not a function"

**Symptom:** Error when using Zustand store.

**Solution:**

```typescript
// Verify store is correctly exported
// store/user.store.ts
export const useUserStore = create<UserStore>((set) => ({
  // ...
}))

// In component
;("use client") // Make sure it's a client component

import { useUserStore } from "../store/user.store"

export const Component = () => {
  const { data } = useUserStore() // ✅
  // const data = useUserStore((state) => state.data) // ✅ Also valid
}
```

## Configuration Issues

### ESLint Errors

#### Error: "Parsing error: Cannot find module 'next/babel'"

**Symptom:** ESLint can't parse files.

**Solution:**

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"],
  "parserOptions": {
    "babelOptions": {
      "presets": [require.resolve("next/babel")]
    }
  }
}
```

### Prettier Conflicts

#### Error: Prettier and ESLint are conflicting

**Symptom:** Contradictory formatting rules.

**Solution:**

```bash
# Install eslint-config-prettier
npm install --save-dev eslint-config-prettier

# Update .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "prettier" // Must be last
  ]
}
```

### Tailwind CSS Not Working

#### Error: Tailwind classes not applying

**Symptom:** Tailwind classes have no effect.

**Solution:**

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}', // ← Important
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ...
}

export default config
```

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Package Manager Issues

### npm vs Bun vs pnpm Conflicts

**Symptom:** Errors when mixing package managers.

**Solution:**

```bash
# Clear all lock files
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml bun.lockb

# Reinstall with a single package manager
npm install
# Or
bun install
# Or
pnpm install

# Configure project to use a specific one
echo "package-manager=bun" > .npmrc
```

## Store Manager Issues

### Zustand State Not Updating

**Symptom:** Zustand state doesn't reflect in components.

**Solution:**

```typescript
// ❌ Bad: Mutating state directly
set({ data: state.data.push(item) })

// ✅ Good: Create new object
set({ data: [...state.data, item] })

// ✅ Good: Use Immer
import { immer } from "zustand/middleware/immer"

export const useStore = create<Store>()(
  immer((set) => ({
    data: [],
    addItem: (item) =>
      set((state) => {
        state.data.push(item) // Now it works
      })
  }))
)
```

### Redux DevTools Not Showing

**Symptom:** Redux DevTools doesn't show state.

**Solution:**

```typescript
// For Zustand
import { devtools } from "zustand/middleware"

export const useStore = create<Store>()(
  devtools(
    (set) => ({
      // ...
    }),
    { name: "MyStore" } // ← Important to give name
  )
)

// Verify extension is installed
// Chrome/Edge: Redux DevTools Extension
```

## UI Library Issues

### shadcn/ui Components Not Found

**Symptom:** shadcn/ui components are not available.

**Solution:**

```bash
# Verify shadcn is initialized
ls -la components/ui

# If it doesn't exist, initialize
npx shadcn-ui@latest init

# Add needed components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

### MUI Styles Not Applying

**Symptom:** Material-UI styles don't work.

**Solution:**

```typescript
// app/layout.tsx
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/config/theme'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
```

## Performance Issues

### Slow Application in Development

**Symptom:** Development server is very slow.

**Solution:**

```bash
# Use Turbopack (Next.js 13+)
npm run dev --turbo

# Or update package.json
{
  "scripts": {
    "dev": "next dev --turbo"
  }
}

# Verify there are no circular imports
# Use tools like madge
npm install -g madge
madge --circular --extensions ts,tsx .
```

### Very Slow Build

**Symptom:** Build takes a very long time.

**Solution:**

```javascript
// next.config.js
module.exports = {
  // Disable bundle analysis in development
  productionBrowserSourceMaps: false,

  // Optimize compilation
  swcMinify: true,

  // Reduce type checking during build
  typescript: {
    ignoreBuildErrors: false // Only in emergencies
  },

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"]
  }
}
```

## Git/Husky Issues

### Pre-commit Hook Fails

**Symptom:** Commit fails on pre-commit hook.

**Solution:**

```bash
# Verify husky is installed
ls -la .husky/pre-commit

# Reinstall husky
npm install --save-dev husky
npx husky install

# Give execution permissions
chmod +x .husky/pre-commit

# If you need to skip the hook (not recommended)
git commit --no-verify -m "message"
```

### Commitlint Rejects Commits

**Symptom:** Commit messages are rejected.

**Solution:**

```bash
# Use conventional format
# Type: feat, fix, docs, style, refactor, test, chore

# ✅ Good
git commit -m "feat: add user profile module"
git commit -m "fix: resolve hydration error"
git commit -m "docs: update README"

# ❌ Bad
git commit -m "added stuff"
git commit -m "WIP"

# View configuration
cat commitlint.config.js
```

## Environment Variable Issues

### Environment Variables Not Available

**Symptom:** `process.env.NEXT_PUBLIC_*` is undefined.

**Solution:**

```bash
# Verify .env.local file exists
ls -la .env.local

# Public variables must have the prefix
# ✅ Good
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=MyApp

# ❌ Bad (won't be available on client)
API_URL=http://localhost:3001

# Restart server after changes
# Variables are loaded on startup
npm run dev
```

## How to Report a Bug

If your problem isn't here, please report an issue with:

1. **Clear problem description**
2. **Steps to reproduce**
3. **Expected vs actual behavior**
4. **Versions:**
   ```bash
   avangcli --version
   node --version
   npm --version
   ```
5. **Complete error logs**
6. **Relevant configuration** (package.json, next.config.js, etc.)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [GitHub Issues](https://github.com/avangenio/avangcli/issues)

## Useful Debugging Commands

```bash
# Check versions
avangcli --version
node --version
npm --version

# Clear cache
npm cache clean --force
rm -rf .next node_modules package-lock.json
npm install

# View project structure
tree -L 2 -I node_modules

# Check dependencies
npm list --depth=0

# View available scripts
npm run

# Verify TypeScript configuration
npx tsc --noEmit

# Verify ESLint configuration
npx eslint --print-config .

# Analyze bundle
npm run build
npx @next/bundle-analyzer
```
