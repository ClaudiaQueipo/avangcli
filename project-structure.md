# Fullstack Project Generator CLI Structure (npm Package)

## Overview

This CLI tool generates fullstack projects with:

- Frontend: Next.js (JavaScript)
- Backend: FastAPI (Python)
- Master CLI: JavaScript (Node.js) to coordinate FE and BE CLIs

Designed as an npm package for easy installation and distribution.

## Current Folder Structure

```
avangcli/
├── bin/                          # Executables (npm bin links)
│   └── avangcli                  # Main CLI entry point (symlinked by npm)
├── src/                          # Master CLI logic
│   └── index.js                  # Master CLI coordinator
├── frontend-cli/                 # Frontend CLI (independent)
│   ├── index.js                  # Main entry point
│   ├── cli/                      # CLI implementation
│   │   ├── commands/             # CLI commands
│   │   │   └── init.js           # Init command with yargs
│   │   ├── core/                 # Core functionality
│   │   │   ├── CommandExecutor.js
│   │   │   ├── PackageManagerStrategy.js
│   │   │   ├── Prompt.js
│   │   │   ├── SetupCommand.js
│   │   │   ├── ToolSetupCommands.js
│   │   │   └── Validator.js
│   │   ├── actions.js            # CLI actions (create, setup, install)
│   │   ├── prompts.js            # Interactive prompts
│   │   └── utils.js              # CLI utilities
│   └── templates/                # Configuration templates
│       ├── eslint-prettier/      # ESLint + Prettier configs
│       ├── biome/                # Biome configs
│       └── docker/               # Docker configs (dev/prod)
├── backend-cli/                  # Backend CLI (independent)
│   ├── __init__.py
│   ├── generator.py              # FastAPI project generation
│   └── templates/                # FastAPI templates
│       ├── basic/
│       ├── with-auth/
│       └── with-db/
├── docs/                         # Documentation
│   ├── README.md                 # Main documentation
│   ├── cli-usage.md              # CLI usage guide
│   ├── project-templates.md      # Template descriptions
│   ├── architecture.md           # System architecture
│   └── api-reference.md          # API reference for generated projects
├── package.json                  # npm package configuration (master CLI only)
└── .gitignore

## Package Management

Each CLI has its own dependencies:

### Master CLI (root)
- **package.json**: Contains only yargs for the master CLI
- **Dependencies**: Minimal - only what's needed to coordinate between CLIs

### Frontend CLI
- **frontend-cli/package.json**: Contains @clack/prompts, yargs, and other frontend-specific dependencies
- **Installation**: Run `bun install` inside frontend-cli/ or `bun run install:frontend` from root

### Backend CLI
- **backend-cli/requirements.txt**: Python dependencies for FastAPI project generation
- **backend-cli/pyproject.toml**: Python project configuration
- **Installation**: Run `pip install -r requirements.txt` inside backend-cli/ or `bun run install:backend` from root
```

## CLI Architecture

### Master CLI (JavaScript - npm Package)

- **Purpose**: Orchestrates the creation of fullstack projects
- **Framework**: Commander.js or Oclif for CLI interface
- **npm Integration**:
  - `bin/avangcli` as main executable
  - Published to npm registry
  - Installed globally: `npm install -g avangcli`
- **Responsibilities**:
  - Parse user options (project name, frontend type, backend type, etc.)
  - Call FE CLI to generate frontend
  - Call BE CLI to generate backend
  - Handle errors and provide unified output

### Frontend CLI (JavaScript)

- **Purpose**: Generates Next.js projects
- **Framework**: Node.js with file system operations
- **Templates**:
  - App Router (latest Next.js)
  - Pages Router (legacy support)
  - Customizable components

### Backend CLI (Python)

- **Purpose**: Generates FastAPI projects
- **Framework**: Click or argparse for CLI
- **Templates**:
  - Basic API
  - With authentication
  - With database integration
- **Note**: Requires Python runtime on user's system

## Interaction Model

The master CLI coordinates the sub-CLIs by:

1. Parsing global options
2. Invoking FE CLI via subprocess (Node.js child_process)
3. Invoking BE CLI via subprocess (Python subprocess)
4. Providing unified progress reporting and error handling

## npm Package Considerations

- **Dependencies**: Include Commander.js, fs-extra, etc. in package.json
- **Python Dependency**: Document requirement for Python 3.8+ in README
- **Cross-platform**: Ensure subprocess calls work on Windows/macOS/Linux
- **Versioning**: Use semantic versioning for releases

## Documentation Structure

- `doc/README.md`: Overview and getting started
- `doc/cli-usage.md`: Detailed CLI commands and options
- `doc/project-templates.md`: Description of available templates
- `doc/architecture.md`: Technical architecture details
- `doc/api-reference.md`: Reference for generated project APIs

This structure allows for modular development, easy testing, and clear separation of concerns between the different CLI components. The npm package approach enables easy distribution and installation for users.
