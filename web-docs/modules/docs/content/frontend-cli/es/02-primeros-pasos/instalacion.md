# Instalación y Configuración

## Requisitos Previos

Antes de instalar AvangCLI Frontend, asegúrate de tener:

- **Node.js 20+** - [Descargar Node.js](https://nodejs.org/)
- **Gestor de paquetes**: npm, yarn, pnpm o bun
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

### Opción 1: Desde el Código Fuente (Desarrollo)

```bash
# Clonar el repositorio usando https
git clone https://github.com/ClaudiaQueipo/avangcli.git

# Clonar el repositorio usando ssh
git clone git@github.com:ClaudiaQueipo/avangcli.git

cd avangcli

# Instalar dependencias del CLI maestro
bun install

# Instalar dependencias del frontend CLI
cd frontend-cli && bun install && cd ..

# O instalar todas las dependencias a la vez
bun run install:all
```

### Opción 2: Instalación Global (Próximamente)

```bash
# Cuando esté disponible en npm
npm install -g avangcli
```

## Vinculación Local para Desarrollo

Si estás desarrollando o probando cambios:

```bash
# Desde la carpeta raíz del proyecto
npm link

# Ahora puedes usar 'avangcli' desde cualquier lugar
avangcli --help
```

## Verificar Instalación

```bash
# Verificar que el CLI funcione
avangcli --version

# Ver comandos disponibles
avangcli --help

# Probar el frontend CLI
avangcli init --help
```

## Configuración Inicial

### 1. Configuración Global (Opcional)

Puedes crear un archivo de configuración global para establecer preferencias predeterminadas:

```bash
# Crear directorio de configuración
mkdir -p ~/.avangcli

# Crear archivo de configuración global
cat > ~/.avangcli/config.json << 'EOF'
{
  "defaultPackageManager": "bun",
  "defaultStoreManager": "zustand",
  "defaultLinterFormatter": "eslint-prettier",
  "defaultUiLibrary": "shadcn"
}
EOF
```

### 2. Configuración por Proyecto

Cada proyecto creado con `avangcli init` generará automáticamente un archivo `avangclirc.json` en la raíz del proyecto con la configuración específica:

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

Para regenerar este archivo basándote en la configuración actual del proyecto:

```bash
avangcli config
```

## Actualización

### Actualizar desde el Código Fuente

```bash
cd avangcli
git pull origin main
bun install
cd frontend-cli && bun install
```

### Actualizar Instalación Global (Cuando esté disponible)

```bash
npm update -g avangcli
```

## Desinstalación

### Desinstalar Enlace Local

```bash
cd avangcli
npm unlink
```

### Desinstalar Instalación Global

```bash
npm uninstall -g avangcli
```

## Resolución de Problemas de Instalación

### Error: "Command not found: avangcli"

**Solución:**

```bash
# Verificar que npm link se ejecutó correctamente
npm link

# O agregar el path de npm global a tu PATH
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Error: "Module not found"

**Solución:**

```bash
# Reinstalar dependencias
cd avangcli/frontend-cli
rm -rf node_modules
bun install
```

### Error de Permisos en Linux/Mac

**Solución:**

```bash
# Usar sudo solo si es necesario
sudo npm link

# O cambiar el directorio de npm global
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Próximos Pasos

- [Guía de configuración](./configuracion.md)
- [Comando init](../03-comandos/init.md)
- [Tutorial completo](../08-guias/proyecto-completo-paso-a-paso.md)
