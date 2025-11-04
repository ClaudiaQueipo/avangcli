# try-catch-cli

A powerful CLI tool for scaffolding fullstack projects with Next.js (frontend) and FastAPI (backend).

## Features

- Interactive CLI with beautiful prompts
- Frontend: Next.js project setup with customizable configurations
- **Module scaffolding**: Automatic module generation for Next.js applications with complete folder structure and boilerplate code
- Backend: FastAPI project generation (coming soon)
- Package manager support: npm, yarn, pnpm, bun
- Linter/Formatter options: ESLint + Prettier, Biome
- Docker configuration: dev, prod, or both environments
- Command-line arguments support with yargs

## Installation

### From source (development)

```bash
git clone <repository-url>
cd try-catch-cli

# Install master CLI dependencies
bun install

# Install frontend CLI dependencies
cd frontend-cli && bun install && cd ..

# Or install all dependencies at once
bun run install:all
```

### Global installation (coming soon)

```bash
npm install -g try-catch-cli
```

## Usage

### Master CLI

The master CLI coordinates between frontend and backend CLIs:

```bash
try-catch frontend    # Launch frontend CLI
try-catch backend     # Launch backend CLI
```

### Frontend CLI

#### Initialize a new Next.js project

```bash
# Interactive mode
try-catch init

# With arguments
try-catch init my-app --pm bun --tailwind --lf biome --docker dev

# Options:
#   --package-manager, --pm   Package manager (npm, yarn, pnpm, bun)
#   --tailwind, -t            Use Tailwind CSS (boolean)
#   --linter-formatter, --lf  Linter setup (eslint-prettier, biome, none)
#   --docker, -d              Docker config (dev, prod, both, none)
```

**Note:** Projects are created **without** the `src/` directory by default to maintain a cleaner root structure.

#### Generate modules in existing Next.js projects

```bash
# Create a module with complete folder structure and boilerplate
try-catch module <module-name>

# Examples:
try-catch module user-profile
try-catch module shopping-cart
try-catch module authentication

# Skip Next.js validation (use with caution)
try-catch module my-module --skip-validation
```

**Module features:**
- Validates Next.js project structure
- Creates consistent folder structure (components, containers, services, hooks, etc.)
- Generates TypeScript boilerplate with best practices
- Container component with React functional component
- Service class with singleton pattern
- Type definitions
- Barrel exports for clean imports
- Automatic detection of src/ directory

See [Module Command Documentation](docs/module-command.md) for detailed usage.

### Backend CLI (coming soon)

```bash
try-catch backend init
```

## Development

```bash
# Run master CLI in dev mode
bun run dev

# Run frontend CLI directly
bun run dev:frontend

# Run backend CLI directly
bun run dev:backend
```

## Project Structure

```
try-catch-cli/
├── bin/              # Executables
├── src/              # Master CLI logic
├── frontend-cli/     # Frontend CLI (independent)
├── backend-cli/      # Backend CLI (independent)
└── docs/             # Documentation
```

For detailed structure information, see [project-structure.md](project-structure.md).

## Requirements

- Node.js 20+ (for frontend CLI and master CLI)
- Python 3.8+ (for backend CLI)
- Bun (recommended) or npm/yarn/pnpm

## Documentation

- [CLI Usage Guide](docs/cli-usage.md)
- [Module Command](docs/module-command.md) - **Detailed guide for module scaffolding**
- [Project Templates](docs/project-templates.md)
- [Architecture](docs/architecture.md)
- [API Reference](docs/api-reference.md)

## License

ISC
