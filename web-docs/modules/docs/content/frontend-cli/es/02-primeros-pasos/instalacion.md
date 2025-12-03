# Instalación y Configuración

## Prerrequisitos

Antes de instalar AvangCLI Frontend, asegúrate de tener:

- **Node.js 20+** - [Descargar Node.js](https://nodejs.org/)
- **Gestor de paquetes**: npm, yarn, pnpm, o bun
- **Git** (opcional, pero recomendado)

### Verificar Requisitos

```bash
# Verificar versión de Node.js
node --version  # Debe ser >= 20.x

# Verificar npm (viene con Node.js)
npm --version

# (Opcional) Verificar bun
bun --version
```

## Instalación

Para instalar `avangcli`, usa uno de los siguientes métodos:

### Instalación Global (Recomendado)

```bash
npm install -g avangcli
```

### Usando npx (para uso único o sin instalación global)

```bash
npx avangcli
```

## Verificar Instalación

```bash
# Verificar que el CLI funcione
avangcli --version

# Ver comandos disponibles
avangcli --help
```

## Actualización

### Actualizar Instalación Global

```bash
npm update -g avangcli
```

## Desinstalación

### Desinstalar Instalación Global

```bash
npm uninstall -g avangcli
```
