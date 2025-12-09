Plan de Implementación: AvangCLI Backend - Comando init

1. ARQUITECTURA DEL PROYECTO CLI
Estructura de Directorios Propuesta
backend-cli/
├── src/
│   ├── avangcli/
│   │   ├── __init__.py
│   │   ├── cli.py                    # Entry point principal
│   │   ├── commands/
│   │   │   ├── __init__.py
│   │   │   └── init.py               # Comando init
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── validators.py         # Validaciones de dependencias
│   │   │   ├── config.py             # Configuraciones globales
│   │   │   └── exceptions.py         # Excepciones personalizadas
│   │   ├── ui/
│   │   │   ├── __init__.py
│   │   │   ├── prompts.py            # Lógica de preguntas interactivas
│   │   │   ├── messages.py           # Mensajes y textos de UI
│   │   │   └── widgets.py            # Widgets personalizados (Textual)
│   │   ├── generators/
│   │   │   ├── __init__.py
│   │   │   ├── project.py            # Generador principal de proyecto
│   │   │   ├── docker.py             # Generador de archivos Docker
│   │   │   ├── config_files.py       # Generador de configs (pyproject, etc)
│   │   │   └── makefile.py           # Generador de Makefile
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── project_config.py     # Modelo de configuración del proyecto
│   │   └── templates/
│   │       ├── project_structure/
│   │       │   ├── basic/            # Template básico sin DB
│   │       │   └── with_db/          # Template con DB
│   │       ├── docker/
│   │       │   ├── docker-compose.dev.yml.jinja
│   │       │   ├── docker-compose.prod.yml.jinja
│   │       │   └── Dockerfile.jinja
│   │       ├── config/
│   │       │   ├── pyproject.toml.jinja
│   │       │   ├── ruff.toml.jinja
│   │       │   └── .env.example.jinja
│   │       └── makefile/
│   │           └── Makefile.jinja
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── pyproject.toml
└── README.md
Patrones de Diseño a Implementar
Builder Pattern: Para construir la configuración del proyecto paso a paso
Strategy Pattern: Para diferentes estrategias de generación según selecciones
Template Method: Para el flujo común de generación con hooks personalizables
Factory Pattern: Para crear generadores específicos según configuración
2. FASES DE IMPLEMENTACIÓN
FASE 1: Configuración Base y Estructura del Proyecto ✅ COMPLETADA
Prioridad: Alta
Duración estimada: 1-2 días
Commit: c07e12b - chore(backend-cli): directory structure and basic CLI setup

Tareas:
✅ Crear estructura de directorios del proyecto CLI
✅ Configurar pyproject.toml con UV como gestor de paquetes
✅ Instalar y configurar dependencias: Typer (CLI framework), Textual (UI), Jinja2 (templates)
✅ Crear entry point principal en cli.py con Typer
✅ Implementar comando básico avangcli --version y avangcli --help
✅ Configurar sistema de logging para debugging

Entregables:
✅ Proyecto CLI funcional con estructura base
✅ Sistema de comandos configurado con Typer
✅ Documentación de arquitectura inicial (README.md)

Dependencias:
Ninguna (fase inicial)
FASE 2: Sistema de Validaciones y Utilidades Core
Prioridad: Alta
Duración estimada: 1 día Tareas:
 Implementar validador de dependencias del sistema en validators.py
Verificar si Poetry está instalado (poetry --version)
Verificar si UV está instalado (uv --version)
Verificar si Docker está instalado y corriendo (docker --version, docker ps)
Verificar si Git está instalado (git --version)
 Crear excepciones personalizadas en exceptions.py
DependencyNotFoundError
InvalidProjectNameError
ProjectAlreadyExistsError
 Implementar modelo ProjectConfig en models/project_config.py usando Pydantic
Atributos: name, package_manager, use_database, db_environments, linter_formatter, use_git, use_makefile
 Crear utilidades de validación de nombres de proyecto (formato válido Python)
Entregables:
Sistema de validaciones robusto
Modelo de configuración del proyecto
Excepciones tipadas y documentadas
Dependencias:
FASE 1 completada
FASE 3: Sistema de UI Interactiva
Prioridad: Alta
Duración estimada: 2-3 días Tareas:
 Implementar prompts interactivos en ui/prompts.py usando Textual
