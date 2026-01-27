# Backend CLI para FastAPI con Clean Architecture

## Resumen

CLI en Python para generar proyectos FastAPI con:

- Clean Architecture (Domain, Application, Infrastructure, API)
- SQLAlchemy + Alembic para migraciones
- Soporte para PostgreSQL, MySQL y SQL Server
- Docker (dev/prod)
- Ruff + isort + pre-commit
- UV como package manager

## Stack Tecnológico

| Componente      | Tecnología            | Razón                                                      |
| --------------- | --------------------- | ---------------------------------------------------------- |
| CLI Framework   | **Typer**             | Mismo autor que FastAPI, usa type hints, menos boilerplate |
| Prompts UI      | **InquirerPy + Rich** | Equivalente Python de @clack/prompts                       |
| Templates       | **Jinja2**            | Estándar en Python, soporte condicional                    |
| Package Manager | **UV**                | Rápido, moderno, requerido en BACKEND.md                   |

## Decisiones de Diseño

- **Async por defecto**: Los proyectos generados usarán drivers async (asyncpg, aiomysql, aioodbc)
- **Solo comando init**: El CLI se enfocará únicamente en el comando `init`
- **Naming snake_case**: Los nombres de proyecto se convertirán a snake_case para los paquetes Python (ej: `my-project` → `my_project`)
- **POO y Patrones**: Usar programación orientada a objetos con patrones de diseño (Factory, Strategy, Template Method)
- **Sin comentarios**: No escribir comentarios en el código

## Estructura del CLI

```text
backend-cli/
├── pyproject.toml
├── src/backend_cli/
│   ├── __init__.py
│   ├── main.py                 # Entry point Typer
│   ├── commands/
│   │   └── init.py             # Comando init
│   ├── core/
│   │   ├── config.py           # Configuración
│   │   ├── template_engine.py  # Wrapper Jinja2
│   │   └── command_executor.py # Ejecutor de shell
│   ├── prompts/
│   │   ├── ui.py               # Utilidades Rich
│   │   └── init_prompts.py     # Prompts del init
│   ├── generators/
│   │   ├── base.py             # Generador abstracto
│   │   ├── project_structure.py
│   │   ├── database_setup.py
│   │   ├── docker_setup.py
│   │   ├── linter_setup.py
│   │   ├── precommit_setup.py
│   │   └── alembic_setup.py
│   └── templates/              # Templates Jinja2
│       ├── project/
│       ├── clean_architecture/
│       ├── database/{postgres,mysql,sqlserver}/
│       ├── docker/
│       ├── alembic/
│       ├── linting/
│       └── precommit/
```

## Fases de Implementación

### Fase 1: Fundación del Proyecto (3 commits)

**1.1** `feat(backend-cli): initialize uv project structure`

- Crear `pyproject.toml` con dependencias (typer, rich, inquirerpy, jinja2, pydantic)
- Crear `src/backend_cli/__init__.py`
- Crear `src/backend_cli/main.py` con app Typer básica

**1.2** `feat(backend-cli): add core infrastructure classes`

- `core/config.py` - Configuración con Pydantic
- `core/template_engine.py` - Wrapper Jinja2
- `core/command_executor.py` - Ejecución de comandos shell

**1.3** `feat(backend-cli): add interactive prompts with InquirerPy and Rich`

- `prompts/ui.py` - Utilidades Rich (spinners, panels)
- `prompts/init_prompts.py` - Prompts para el comando init

### Fase 2: Templates Clean Architecture (3 commits)

**2.1** `feat(backend-cli): add base project templates`

- `templates/project/pyproject.toml.j2`
- `templates/project/README.md.j2`
- `templates/project/.env.example.j2`
- `templates/project/.gitignore.j2`

**2.2** `feat(backend-cli): add clean architecture layer templates`

- Domain: entities, repositories (Protocol), exceptions
- Application: use_cases, dtos
- Infrastructure: orm (SQLAlchemy base, session), repositories impl
- API: main.py, routes/health.py, schemas, dependencies

**2.3** `feat(backend-cli): add project structure generator`

- `generators/base.py` - Clase abstracta con spinner y logging
- `generators/project_structure.py` - Genera estructura de carpetas

### Fase 3: Setup de Base de Datos (3 commits)

**3.1** `feat(backend-cli): add PostgreSQL database templates`

- `templates/database/postgres/session.py.j2` (asyncpg)
- `templates/database/postgres/docker-compose.db.yml.j2`

**3.2** `feat(backend-cli): add MySQL database templates`

