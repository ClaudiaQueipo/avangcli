# AvangCLI VSCode Extension - Development Setup

## Prerequisites

1. **Node.js 20+** installed
2. **VSCode** installed
3. **AvangCLI** installed globally:
   ```bash
   npm install -g avangcli
   # or
   bun install -g avangcli
   ```

## Development Setup

1. **Install dependencies:**
   ```bash
   cd vscode-extension
   npm install
   ```

2. **Compile the extension:**
   ```bash
   npm run compile
   ```

3. **Open in VSCode:**
   ```bash
   code .
   ```

4. **Run the extension:**
   - Press `F5` to launch a new VSCode window with the extension loaded
   - Or use the "Run Extension" debug configuration

## Building for Production

```bash
npm run vscode:prepublish
```

## Publishing to Marketplace

1. **Package the extension:**
   ```bash
   vsce package
   ```

2. **Publish to marketplace:**
   ```bash
   vsce publish
   ```

## Icon Creation

To create a proper icon for the extension:

1. Create a 128x128 PNG icon
2. Save it as `images/icon.png`
3. Update the `package.json` icon path if needed

## Testing

- Use the integrated terminal in the extension host window
- Test all commands through the Command Palette (`Ctrl+Shift+P`)
- Verify context menus work in Explorer and file views

## Folder Structure

```
vscode-extension/
├── src/
│   ├── commands/
│   │   ├── generateClients.ts
│   │   ├── generateModule.ts
│   │   ├── initProject.ts
│   │   └── regenerateConfig.ts
│   ├── services/
│   │   └── avangCliManager.ts
│   └── extension.ts
├── .vscode/
│   ├── launch.json
│   └── tasks.json
├── images/
│   └── icon.png
├── out/                 # Compiled output
├── package.json
├── tsconfig.json
├── README.md
└── CHANGELOG.md
```