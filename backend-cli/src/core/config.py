"""Global configuration for AvangCLI Backend."""

from pathlib import Path

# CLI version
VERSION = "0.1.0"

# Template paths
TEMPLATES_DIR = Path(__file__).parent.parent / "templates"
PROJECT_TEMPLATES_DIR = TEMPLATES_DIR / "project_structure"
DOCKER_TEMPLATES_DIR = TEMPLATES_DIR / "docker"
CONFIG_TEMPLATES_DIR = TEMPLATES_DIR / "config"
MAKEFILE_TEMPLATES_DIR = TEMPLATES_DIR / "makefile"
MODULE_TEMPLATES_DIR = TEMPLATES_DIR / "modules"

# Default values
DEFAULT_PYTHON_VERSION = "3.11"
DEFAULT_PACKAGE_MANAGER = "uv"

# FastAPI dependencies versions
FASTAPI_VERSION = ">=0.104.0"
UVICORN_VERSION = ">=0.24.0"
PYDANTIC_VERSION = ">=2.4.0"
PYDANTIC_SETTINGS_VERSION = ">=2.0.0"

# Database dependencies versions
SQLALCHEMY_VERSION = ">=2.0.0"
ALEMBIC_VERSION = ">=1.12.0"
ASYNCPG_VERSION = ">=0.29.0"

# Dev dependencies versions
PYTEST_VERSION = ">=7.4.0"
HTTPX_VERSION = ">=0.25.0"
RUFF_VERSION = ">=0.1.0"
BLACK_VERSION = ">=23.10.0"
FLAKE8_VERSION = ">=6.0.0"

# Database defaults
DEFAULT_DB_TYPE = "postgresql"
DEFAULT_DB_PORT = 5432
