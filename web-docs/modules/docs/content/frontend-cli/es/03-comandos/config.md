# Comando: config

## Descripción

El comando `config` regenera el archivo `avangclirc.json` en el directorio del proyecto actual, detectando automáticamente la configuración existente del proyecto Next.js. Esto es útil si el archivo de configuración se ha eliminado o si deseas actualizarlo después de cambios manuales.

## Sintaxis

```bash
avangcli config
```

## ¿Qué Hace el Comando?

El comando analiza el proyecto actual y detecta:

### 1. Gestor de Paquetes

- Verifica la presencia de archivos de bloqueo:
  - `yarn.lock` → `yarn`
  - `pnpm-lock.yaml` → `pnpm`
  - `bun.lock` → `bun`
  - De lo contrario → `npm`

### 2. Tailwind CSS

- Busca `tailwindcss` en `dependencies` o `devDependencies`
- Verifica existencia de `tailwind.config.js` o `tailwind.config.ts`

### 3. Linter/Formatter

- `biome.json` presente → `biome`
- Archivos de ESLint presentes (`.eslintrc.js`, `eslint.config.js`, etc.) → `eslint-prettier`
- De lo contrario → `none`

### 4. Docker

- `docker-compose.dev.yml` y `docker-compose.prod.yml` → `both`
- Solo `docker-compose.dev.yml` → `dev`
- Solo `docker-compose.prod.yml` → `prod`
- Ninguno → `none`

### 5. Librería UI

- `@mui/material` presente → `mui`
- `components.json` presente → `shadcn`
- `@heroui/react` presente → `heroui`
- Ninguna → `none`

### 6. Configuración Git

- `husky` en `devDependencies` o directorio `.husky` presente
- `commitlint.config.js` presente → `true`
- De lo contrario → `false`

### 7. Validación del Proyecto

- Verifica que existe `package.json`
- Confirma que `next` está en `dependencies` o `devDependencies`

## Ejemplos de Uso

### Ejemplo 1: Regenerar Configuración

```bash
cd my-nextjs-project
avangcli config
```

### Ejemplo 2: Después de Cambios Manuales

```bash
# Agregaste Docker manualmente
echo "Agregué docker-compose.yml"
avangcli config  # Actualiza avangclirc.json
```

## Archivo Generado

Crea `avangclirc.json` en la raíz del proyecto:

```json
{
  "packageManager": "bun",
  "tailwind": true,
  "linterFormatter": "eslint-prettier",
  "docker": "both",
  "uiLibrary": "heroui",
  "gitSetup": true
}
```

## Requisitos

- Debes ejecutar el comando dentro de un directorio de proyecto Next.js válido
- El proyecto debe tener `package.json` con Next.js instalado
- El archivo `avangclirc.json` será sobrescrito si existe

## Siguientes Pasos Después de Config

Una vez regenerado el archivo:

```bash
# Verificar configuración
cat avangclirc.json

# Usar otros comandos que dependen de la config
avangcli module my-module
```

## Tips y Notas

### Nota sobre Detección Automática

La detección se basa en archivos y dependencias presentes. Si instalaste algo manualmente pero no aparece en `package.json`, podría no detectarse.

### Configuración Personalizada

Si necesitas una configuración específica que no se detecta automáticamente, edita `avangclirc.json` manualmente después de regenerarlo.

### Proyecto No Válido

Si ejecutas `config` fuera de un proyecto Next.js, recibirás un error.

## Troubleshooting

### Error: "No package.json found"

**Causa:** No estás en un directorio de proyecto

**Solución:**

```bash
cd my-nextjs-project
avangcli config
```

### Error: "This doesn't appear to be a Next.js project"

**Causa:** El proyecto no tiene Next.js instalado

**Solución:**

```bash
# Verificar instalación
cat package.json | grep next

# Instalar si falta
npm install next
avangcli config
```

### Error: "Failed to write project config"

**Causa:** Problemas de permisos

**Solución:**

```bash
# Linux/Mac
chmod 755 .
avangcli config
```

### Configuración No Detectada Correctamente

**Causa:** Cambios manuales no reflejados en archivos estándar

**Solución:**

```bash
# Verificar dependencias
npm list tailwindcss  # Para Tailwind
npm list @heroui/react  # Para HeroUI

# Regenerar
avangcli config
```

## Recursos Relacionados

- [Comando init](./init.md)
- [Comando module](./module.md)
- [Configuración](../02-primeros-pasos/configuracion.md)
- [Estructura del Proyecto](../02-primeros-pasos/estructura-proyecto.md)