Prompt de texto para nombre del proyecto con validación en tiempo real
Prompt de selección única para package manager (Poetry/UV)
Prompt Yes/No para configuración de base de datos
Prompt de selección múltiple para entornos Docker (dev/prod/both/none)
Prompt de selección múltiple para linter/formatter (Ruff/Black/Flake8/None)
Prompt Yes/No para inicializar Git
Prompt Yes/No para generar Makefile
 Crear widgets personalizados si es necesario en ui/widgets.py
 Implementar mensajes estandarizados en ui/messages.py
Mensajes de éxito (con Rich)
Mensajes de error (con Rich)
Mensajes de advertencia
Mensajes informativos durante el proceso
 Implementar sistema de navegación entre preguntas (siguiente/anterior)
 Añadir resumen de configuración antes de generar proyecto
Entregables:
Sistema de prompts completamente funcional
UI consistente y profesional
Flujo de navegación intuitivo
Dependencias:
FASE 2 completada
FASE 4: Sistema de Templates
Prioridad: Alta
Duración estimada: 2-3 días Tareas:
 Crear template de estructura de proyecto FastAPI siguiendo Screaming Architecture
app/main.py - Entry point de FastAPI
app/core/ - Configuración, dependencias, seguridad
app/api/ - Endpoints organizados por dominio
app/domain/ - Modelos de dominio y lógica de negocio
app/infrastructure/ - Implementaciones de persistencia, servicios externos
app/tests/ - Tests organizados por capas
 Crear templates Jinja2 para archivos de configuración
pyproject.toml.jinja con secciones condicionales según package manager
ruff.toml.jinja o .black según selección
.env.example.jinja con variables según configuración
.gitignore estándar para Python/FastAPI
 Crear templates Docker
Dockerfile.jinja optimizado para FastAPI
docker-compose.dev.yml.jinja con servicios de DB condicionales
docker-compose.prod.yml.jinja con configuración de producción
 Crear template de Makefile con comandos dinámicos según configuración
Comandos de instalación según package manager
Comandos de linting según herramienta seleccionada
Comandos de Docker si aplica
Comandos de testing
 Implementar sistema de renderizado de templates con variables de contexto
Entregables:
Conjunto completo de templates Jinja2
Sistema de renderizado de templates
Templates probados con diferentes configuraciones
Dependencias:
FASE 2 completada
FASE 5: Generadores de Proyecto
Prioridad: Alta
Duración estimada: 2-3 días Tareas:
 Implementar ProjectGenerator en generators/project.py
Método para crear estructura de directorios
Método para copiar y renderizar templates
Método para ejecutar post-processing (git init, etc)
 Implementar DockerGenerator en generators/docker.py
Generar archivos Docker según configuración
Validar sintaxis de archivos generados
 Implementar ConfigFilesGenerator en generators/config_files.py
Generar pyproject.toml según package manager
Generar configuración de linters
Generar .env.example
 Implementar MakefileGenerator en generators/makefile.py
Generar comandos según herramientas seleccionadas
Validar sintaxis de Makefile
 Implementar orquestador de generadores que coordine la creación completa
Entregables:
Sistema de generadores modular y testeable
Proyectos generados correctamente según configuración
Validaciones de archivos generados
Dependencias:
FASE 4 completada
FASE 6: Integración del Comando Init
Prioridad: Alta
Duración estimada: 1-2 días Tareas:
 Implementar comando init en commands/init.py
Integrar flujo de prompts de FASE 3
Ejecutar validaciones de FASE 2
Invocar generadores de FASE 5
Manejar errores y mostrar mensajes apropiados
 Implementar validación pre-generación
Verificar que directorio no exista
Verificar dependencias necesarias instaladas
Confirmar con usuario antes de generar
 Implementar post-generación
Inicializar Git si seleccionado
Ejecutar poetry install o uv sync según selección
Mostrar mensaje de éxito con próximos pasos
 Añadir flag --dry-run para ver qué se generaría sin crear archivos
 Añadir opción de configuración desde archivo JSON/YAML para CI/CD
Entregables:
Comando avangcli init completamente funcional
Modo dry-run implementado
Soporte para configuración no interactiva
Dependencias:
FASE 3, 4, 5 completadas
FASE 7: Testing y Documentación
Prioridad: Media
Duración estimada: 2-3 días Tareas:
 Escribir tests unitarios para validadores
 Escribir tests unitarios para generadores
 Escribir tests de integración para flujo completo de init
 Crear fixtures de proyectos de ejemplo
 Documentar cada módulo con docstrings
 Crear README.md con guía de uso
 Crear CONTRIBUTING.md con guía de desarrollo
 Añadir ejemplos de uso en documentación
