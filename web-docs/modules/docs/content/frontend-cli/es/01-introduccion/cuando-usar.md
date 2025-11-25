# ¿Cuándo Usar AvangCLI Frontend?

## Etapas de Proyecto

### 1. 🚀 Inicio de Proyectos Nuevos

**Escenario ideal:** Estás comenzando un nuevo proyecto Next.js desde cero.

**Beneficios:**

- Configuración completa en minutos
- Todas las herramientas de desarrollo ya configuradas
- Arquitectura escalable desde el día 1
- Sin deuda técnica inicial

**Comandos típicos:**

```bash
avangcli init my-new-project --pm bun --tailwind --lf eslint-prettier --docker both --ui shadcn --git-setup
```

**Resultado:**

- Proyecto Next.js configurado
- ESLint + Prettier funcionando
- Docker listo para dev y prod
- Git hooks configurados
- shadcn/ui instalado y listo

---

### 2. 📈 Proyectos en Desarrollo Activo

**Escenario:** Ya tienes un proyecto Next.js y necesitas agregar nuevas funcionalidades.

**Beneficios:**

- Genera módulos consistentes rápidamente
- Mantiene la arquitectura uniforme
- Acelera el desarrollo de features

**Comandos típicos:**

```bash
# Agregar un nuevo módulo
avangcli module user-profile --store zustand

# Agregar otro módulo
avangcli module shopping-cart --store zustand -p

# Agregar UI library si no la tienes
avangcli ui-library shadcn
```

**Resultado:**

- Módulos completos con estructura consistente
- Services, types, hooks ya configurados
- Store management integrado

---

### 3. 🔄 Refactorización y Mejora

**Escenario:** Proyecto existente que necesita mejor organización.

**Uso recomendado:**

- Genera módulos nuevos con la arquitectura modular
- Migra componentes existentes gradualmente
- Establece un estándar para el equipo

**Estrategia:**

1. Generar nuevos módulos con AvangCLI
2. Migrar código existente a la nueva estructura
3. Mantener consistencia en nuevas features

---

### 4. 👥 Onboarding de Nuevos Desarrolladores

**Escenario:** Equipo en crecimiento que necesita estándares claros.

**Beneficios:**

- Estructura predecible y documentada
- Nuevos devs son productivos más rápido
- Menos preguntas sobre "dónde poner el código"

**Ventaja:** Los desarrolladores junior pueden generar código de calidad profesional desde el primer día.

---

### 5. 🏢 Múltiples Proyectos Next.js

**Escenario:** Empresa o agencia con varios proyectos.

**Beneficios:**

- Misma arquitectura en todos los proyectos
- Desarrolladores pueden moverse entre proyectos fácilmente
- Mantenimiento simplificado

**Resultado:** Portfolio de proyectos con código consistente y mantenible.

---

## Casos de Uso Específicos

### ✅ Cuándo SÍ usar AvangCLI

#### 1. Proyectos con arquitectura escalable

```bash
# Necesitas que el proyecto crezca de forma organizada
avangcli module authentication --store redux
avangcli module products --store redux -p
avangcli module checkout --store redux
```

#### 2. Equipos que valoran consistencia

- Múltiples desarrolladores trabajando
- Code reviews frecuentes
- Necesidad de estándares claros

#### 3. Prototipos que pueden convertirse en producción

- Quieres iterar rápido pero con calidad
- No quieres deuda técnica desde el inicio

#### 4. Proyectos con requisitos de calidad estrictos

- Necesitas linting, formatting, testing configurados
- Git hooks y commit conventions requeridos
- Docker para despliegue consistente

#### 5. Proyectos con estado complejo

- Aplicaciones con múltiples módulos
- Necesidad de gestión de estado robusta
- Redux o Zustand como requisito

---

### ❌ Cuándo NO usar AvangCLI

#### 1. Proyectos extremadamente simples

- Landing pages estáticas
- Sites de una sola página sin estado
- Proyectos de prueba de concepto desechables

**Alternativa:** `create-next-app` es suficiente

#### 2. Arquitectura completamente personalizada

- Ya tienes una arquitectura muy específica
- Necesitas estructura completamente diferente
- Patrones de diseño muy específicos

**Nota:** Aunque puedes usar solo algunos comandos de AvangCLI y adaptar

#### 3. Proyectos no-Next.js

- React puro con Vite
- Remix, Gatsby, u otros frameworks
- No se usa typescript

**Razón:** AvangCLI está optimizado específicamente para Next.js + Typescript

#### 4. Equipo con proceso de setup muy establecido

- Ya tienen scripts y herramientas propias
- Usan otra arquitectura (ej: clean architecture)
- Proceso de setup funciona perfectamente
- No necesitan cambiar su workflow

---

## Próximos Pasos

- [Instalación](../02-primeros-pasos/instalacion.md)
- [Comandos disponibles](../03-comandos/init.md)
- [Tutorial completo](../08-guias/proyecto-completo-paso-a-paso.md)
