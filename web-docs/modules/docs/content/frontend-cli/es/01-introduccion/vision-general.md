# Visión General - AvangCLI Frontend

## ¿Qué es AvangCLI Frontend?

AvangCLI Frontend es una herramienta de línea de comandos (CLI) poderosa y flexible diseñada para acelerar y estandarizar el desarrollo de proyectos Next.js. Proporciona una interfaz interactiva e intuitiva para crear, configurar y generar componentes de aplicaciones frontend modernas.

## Características Principales

### 🚀 Inicialización Rápida de Proyectos

- Creación automatizada de proyectos Next.js con configuraciones personalizadas
- Soporte para múltiples gestores de paquetes (npm, yarn, pnpm, bun)
- Configuración opcional de Tailwind CSS
- Integración con herramientas de linting y formateo

### 🧩 Generación de Módulos

- Scaffolding automático de módulos completos con estructura consistente
- Implementación del patrón Screaming Architecture
- Generación de componentes, servicios, tipos y hooks mocked para comenzar
- Soporte para gestores de estado (Zustand, Redux)

### 🎨 Integración de Librerías UI

- Instalación y configuración automática de Material UI
- Configuración de shadcn/ui con dependencias
- Integración de HeroUI con Tailwind CSS

### 🔧 Configuración de Herramientas de Desarrollo

- ESLint + Prettier
- Biome como alternativa moderna
- Configuración de Docker para desarrollo y producción
- Git setup con Commitizen, Commitlint, Husky y Lint-staged

### 📦 Gestión de Paquetes Flexible

El CLI soporta:

- npm
- yarn
- pnpm
- bun

## Arquitectura del CLI

```
frontend-cli/
├── cli/
│   ├── commands/          # Comandos disponibles (init, module, ui-library)
│   ├── core/              # Módulos principales del sistema
│   │   ├── PackageManagerStrategy.js
│   │   ├── ModuleGenerator.js
│   │   ├── NextJsValidator.js
│   │   ├── ConfigManager.js
│   │   └── ...
│   ├── prompts.js         # Gestión de prompts interactivos
│   ├── actions.js         # Acciones de configuración
│   └── utils.js           # Utilidades compartidas
├── templates/             # Plantillas de código
└── index.js              # Punto de entrada
```

## Flujo de Trabajo Típico

1. **Inicialización**: Crear un nuevo proyecto Next.js con todas las configuraciones deseadas
2. **Desarrollo**: Generar módulos según las necesidades de la aplicación
3. **Extensión**: Agregar librerías UI y herramientas adicionales según sea necesario
4. **Mantenimiento**: Mantener consistencia en el código con las herramientas de calidad integradas

## Próximos Pasos

- [Por qué usar esta herramienta](./por-que-usar-esta-herramienta.md)
- [Cuándo usar esta herramienta](./cuando-usar.md)
- [Guía de instalación](../02-primeros-pasos/instalacion.md)
- [Comandos disponibles](../03-comandos/init.md)

## Recursos Adicionales

- [Arquitectura del CLI](../04-arquitectura/vision-general.md)
- [Screaming Architecture](../04-arquitectura/screaming-architecture.md)
- [Proyecto completo paso a paso](../08-guias/proyecto-completo-paso-a-paso.md)
- [Mejores prácticas](../08-guias/mejores-practicas.md)