Entregables:
Cobertura de tests >80%
Documentación completa y clara
Ejemplos funcionales
Dependencias:
Todas las fases anteriores completadas
FASE 8: Pulido y Mejoras de UX
Prioridad: Media-Baja
Duración estimada: 1-2 días Tareas:
 Añadir barra de progreso durante generación de proyecto
 Mejorar mensajes de error con sugerencias de solución
 Añadir animaciones de carga para operaciones largas
 Implementar sistema de configuración global (~/.avangcli/config)
 Añadir comando para guardar templates personalizados
 Implementar telemetría opcional (con opt-in explícito)
 Añadir comando de actualización de templates
Entregables:
UX pulida y profesional
Sistema de configuración persistente
Capacidad de extensión con templates custom
Dependencias:
FASE 7 completada
3. ESTRUCTURA DE TEMPLATES
Template: Proyecto Básico (sin DB)
Ubicación: templates/project_structure/basic/ Estructura de directorios generada:
{project_name}/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── dependencies.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── health.py
│   └── domain/
│       └── __init__.py
├── tests/
│   ├── __init__.py
│   └── test_main.py
├── pyproject.toml
├── .env.example
├── .gitignore
├── README.md
└── Makefile (opcional)
Variables de template:
{{ project_name }}: Nombre del proyecto
{{ package_manager }}: "poetry" o "uv"
{{ python_version }}: "3.11" (por defecto, podría hacerse configurable)
{{ linters }}: Lista de linters seleccionados
{{ use_git }}: Boolean
{{ use_makefile }}: Boolean
Template: Proyecto con Base de Datos
Ubicación: templates/project_structure/with_db/ Estructura adicional:
{project_name}/
├── app/
│   ├── infrastructure/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   └── repositories/
│   │       └── __init__.py
│   └── domain/
│       ├── models/
│       │   └── __init__.py
│       └── repositories/
│           └── __init__.py
├── alembic/
│   ├── versions/
│   └── env.py
├── docker-compose.dev.yml (opcional)
├── docker-compose.prod.yml (opcional)
└── Dockerfile (opcional)
Variables adicionales:
{{ db_type }}: "postgresql" (por defecto, extensible a MySQL, etc)
{{ db_environments }}: ["dev", "prod"] o subset
{{ use_docker }}: Boolean derivado de db_environments
Template: pyproject.toml
Ubicación: templates/config/pyproject.toml.jinja Secciones condicionales:
[project]
name = "{{ project_name }}"
version = "0.1.0"
description = ""
requires-python = ">={{ python_version }}"

dependencies = [
    "fastapi>=0.104.0",
    "uvicorn[standard]>=0.24.0",
    {% if use_database %}
    "sqlalchemy>=2.0.0",
    "alembic>=1.12.0",
    "asyncpg>=0.29.0",  # Para PostgreSQL
    {% endif %}
    "pydantic>=2.4.0",
    "pydantic-settings>=2.0.0",
]

{% if package_manager == "uv" %}
[tool.uv]
dev-dependencies = [
    "pytest>=7.4.0",
    "httpx>=0.25.0",
    {% if "ruff" in linters %}
    "ruff>=0.1.0",
    {% endif %}
    {% if "black" in linters %}
    "black>=23.10.0",
    {% endif %}
]
{% endif %}

{% if package_manager == "poetry" %}
[tool.poetry.dependencies]
python = "^{{ python_version }}"

# ... dependencias listadas arriba

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"

# ... dev dependencies

{% endif %}

{% if "ruff" in linters %}
[tool.ruff]
line-length = 100
target-version = "py{{ python_version.replace('.', '') }}"
{% endif %}

{% if "black" in linters %}
[tool.black]
line-length = 100
target-version = ['py{{ python_version.replace('.', '') }}']
{% endif %}
Template: Makefile
Ubicación: templates/makefile/Makefile.jinja Comandos generados dinámicamente:
.PHONY: install dev test lint format clean

install:
{% if package_manager == "poetry" %}
 poetry install
{% elif package_manager == "uv" %}
 uv sync
{% endif %}

