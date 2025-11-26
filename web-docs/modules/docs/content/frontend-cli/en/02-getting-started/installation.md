# Installation and Setup

## Prerequisites

Before installing AvangCLI Frontend, make sure you have:

- **Node.js 20+** - [Download Node.js](https://nodejs.org/)
- **Package manager**: npm, yarn, pnpm, or bun
- **Git** (optional, but recommended)

### Verify Requirements

```bash
# Check Node.js version
node --version  # Must be >= 20.x

# Check npm (comes with Node.js)
npm --version

# (Optional) Check bun
bun --version
```

## Installation

### Option 1: From Source Code (Development)

```bash
# Clone the repository using https
git clone https://github.com/ClaudiaQueipo/avangcli.git

# Clone the repository using ssh
git clone git@github.com:ClaudiaQueipo/avangcli.git

cd avangcli

# Install master CLI dependencies
bun install

# Install frontend CLI dependencies
cd frontend-cli && bun install && cd ..

# Or install all dependencies at once
bun run install:all
```

### Option 2: Global Installation (Coming Soon)

```bash
# When available on npm
npm install -g avangcli
```

## Local Linking for Development

If you're developing or testing changes:

```bash
# From the project root folder
npm link

# Now you can use 'avangcli' from anywhere
avangcli --help
```

## Verify Installation

```bash
# Verify the CLI works
avangcli --version

# View available commands
avangcli --help

# Test the frontend CLI
avangcli init --help
```

## Initial Setup

### 1. Global Configuration (Optional)

You can create a global configuration file to set default preferences:

```bash
# Create configuration directory
mkdir -p ~/.avangcli

# Create global configuration file
cat > ~/.avangcli/config.json << 'EOF'
{
  "defaultPackageManager": "bun",
  "defaultStoreManager": "zustand",
  "defaultLinterFormatter": "eslint-prettier",
  "defaultUiLibrary": "shadcn"
}
EOF
```

### 2. Per-Project Configuration

Each project created with `avangcli init` will automatically generate an `avangclirc.json` file in the project root with specific configuration:

```json
{
  "packageManager": "bun",
  "tailwind": true,
  "linterFormatter": "eslint-prettier",
  "docker": "none",
  "uiLibrary": "shadcn",
  "gitSetup": true
}
```

To regenerate this file based on the current project configuration:

```bash
avangcli config
```

## Updating

### Update from Source Code

```bash
cd avangcli
git pull origin main
bun install
cd frontend-cli && bun install
```

### Update Global Installation (When Available)

```bash
npm update -g avangcli
```

## Uninstallation

### Uninstall Local Link

```bash
cd avangcli
npm unlink
```

### Uninstall Global Installation

```bash
npm uninstall -g avangcli
```

## Installation Troubleshooting

### Error: "Command not found: avangcli"

**Solution:**

```bash
# Verify npm link was executed correctly
npm link

# Or add npm global path to your PATH
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Error: "Module not found"

**Solution:**

```bash
# Reinstall dependencies
cd avangcli/frontend-cli
rm -rf node_modules
bun install
```

### Permission Errors on Linux/Mac

**Solution:**

```bash
# Use sudo only if necessary
sudo npm link

# Or change npm global directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Next Steps

- [Configuration Guide](./configuration.md)
- [init Command](../03-commands/init.md)
- [Complete Tutorial](../08-guides/complete-project-walkthrough.md)