- `templates/database/mysql/session.py.j2` (aiomysql)
- `templates/database/mysql/docker-compose.db.yml.j2`

**3.3** `feat(backend-cli): add SQL Server templates and database setup generator`

- `templates/database/sqlserver/session.py.j2` (aioodbc)
- `templates/database/sqlserver/docker-compose.db.yml.j2`
- `generators/database_setup.py`

### Fase 4: Docker Setup (2 commits)

**4.1** `feat(backend-cli): add Docker templates for FastAPI with UV`

- `templates/docker/Dockerfile.dev.j2`
- `templates/docker/Dockerfile.prod.j2` (multi-stage)
- `templates/docker/docker-compose.dev.yml.j2`
- `templates/docker/docker-compose.prod.yml.j2`
- `templates/docker/.dockerignore.j2`

**4.2** `feat(backend-cli): add Docker setup generator`

- `generators/docker_setup.py`

### Fase 5: Alembic Migrations (2 commits)

**5.1** `feat(backend-cli): add Alembic migration templates`

- `templates/alembic/alembic.ini.j2`
- `templates/alembic/env.py.j2` (async support)
- `templates/alembic/script.py.mako.j2`

**5.2** `feat(backend-cli): add Alembic setup generator`

- `generators/alembic_setup.py`

### Fase 6: Linting y Pre-commit (3 commits)

**6.1** `feat(backend-cli): add Ruff linting and formatting templates`

- `templates/linting/ruff.toml.j2` (incluye isort via Ruff)
- `templates/linting/.editorconfig.j2`

**6.2** `feat(backend-cli): add pre-commit hook templates`

- `templates/precommit/.pre-commit-config.yaml.j2`

**6.3** `feat(backend-cli): add linting and pre-commit setup generators`

- `generators/linter_setup.py`
- `generators/precommit_setup.py`

### Fase 7: Integración del Comando Init (2 commits)

**7.1** `feat(backend-cli): implement init command with all generators`

- `commands/init.py` - Orquesta todos los generadores
- Maneja argumentos CLI y prompts interactivos

**7.2** `feat(backend-cli): wire up main CLI with init command`

- Actualizar `main.py` con comando init
- Agregar comando version
- Personalizar ayuda

### Fase 8: Integración con Master CLI (2 commits)

**8.1** `feat(avangcli): update master CLI to spawn backend-cli`

- Actualizar `bin/avangcli` para comando backend
- Pasar argumentos al CLI Python

**8.2** `feat(avangcli): add backend-cli installation scripts`

- Agregar script `install:backend` con UV
- Actualizar `dev:backend` script

## Archivos Críticos a Modificar/Crear

| Archivo                                         | Acción    |
| ----------------------------------------------- | --------- |
| `backend-cli/pyproject.toml`                    | Crear     |
| `backend-cli/src/backend_cli/main.py`           | Crear     |
| `backend-cli/src/backend_cli/commands/init.py`  | Crear     |
| `backend-cli/src/backend_cli/generators/*.py`   | Crear     |
| `backend-cli/src/backend_cli/templates/**/*.j2` | Crear     |
| `bin/avangcli`                                  | Modificar |
| `package.json`                                  | Modificar |

## Configuración de Base de Datos

| DB         | Driver Async | Connection String       | Docker Image                                 |
| ---------- | ------------ | ----------------------- | -------------------------------------------- |
| PostgreSQL | asyncpg      | `postgresql+asyncpg://` | `postgres:16-alpine`                         |
| MySQL      | aiomysql     | `mysql+aiomysql://`     | `mysql:8.0`                                  |
| SQL Server | aioodbc      | `mssql+aioodbc://`      | `mcr.microsoft.com/mssql/server:2022-latest` |

## Verificación

Para probar los cambios end-to-end:

```bash
# 1. Instalar dependencias del CLI
cd backend-cli && uv sync

# 2. Probar comando init
uv run avangcli-backend init test-project --db postgres --docker both

# 3. Verificar estructura generada
ls -la test-project/

# 4. Probar que el proyecto generado funciona
cd test-project
uv sync
uv run uvicorn app.api.main:app --reload

# 5. Probar desde master CLI
cd ../..
node bin/avangcli backend init otro-proyecto
```

## Notas

- Hacer un commit por cada fase usando conventional commits ej: `feat(scope): message`
- No escribir comentarios en el código
- Las cosas que vayan a quedar pendientes se le pone el `TODO: thing TO DO`
- Preguntar por cada mensaje de commit antes de hacerlo

## Total: 20 commits organizados en 8 fases
