# Command: init

## Description

The `init` command creates and initializes a new Next.js project with custom configurations and pre-configured development tools.

## Syntax

```bash
avangcli init [project-name] [options]
```

## Interactive Mode

If you run the command without arguments, AvangCLI will guide you through an interactive wizard:

```bash
avangcli init
```

The CLI will ask you:

1. Project name
2. Package manager (npm, yarn, pnpm, bun)
3. Use Tailwind CSS?
4. Linter/formatter configuration
5. Docker configuration
6. UI library
7. Git setup (hooks, commitlint, etc.)

## Options

### `[project-name]`

- **Type:** Positional
- **Description:** Name of the project to create
- **Example:** `avangcli init my-awesome-app`

### `--package-manager, --pm`

- **Type:** String
- **Options:** `npm`, `yarn`, `pnpm`, `bun`
- **Description:** Package manager to use
- **Example:** `--pm bun`

### `--tailwind, -t`

- **Type:** Boolean
- **Description:** Include Tailwind CSS in the project
- **Example:** `--tailwind` or `-t`

### `--linter-formatter, --lf`

- **Type:** String
- **Options:** `eslint-prettier`, `biome`, `none`
- **Description:** Linter and formatter configuration
- **Example:** `--lf eslint-prettier`

### `--docker, -d`

- **Type:** String
- **Options:** `dev`, `prod`, `both`, `none`
- **Description:** Docker configuration
- **Example:** `--docker both`

### `--ui-library, --ui`

- **Type:** String
- **Options:** `mui`, `shadcn`, `heroui`, `none`
- **Description:** UI components library
- **Example:** `--ui shadcn`

### `--git-setup, --git`

- **Type:** Boolean
- **Description:** Configure Git with Commitizen, Commitlint, Husky, and Lint-staged
- **Example:** `--git-setup`

## Usage Examples

### Example 1: Interactive Mode

```bash
avangcli init
```

The CLI will guide you step by step.

### Example 2: Basic Project with Tailwind

```bash
avangcli init my-app --pm bun --tailwind
```

Creates a project with Bun and Tailwind CSS.

### Example 3: Full Project with All Tools

```bash
avangcli init my-app --pm bun --tailwind --lf eslint-prettier --docker both --ui shadcn --git-setup
```

Configures:

- Bun as package manager
- Tailwind CSS
- ESLint + Prettier
- Docker for dev and production
- shadcn/ui
- Git hooks and commit conventions

### Example 4: Enterprise Project with Material UI

```bash
avangcli init company-dashboard --pm pnpm --lf biome --docker prod --ui mui --git-setup
```

### Example 5: Minimalist Project

```bash
avangcli init simple-app --pm npm --lf none --docker none --ui none
```

## What Does the Command Do?

### 1. Creates the Base Next.js Project

```bash
# Internally executes
create-next-app project-name --typescript --app --no-src-dir
```

**Note:** Projects are created **without** the `src/` directory by default to maintain a cleaner root structure.

### 2. Configures Linter/Formatter

#### ESLint + Prettier

- Installs dependencies
- Creates `.eslintrc.json`
- Creates `.prettierrc`
- Creates `.prettierignore`
- Configures scripts in `package.json`

#### Biome

- Installs @biomejs/biome
- Creates `biome.json`
- Configures format and lint

### 3. Configures Docker (if requested)

#### Dev

- Creates `docker-compose.dev.yml`
- Optimized Dockerfile for development
- Hot reload enabled

#### Prod

- Creates `docker-compose.prod.yml`
- Multi-stage Dockerfile for production
- Optimized for size and performance

#### Both

- Both configurations included

### 4. Installs UI Library (if requested)

#### Material UI

```bash
# Installs
@mui/material @emotion/react @emotion/styled
```

#### shadcn/ui

```bash
# Requires Tailwind CSS
# Configures components.json
# Ready for: npx shadcn@latest add button
```

#### HeroUI

```bash
# Requires Tailwind CSS
# Configures heroui
# Installs @heroui/react
```

### 5. Configures Git Setup (if requested)

- Initializes Git repository
- Installs Husky
- Configures pre-commit hooks
- Configures Commitizen
- Configures Commitlint
- Configures Lint-staged

## Generated Project Structure

### Basic Project

```
my-app/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

### Project with All Configurations

```
my-app/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .husky/              ← Git hooks
├── components/
│   └── ui/              ← shadcn components
├── lib/
│   └── utils.ts         ← shadcn utils
├── .eslintrc.json       ← ESLint config
├── .prettierrc          ← Prettier config
├── biome.json           ← Biome config (if used)
├── components.json      ← shadcn config
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Dockerfile
├── .gitignore
├── commitlint.config.js ← Commitlint
├── next.config.js
├── package.json
├── postcss.config.js    ← PostCSS (Tailwind)
├── tailwind.config.ts   ← Tailwind
└── tsconfig.json
```

## Next Steps After Init

Once initialization is complete:

```bash
# Navigate to project
cd my-app

# Start development server
bun dev          # if using bun
npm run dev      # if using npm
yarn dev         # if using yarn
pnpm dev         # if using pnpm

# (Optional) Start with Docker
docker-compose -f docker-compose.dev.yml up
```

## Generate Modules

```bash
# Create your first module
avangcli module authentication --store zustand
```

## CI/CD Configuration

The `init` command with `--git-setup` configures everything needed for:

```bash
# Commits with standard format
npx cz

# Pre-commit hooks automatically run:
# - Linting
# - Formatting
# - Type checking
```

## Tips and Notes

### Note about Tailwind CSS

The `shadcn` and `heroui` libraries **require Tailwind CSS**. If you didn't include it at the start, the CLI will install it automatically.

```bash
# shadcn without Tailwind
avangcli init my-app --ui shadcn
# ⚠️ CLI will install Tailwind automatically
```

### Recommendations by Project Type

#### Startup / MVP

```bash
avangcli init startup-app --pm bun --tailwind --lf biome --docker dev --ui shadcn --git-setup
```

#### Enterprise Application

```bash
avangcli init enterprise-app --pm pnpm --tailwind --lf eslint-prettier --docker both --ui mui --git-setup
```

#### Personal Project

```bash
avangcli init personal-app --pm bun --tailwind --lf biome --ui shadcn
```

## Troubleshooting

### Error: "create-next-app failed"

**Cause:** Network issues or Node.js version

**Solution:**

```bash
# Check Node.js version
node --version  # Must be >= 20

# Clear cache
npm cache clean --force

# Try again
avangcli init my-app
```

### Error: "Permission denied"

**Solution:**

```bash
# Linux/Mac
sudo chown -R $USER:$USER my-app

# Or run without sudo
avangcli init my-app
```

### Project Created But No Dependencies

**Solution:**

```bash
cd my-app
bun install  # or npm install
```

## Related Resources

- [Module command](./module.md)
- [UI-library command](./ui-library.md)
- [Configuration](../02-getting-started/configuration.md)
- [Complete project](../08-guides/complete-project-walkthrough.md)
