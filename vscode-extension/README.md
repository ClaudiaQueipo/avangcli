# AvangCLI VSCode Extension

A Visual Studio Code extension for [AvangCLI](https://avangcli.vercel.app/) - a powerful CLI tool for scaffolding fullstack projects with Next.js.

## 🌟 Features

This extension brings AvangCLI functionality directly to your VSCode editor with seamless integration:

### 🚀 Project Initialization
- **Interactive Setup**: Initialize new Next.js projects with guided configuration
- **Package Managers**: Choose from npm, yarn, pnpm, or bun
- **Modern Tools**: Configure Tailwind CSS, linters, Docker, and UI libraries
- **Smart Defaults**: Uses your preferred settings from VSCode configuration

### 📦 Module Generation
- **Complete Modules**: Generate full module structures with best practices
- **State Management**: Built-in support for Zustand and Redux
- **Auto-Validation**: Ensures you're working in a valid Next.js project
- **Dependency Installation**: Automatically installs required packages

### ⚙️ Configuration Management
- **Auto-Detection**: Regenerates project configuration files
- **Project Analysis**: Automatically detects current setup
- **One-Click Updates**: Keep your configuration synchronized

### 🔧 Client Generation
- **OpenAPI Integration**: Generate TypeScript clients from API specifications
- **Custom Paths**: Configure input/output directories
- **Multiple APIs**: Support for multiple API specifications

### 🔄 Smart Installation
- **Auto-Setup**: Automatically installs AvangCLI globally on first use
- **No Manual Steps**: Everything works out of the box
- **Cross-Platform**: Works seamlessly on Windows, macOS, and Linux

## 📥 Installation

1. **Install from VSCode Marketplace**:
   - Open VSCode
   - Go to Extensions (`Ctrl+Shift+X`)
   - Search for "AvangCLI Extension"
   - Click Install

2. **Automatic Setup**:
   - The extension automatically installs AvangCLI globally on first use
   - No manual installation required!
   - You'll see installation progress in the terminal

> **Note**: Node.js 20+ is required for AvangCLI to work properly.

## 🚀 Getting Started

### Accessing Commands

You can use AvangCLI commands in multiple ways:

1. **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`):
   - Type "AvangCLI" to see all available commands
   - Select the command you want to run

2. **Context Menus**:
   - **Explorer**: Right-click on folders to initialize projects
   - **Files**: Right-click on JS/TS files to generate modules

3. **Direct Commands**:
   - `AvangCLI: Initialize New Project` - Create new Next.js projects
   - `AvangCLI: Generate Module` - Add modules to existing projects
   - `AvangCLI: Regenerate Config` - Update project configuration
   - `AvangCLI: Generate TypeScript Clients` - Create API clients from OpenAPI specs

### First Time Experience

When you first use the extension:
1. It automatically checks if AvangCLI is installed
2. If not found, it installs it globally using `npm install -g avangcli`
3. Shows installation progress in a terminal window
4. You're ready to use all features immediately!

## ⚙️ Configuration

Customize your default settings in VSCode settings (`Ctrl+,`):

```json
{
  "avangcli.packageManager": "bun",        // Default package manager
  "avangcli.useTailwind": true,            // Enable Tailwind CSS by default
  "avangcli.linterFormatter": "biome",     // Default code quality tool
  "avangcli.dockerConfig": "none",         // Default Docker setup
  "avangcli.uiLibrary": "none"             // Default UI library
}
```

### Configuration Options

- **Package Manager**: Choose your preferred package manager
- **Tailwind CSS**: Enable/disable by default
- **Code Quality**: Select ESLint+Prettier, Biome, or none
- **Docker**: Configure development, production, both, or none
- **UI Library**: Pre-select Material UI, Shadcn, HeroUI, or none

## 🛠️ Requirements

- **VSCode**: Version 1.80.0 or higher
- **Node.js**: Version 20+ installed on your system
- **Internet**: Required for initial AvangCLI installation

## 💡 Tips & Best Practices

### Project Initialization
- Use the interactive mode for guided setup
- Configure your preferences in VSCode settings for faster workflow
- The extension remembers your choices for future projects

### Module Generation
- Module names should be in kebab-case (e.g., `user-profile`)
- Choose the appropriate state management solution for your needs
- Generated modules follow React/Next.js best practices

### Troubleshooting
- If commands don't work, check that Node.js 20+ is installed
- Restart VSCode after initial installation
- Check the terminal output for any error messages

## 🤝 Contributing

Contributions are welcome! Please see the [main AvangCLI repository](https://github.com/ClaudiaQueipo/avangcli) for contribution guidelines.

## 📄 License

ISC

## 👥 Authors

[Claudia Queipo](https://github.com/ClaudiaQueipo) and contributors

---

*Made with ❤️ for the developer community*