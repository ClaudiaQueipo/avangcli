# AvangCLI

A powerful CLI tool for scaffolding fullstack projects with Next.js (frontend) and FastAPI (backend).

**Website & Documentation:** [https://avangcli.vercel.app](https://avangcli.vercel.app)

## Project Description

Avangcli is a comprehensive command-line interface tool designed to streamline the development workflow for modern fullstack applications. It provides an intuitive, interactive experience for generating and scaffolding production-ready projects with industry-standard configurations and best practices built-in.

### Objectives

The main objectives of Avangcli are:

1. **Accelerate Development**: Reduce the time spent on project setup and boilerplate code by providing automated scaffolding for both frontend and backend projects.

2. **Enforce Best Practices**: Ensure projects start with proper structure, linting, formatting, and Docker configurations following industry standards.

3. **Improve Developer Experience**: Offer an interactive CLI with beautiful prompts and clear feedback, making project setup accessible for developers of all levels.

4. **Maintain Consistency**: Generate consistent project structures and module architectures across teams and projects.

5. **Support Modern Tech Stack**: Integrate the latest versions of Next.js, FastAPI, and modern development tools with customizable configurations.

6. **Enable Scalability**: Create modular architectures that support the growth of applications from MVP to production-scale systems.

## Team Members

This project is developed and maintained by:

- **Claudia Queipo** ([@ClaudiaQueipo](https://github.com/ClaudiaQueipo)) - Full Stack Developer & Project Lead
- **solyfaby** ([@solyfaby](https://github.com/solyfaby)) - Collaborator
- **ppit890819** ([@ppit890819](https://github.com/ppit890819)) - Collaborator
- **Alejandro Yero** ([@IronBeardX](https://github.com/IronBeardX)) - Collaborator
- **Luis Andrés Licea Berenguer** ([@luislicea1](https://github.com/luislicea1)) - Collaborator

## Features

- Interactive CLI with beautiful prompts
- Frontend: Next.js project setup with customizable configurations
- **Module scaffolding**: Automatic module generation for Next.js applications with complete folder structure and boilerplate code
- Backend: FastAPI project generation (coming soon)
- Package manager support: npm, yarn, pnpm, bun
- Linter/Formatter options: ESLint + Prettier, Biome
- Docker configuration: dev, prod, or both environments
- Command-line arguments support with yargs

## Setup and Installation

### Prerequisites

Before installing Avangcli, ensure you have the following installed on your system:

- **Node.js 20+** - Required for frontend CLI and master CLI
- **Python 3.8+** - Required for backend CLI (coming soon)
- **Bun** (recommended) or npm/yarn/pnpm - Package manager

You can verify your installations with:

```bash
node --version  # Should be 20.x or higher
python3 --version  # Should be 3.8 or higher
bun --version  # Or your preferred package manager
```

### Installation from Source

To install Avangcli for development:

```bash
# Clone the repository
git clone <repository-url>
cd avangcli

# Install master CLI dependencies
bun install

# Install frontend CLI dependencies
cd frontend-cli && bun install && cd ..

# Or install all dependencies at once
bun run install:all
```

### Global Installation (Coming Soon)

```bash
npm install -g avangcli
# or
bun install -g avangcli
```

## Usage

### Master CLI

The master CLI coordinates between frontend and backend CLIs:

```bash
avangcli frontend    # Launch frontend CLI
avangcli backend     # Launch backend CLI
```

### Frontend CLI

#### Initialize a new Next.js project

```bash
# Interactive mode
avangcli init

# With arguments
avangcli init my-app --pm bun --tailwind --lf biome --docker dev

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
avangcli module <module-name>

# Examples:
avangcli module user-profile
avangcli module shopping-cart
avangcli module authentication

# Skip Next.js validation (use with caution)
avangcli module my-module --skip-validation
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

#### Regenerate project configuration

```bash
# Regenerate avangclirc.json based on current project setup
avangcli config
```

**Config features:**

- Detects package manager (npm, yarn, pnpm, bun)
- Identifies Tailwind CSS usage
- Detects linter/formatter setup (ESLint + Prettier, Biome)
- Checks Docker configuration (dev, prod, both)
- Identifies UI library (MUI, Shadcn, HeroUI)
- Detects Git setup (Husky, Commitlint)
- Configures OpenAPI docs and output directories

#### Generate TypeScript clients from OpenAPI specs

```bash
# Generate clients using project configuration
avangcli generate

# With custom directories
avangcli generate --docs-dir ./api-docs --output-dir ./src/generated

# Options:
#   --docs-dir, -d    Directory containing OpenAPI JSON files
#   --output-dir, -o  Output directory for generated clients
```

**Generate features:**

- Scans for OpenAPI JSON files in specified directory
- Generates TypeScript clients automatically
- Supports multiple API specifications
- Integrates with project configuration
- Runs config command if no configuration exists

### Backend CLI (coming soon)

```bash
avangcli backend init
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
avangcli/
├── bin/              # Executables
├── src/              # Master CLI logic
├── frontend-cli/     # Frontend CLI (independent)
├── backend-cli/      # Backend CLI (independent)
└── docs/             # Documentation
```

For detailed structure information, see [project-structure.md](project-structure.md).

## Additional Information

### Technology Stack

Avangcli leverages modern technologies to provide a robust development experience:

**Frontend CLI:**

- **Node.js** - Runtime environment
- **Next.js 15** - React framework with App Router and Server Components
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework (optional)
- **ESLint + Prettier / Biome** - Code quality and formatting tools
- **Docker** - Containerization for development and production

**Backend CLI (Coming Soon):**

- **Python 3.8+** - Programming language
- **FastAPI** - Modern, fast web framework for building APIs
- **Docker** - Containerization support

**CLI Tools:**

- **Yargs** - Command-line argument parser
- **@clack/prompts** - Beautiful interactive CLI prompts
- **Husky** - Git hooks for code quality
- **Lint-staged** - Run linters on staged files

### Project Architecture

Avangcli follows a modular architecture with three main components:

1. **Master CLI**: Orchestrates the frontend and backend CLIs
2. **Frontend CLI**: Independent CLI for Next.js project generation and module scaffolding
3. **Backend CLI**: Independent CLI for FastAPI project generation (in development)

Each CLI is designed to work independently or as part of the unified Avangcli ecosystem.

### Module Scaffolding Philosophy

The module generation feature follows best practices for scalable React/Next.js applications:

- **Container/Component Pattern**: Separates business logic from presentation
- **Service Layer**: Encapsulates API calls and business logic with singleton pattern
- **Type Safety**: Generates TypeScript definitions for all modules
- **Barrel Exports**: Clean import statements using index files
- **Consistent Structure**: Predictable folder organization across all modules

### Contributing

Contributions are welcome! If you'd like to contribute to Avangcli:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following conventional commits
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes all linting and formatting checks before submitting.

### Support & Resources

- **Website**: [https://avangcli.vercel.app](https://avangcli.vercel.app)
- **Documentation**: See the `/docs` folder for detailed guides
- **Issues**: Report bugs or request features via GitHub Issues

## Documentation

- [CLI Usage Guide](docs/cli-usage.md)
- [Module Command](docs/module-command.md) - **Detailed guide for module scaffolding**
- [Project Templates](docs/project-templates.md)
- [Architecture](docs/architecture.md)
- [API Reference](docs/api-reference.md)

## License

ISC
