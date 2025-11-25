# Why Use AvangCLI Frontend?

## Key Advantages

### ⚡ Development Speed

**Significant time savings:**

- Set up a complete Next.js project in minutes instead of hours
- Preconfigured project with git hooks, linter, formatter, docker configuration, component library, tailwind.
- Generate entire modules with complete structure in seconds (based on screaming architecture)
- Eliminates the need to copy and paste boilerplate code

**Example:** A project that normally would take 2-3 hours to configure (Next.js + ESLint + Prettier + Docker + Git hooks + UI library) is reduced to 2-5 minutes with AvangCLI.

### 🎯 Consistency and Standardization

**Homogeneous code throughout the project:**

- All modules follow the same architectural structure
- Consistent naming conventions (kebab-case, PascalCase, camelCase)

**Benefit:** A new developer can quickly understand any module in the project because they all follow the same structure.

### 🏗️ Proven Architecture

**Screaming Architecture implemented:**

- Structure that visually communicates the code's purpose
- Clear separation of responsibilities
- Scalability built-in from the start

**Advantage:** Your project grows in an organized way without needing to refactor the structure.

### 🛡️ Fewer Errors

**Integrated validations:**

- Verification of Next.js projects before generating modules
- Automatic detection of missing dependencies
- Prevention of naming conflicts

**Result:** Less time debugging configuration issues.

### 🔧 Intelligent Configuration

**Automatic detection:**

- Identifies the package manager used (npm, yarn, pnpm, bun)
- Detects if Tailwind CSS configuration exists

**Benefit:** The CLI adapts to your existing project instead of forcing you into a specific structure.

### 📚 Included Best Practices

**Modern design patterns:**

- Singleton pattern in services
- Barrel exports for clean imports
- Container / Presentational pattern
- Functional components with React hooks

**Inline documentation:**

- Clear explanations of each file's purpose
- Included usage examples

## Comparison with Other Tools

### vs. create-next-app

**create-next-app** is excellent for starting a basic project, but AvangCLI goes further:

- ✅ **create-next-app**: Creates the initial project
- ✅ **AvangCLI**: Creates the project + configures all tools + generates scalable modules

**Example:**

```bash
# create-next-app
npx create-next-app my-app
# Then you need to manually configure: Docker, Git hooks, etc.

# AvangCLI
avangcli init my-app --pm bun --lf eslint-prettier --docker both --git-setup --ui shadcn
# Everything configured in one command
```

### vs. Other Scaffolding Tools

**Distinctive features of AvangCLI:**

1. **Opinionated but flexible architecture**: Implements Screaming Architecture but allows customization
2. **Support for multiple state managers**: Zustand and Redux with predefined configuration
3. **Next.js project validation**: Verifies you're in a valid project before generating code
4. **Code quality configuration**: Git hooks, commitlint, lint-staged all integrated

## What Makes AvangCLI Distinctive?

### 1. Focus on Next.js

Specifically designed for Next.js with deep knowledge of:

- App Router (Next.js 14+)
- Server Components and Client Components
- Modern directory structure
- Next.js best practices

### 2. Complete Module Generation

Doesn't just generate individual components, but **complete modules** with:

- Components
- Containers
- Services with Singleton pattern
- TypeScript types and interfaces
- Custom hooks
- Store (Zustand/Redux)
- Adapters
- Helpers and utilities
- Organized barrel exports

### 3. Comprehensive Tool Configuration

**One command to configure:**

- Linters (ESLint, Biome)
- Formatters (Prettier)
- Git hooks (Husky)
- Commit conventions (Commitizen, Commitlint)
- Pre-commit checks (Lint-staged)
- Containerization (Docker)
- UI Libraries (MUI, shadcn, HeroUI)

### 4. Superior Developer Experience

**Interactive interface with @clack/prompts:**

- Clear and visual prompts
- Real-time feedback
- Elegant error handling
- Informative progress messages

### 5. Flexibility and Control

**Interactive mode or with arguments:**

```bash
# Interactive mode
avangcli init

# Arguments mode (CI/CD friendly)
avangcli init my-app --pm bun --tailwind --lf biome --docker prod
```

## Next Steps

- [When to use this tool](./when-to-use.md)
- [Installation guide](../02-getting-started/installation.md)
- [Tutorial: Complete project](../08-guides/complete-project-walkthrough.md)
