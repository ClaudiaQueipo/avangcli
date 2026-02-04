# Avangcli Backend

CLI for scaffolding FastAPI projects with clean architecture.

## Installation

```bash
uv sync
```

## Usage

```bash
uv run avangcli-backend init [PROJECT_NAME]
```

## Features

- Clean Architecture (Domain, Application, Infrastructure, API)
- SQLAlchemy + Alembic migrations
- PostgreSQL, MySQL, and SQL Server support
- Docker configuration (dev/prod)
- Linting with Ruff
- Pre-commit hooks