dev:
{% if use_database and "dev" in db_environments %}
 docker-compose -f docker-compose.dev.yml up -d
{% endif %}
{% if package_manager == "poetry" %}
 poetry run uvicorn app.main:app --reload
{% elif package_manager == "uv" %}
 uv run uvicorn app.main:app --reload
{% endif %}

test:
{% if package_manager == "poetry" %}
 poetry run pytest
{% elif package_manager == "uv" %}
 uv run pytest
{% endif %}

{% if "ruff" in linters %}
lint:
 ruff check .

format:
 ruff format .
{% elif "black" in linters %}
format:
 black .
{% endif %}

{% if use_database %}
db-migrate:
 alembic upgrade head

db-revision:
 alembic revision --autogenerate -m "$(msg)"
{% endif %}

clean:
 find . -type d -name __pycache__ -exec rm -rf {} +
 find . -type f -name "*.pyc" -delete
{% if use_database and "dev" in db_environments %}
 docker-compose -f docker-compose.dev.yml down -v
{% endif %}
Template: Docker Compose (Desarrollo)
Ubicación: templates/docker/docker-compose.dev.yml.jinja
version: '3.8'

services:
  {% if use_database %}
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: {{ project_name }}_user
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: {{ project_name }}_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  {% endif %}
  api:
    build:
      context: .
      dockerfile: Dockerfile
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    {% if use_database %}
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://{{ project_name }}_user:dev_password@db:5432/{{ project_name }}_db
    {% endif %}

{% if use_database %}
volumes:
  postgres_data:
{% endif %}
4. FLUJO DE INTERACCIÓN CON USUARIO
Diagrama de Flujo
┌─────────────────────────────────────────┐
│  avangcli init                          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Bienvenida + Banner ASCII              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Pregunta 1: Nombre del Proyecto        │
│  - Validación: Formato Python válido    │
│  - Validación: Directorio no existe     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Pregunta 2: Package Manager            │
│  ○ UV (recomendado)                     │
│  ○ Poetry                               │
│  → Validar instalación                  │
│  → Si no está: Error + instrucciones    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Pregunta 3: ¿Configurar DB?            │
│  ○ Sí  ○ No                             │
└──────────────┬──────────────────────────┘
               │
               ├─── No ────────────────────┐
               │                           │
               └─── Sí ───┐                │
                          ▼                │
            ┌──────────────────────┐       │
            │  Pregunta 3a:        │       │
            │  Entornos Docker:    │       │
            │  ☑ Desarrollo        │       │
            │  ☑ Producción        │       │
            │  ☐ Ninguno           │       │
            │  → Validar Docker    │       │
            └──────────┬───────────┘       │
                       │                   │
                       └───────────────────┤
                                           │
               ┌───────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Pregunta 4: Linter/Formatter           │
│  ☑ Ruff (recomendado)                   │
│  ☐ Black                                │
│  ☐ Flake8                               │
│  ☐ Ninguno                              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Pregunta 5: ¿Inicializar Git?          │
│  ○ Sí  ○ No                             │
│  → Validar Git instalado                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Pregunta 6: ¿Generar Makefile?         │
│  ○ Sí  ○ No                             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Resumen de Configuración               │
│  ┌───────────────────────────────────┐  │
│  │ Proyecto: my_api                  │  │
│  │ Package Manager: UV               │  │
│  │ Base de Datos: Sí (Dev + Prod)    │  │
│  │ Linter: Ruff                      │  │
│  │ Git: Sí                           │  │
│  │ Makefile: Sí                      │  │
│  └───────────────────────────────────┘  │
│  ¿Continuar? [S/n]                      │
└──────────────┬──────────────────────────┘
               │
               ├─── No ─→ Cancelar
               │
               └─── Sí ───┐
                          ▼
            ┌──────────────────────┐
            │  Generación Proyecto │
            │  [Barra de progreso] │
            │  ✓ Estructura        │
            │  ✓ Templates         │
            │  ✓ Configuración     │
            │  ✓ Git init          │
            │  ✓ Instalación deps  │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  ¡Éxito! 🎉          │
            │  Próximos pasos:     │
            │  1. cd my_api        │
            │  2. make dev         │
            │  3. ...              │
            └──────────────────────┘
