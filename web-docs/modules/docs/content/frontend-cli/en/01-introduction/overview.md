# Overview - AvangCLI Frontend

## What is AvangCLI Frontend?

AvangCLI Frontend is a powerful and flexible command-line interface (CLI) tool designed to accelerate and standardize the development of Next.js projects. It provides an interactive and intuitive interface for creating, configuring, and generating components for modern frontend applications.

## Key Features

### 🚀 Quick Project Initialization

- Automated creation of Next.js projects with custom configurations
- Support for multiple package managers (npm, yarn, pnpm, bun)
- Optional Tailwind CSS configuration
- Integration with linting and formatting tools

### 🧩 Module Generation

- Automatic scaffolding of complete modules with consistent structure
- Implementation of the Screaming Architecture pattern
- Generation of components, services, types, and mocked hooks to get started
- Support for state managers (Zustand, Redux)

### 🎨 UI Library Integration

- Automatic installation and configuration of Material UI
- Configuration of shadcn/ui with dependencies
- Integration of HeroUI with Tailwind CSS

### 🔧 Development Tools Configuration

- ESLint + Prettier
- Biome as a modern alternative
- Docker configuration for development and production
- Git setup with Commitizen, Commitlint, Husky, and Lint-staged

### 📦 Flexible Package Management

The CLI supports:

- npm
- yarn
- pnpm
- bun

## CLI Architecture

```
frontend-cli/
├── cli/
│   ├── commands/          # Available commands (init, module, ui-library)
│   ├── core/              # Main system modules
│   │   ├── PackageManagerStrategy.js
│   │   ├── ModuleGenerator.js
│   │   ├── NextJsValidator.js
│   │   ├── ConfigManager.js
│   │   └── ...
│   ├── prompts.js         # Interactive prompts management
│   ├── actions.js         # Configuration actions
│   └── utils.js           # Shared utilities
├── templates/             # Code templates
└── index.js              # Entry point
```

## Typical Workflow

1. **Initialization**: Create a new Next.js project with all desired configurations
2. **Development**: Generate modules according to application needs
3. **Extension**: Add UI libraries and additional tools as needed
4. **Maintenance**: Maintain code consistency with integrated quality tools

## Next Steps

- [Why use this tool](./why-use-this-tool.md)
- [When to use this tool](./when-to-use.md)
- [Installation guide](../02-getting-started/installation.md)
- [Available commands](../03-commands/init.md)

## Additional Resources

- [CLI Architecture](../04-architecture/overview.md)
- [Screaming Architecture](../04-architecture/screaming-architecture.md)
- [Complete project walkthrough](../08-guides/complete-project-walkthrough.md)
- [Best practices](../08-guides/best-practices.md)