Validaciones por Paso
Paso 1 - Nombre del Proyecto:
Formato válido Python (snake_case preferido)
No contiene caracteres especiales excepto_
No es una palabra reservada de Python
El directorio no existe ya
No está vacío
Paso 2 - Package Manager:
Si selecciona UV: ejecutar uv --version
Si selecciona Poetry: ejecutar poetry --version
Si falla: mostrar error con instrucciones de instalación
Permitir continuar sin instalación (modo dry-run)
Paso 3 - Base de Datos:
Si selecciona "Sí" y luego selecciona entornos Docker:
Validar docker --version
Validar docker ps (daemon corriendo)
Si falla: advertir pero permitir continuar (generará archivos Docker)
Paso 4 - Linters:
Selección múltiple permitida
Si selecciona Ruff + Black: advertir sobre posible conflicto
Permitir "Ninguno"
Paso 5 - Git:
Si selecciona "Sí": validar git --version
Si falla: advertir pero permitir continuar
Paso 6 - Makefile:
Sin validaciones especiales
Contenido depende de selecciones anteriores
Manejo de Errores
Errores Recuperables (advertencias):
Docker no instalado pero se seleccionó DB → Generar archivos, advertir instalación
Git no instalado pero se seleccionó inicializar → Generar .gitignore, advertir
Errores Fatales (bloquean generación):
Nombre de proyecto inválido
Directorio ya existe
Package manager seleccionado no instalado (sin modo dry-run)
Error al crear directorio (permisos)
Error al escribir archivos
Mensajes de Error - Ejemplos:
❌ Error: El directorio 'my_api' ya existe
💡 Sugerencia: Usa otro nombre o elimina el directorio existente

⚠️  Advertencia: Docker no está instalado
📋 Se generarán los archivos Docker pero no podrás ejecutarlos
   Instala Docker: <https://docs.docker.com/get-docker/>
5. CONSIDERACIONES TÉCNICAS
Decisiones Arquitectónicas Clave
CLI Framework: Typer
Razón: Built on Click, type hints nativos, auto-documentación
Alternativa considerada: Click (más bajo nivel), Argparse (menos features)
UI Framework: Textual (con Rich integrado)
Razón: Textual incluye Rich, permite UIs más complejas futuras (TUI)
Rich solo para formateo de mensajes y tablas
Alternativa: inquirer/questionary (menos potente para futuro)
Templates: Jinja2
Razón: Estándar de facto, sintaxis poderosa, bien documentado
Alternativa: Mako, Chevron (menos conocidos)
Validación: Pydantic
Razón: Validación robusta, type hints, integración FastAPI
Para modelo ProjectConfig y validación de inputs
Testing: Pytest
Con pytest-mock para mocking de filesystem
pytest-cov para cobertura
Librerías Específicas de Textual/Rich
De Textual:
textual.widgets.Input: Para input de texto (nombre proyecto)
textual.widgets.Select: Para selección única (package manager)
textual.widgets.Checkbox: Para selección múltiple (linters, entornos)
textual.widgets.Button: Para confirmación
textual.app.App: Para flujo de aplicación
De Rich (integrado en Textual):
rich.console.Console: Para output colorido
rich.progress.Progress: Para barra de progreso
rich.panel.Panel: Para resumen de configuración
rich.table.Table: Para mostrar opciones
rich.markdown.Markdown: Para formatear mensajes
Estrategias de Testing
Tests Unitarios:

# tests/unit/test_validators.py

def test_validate_project_name_valid():
    assert validate_project_name("my_project") == True

def test_validate_project_name_invalid_characters():
    with pytest.raises(InvalidProjectNameError):
        validate_project_name("my-project")

# tests/unit/test_generators.py

def test_project_generator_creates_structure(tmp_path):
    config = ProjectConfig(name="test_project", ...)
    generator = ProjectGenerator(config)
    generator.generate(tmp_path)

    assert (tmp_path / "test_project" / "app" / "main.py").exists()
Tests de Integración:

# tests/integration/test_init_command.py

def test_init_command_full_flow(tmp_path, monkeypatch):
    # Mock de prompts para simular inputs usuario
    # Verificar proyecto completo generado correctamente
    pass
Tests de Templates:

# tests/test_templates.py

def test_pyproject_template_poetry():
    context = {"package_manager": "poetry", ...}
    rendered = render_template("pyproject.toml.jinja", context)

    assert "[tool.poetry]" in rendered
    assert "[tool.uv]" not in rendered
Gestión de Dependencias del Sistema
Estrategia de Verificación:

# core/validators.py

class DependencyValidator:
    @staticmethod
    def check_command(command: str, args: list[str] = ["--version"]) -> bool:
        """Verifica si un comando está disponible en el sistema"""
        try:
            result = subprocess.run(
                [command, *args],
                capture_output=True,
                text=True,
                timeout=5
            )
            return result.returncode == 0
        except (subprocess.TimeoutExpired, FileNotFoundError):
            return False

    def validate_package_manager(self, manager: str) -> None:
        if not self.check_command(manager):
            raise DependencyNotFoundError(
                f"{manager} no está instalado",
                suggestion=f"Instala {manager}: [link a docs]"
            )
6. PRÓXIMOS PASOS Y AJUSTES NECESARIOS
Puntos que Requieren Clarificación
Versión de Python por defecto
¿Fijar en 3.11+ o preguntar al usuario?
Sugerencia: Fijar en 3.11 inicialmente, hacer configurable en v2
Base de datos por defecto
¿Solo PostgreSQL o soportar MySQL/SQLite desde inicio?
Sugerencia: Solo PostgreSQL en v1, extensible después
Estructura de Screaming Architecture
¿Incluir carpetas use_cases o simplificar?
Sugerencia: Revisar documentación oficial de FastAPI para confirmar estructura exacta
Autenticación/Autorización
¿Incluir template con auth básico (JWT)?
Sugerencia: FASE 9 futura - avangcli add auth
Testing frameworks adicionales
¿Soportar unittest además de pytest?
Sugerencia: Solo pytest en v1
Decisiones Pendientes
Nombrado del proyecto generado
¿Usar snake_case forzosamente o permitir kebab-case?
Decisión recomendada: Forzar snake_case, convertir automáticamente
Manejo de conflictos en generación
¿Qué hacer si el directorio existe pero está vacío?
Decisión recomendada: Permitir con flag --force, preguntar por defecto
Configuración de pre-commit hooks
¿Incluir pre-commit con hooks automáticos?
Decisión recomendada: Sí, configurar según linters seleccionados
Soporte para monorepo
¿Permitir generar proyecto dentro de monorepo existente?
Decisión recomendada: FASE futura, no en v1
Internacionalización
¿Soportar mensajes en español e inglés?
Decisión recomendada: Inglés por defecto, español en v2 si hay demanda
Sugerencias de Mejora
Comando complementario: avangcli add
avangcli add auth - Añadir autenticación a proyecto existente
avangcli add crud <model> - Generar CRUD para un modelo
Prioridad: Post-v1
Templates de ejemplo
Incluir carpeta examples/ con proyectos de ejemplo generados
Útil para testing y documentación
Validación de estructura post-generación
Comando avangcli check que valide que el proyecto sigue estructura correcta
Útil después de modificaciones manuales
Integración con IDE
Generar .vscode/settings.json con configuración de linters
Generar configuración para PyCharm
Sistema de plugins
Permitir templates de terceros
Formato: avangcli init --template @user/template-name
Prioridad: v2 o v3
Telemetría y analytics
Recopilar estadísticas de uso (opt-in)
Entender qué configuraciones son más populares
Requiere consideraciones de privacidad
Riesgos Identificados
Complejidad de Textual
Riesgo: Curva de aprendizaje alta
Mitigación: Empezar con ejemplos simples, documentación oficial
Mantenimiento de templates
Riesgo: Templates desactualizados con nuevas versiones de FastAPI
Mitigación: Tests de integración que generen y corran proyectos
Compatibilidad entre package managers
Riesgo: Diferencias sutiles entre Poetry y UV
Mitigación: Tests específicos para cada manager
Experiencia en Windows
Riesgo: Comandos shell específicos de Unix
Mitigación: Usar pathlib en lugar de rutas hardcodeadas, probar en WSL
Timeline Estimado Total
FASE 1-6 (Core functionality): 10-15 días
FASE 7 (Testing): 2-3 días
FASE 8 (Polish): 1-2 días
Total MVP: 13-20 días de desarrollo
Métricas de Éxito
Proyecto generado compila sin errores
Tests del proyecto generado pasan
Docker compose levanta correctamente (si aplica)
Comandos de Makefile funcionan
Linters configurados corren sin errores
Tiempo de generación < 30 segundos (sin instalación de deps)
UX intuitiva (feedback de usuarios beta)
