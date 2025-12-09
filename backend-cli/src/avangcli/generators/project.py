"""Main project generator for FastAPI projects."""

import shutil
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, Template

from avangcli.core.config import TEMPLATES_DIR
from avangcli.models.project_config import ProjectConfig


class ProjectGenerator:
    """Generates the main FastAPI project structure."""

    def __init__(self, config: ProjectConfig, output_dir: Path):
        """
        Initialize project generator.

        Args:
            config: Project configuration
            output_dir: Directory where project will be created
        """
        self.config = config
        self.output_dir = output_dir
        self.project_dir = output_dir / config.name

        # Set up Jinja2 environment
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(TEMPLATES_DIR)),
            trim_blocks=True,
            lstrip_blocks=True,
        )

    def _create_directory_structure(self) -> None:
        """Create the basic directory structure."""
        directories = [
            self.project_dir,
            self.project_dir / "app",
            self.project_dir / "app" / "core",
            self.project_dir / "app" / "api",
            self.project_dir / "app" / "api" / "routes",
            self.project_dir / "app" / "domain",
            self.project_dir / "tests",
        ]

        # Add infrastructure directory if using database
        if self.config.use_database:
            directories.extend([
                self.project_dir / "app" / "infrastructure",
                self.project_dir / "alembic",
                self.project_dir / "alembic" / "versions",
            ])

        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)

    def _render_template(self, template_path: str, context: dict) -> str:
        """
        Render a Jinja2 template.

        Args:
            template_path: Path to template relative to templates directory
            context: Context dictionary for template

        Returns:
            Rendered template content
        """
        template = self.jinja_env.get_template(template_path)
        return template.render(**context)

    def _write_file(self, file_path: Path, content: str) -> None:
        """
        Write content to a file.

        Args:
            file_path: Path to file
            content: Content to write
        """
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content)

    def generate(self) -> None:
        """Generate the complete project structure."""
        # Create directory structure
        self._create_directory_structure()

        # Get template context
        context = self.config.model_dump_template_context()

        # Generate main application files
        self._generate_app_files(context)

        # Generate __init__.py files
        self._generate_init_files()

        # Generate test files
        self._generate_test_files(context)

    def _generate_app_files(self, context: dict) -> None:
        """Generate main application Python files."""
        # Main entry point
        main_content = self._render_template(
            "project_structure/basic/main.py.jinja",
            context,
        )
        self._write_file(self.project_dir / "app" / "main.py", main_content)

        # Core configuration
        config_content = self._render_template(
            "project_structure/basic/core_config.py.jinja",
            context,
        )
        self._write_file(self.project_dir / "app" / "core" / "config.py", config_content)

        # Core dependencies
        deps_content = self._render_template(
            "project_structure/basic/core_dependencies.py.jinja",
            context,
        )
        self._write_file(
            self.project_dir / "app" / "core" / "dependencies.py",
            deps_content,
        )

        # Health check route
        health_content = self._render_template(
            "project_structure/basic/health_route.py.jinja",
            context,
        )
        self._write_file(
            self.project_dir / "app" / "api" / "routes" / "health.py",
            health_content,
        )

        # Database configuration if needed
        if self.config.use_database:
            db_content = self._render_template(
                "project_structure/with_db/database.py.jinja",
                context,
            )
            self._write_file(
                self.project_dir / "app" / "infrastructure" / "database.py",
                db_content,
            )

    def _generate_init_files(self) -> None:
        """Generate __init__.py files for all packages."""
        init_files = [
            self.project_dir / "app" / "__init__.py",
            self.project_dir / "app" / "core" / "__init__.py",
            self.project_dir / "app" / "api" / "__init__.py",
            self.project_dir / "app" / "api" / "routes" / "__init__.py",
            self.project_dir / "app" / "domain" / "__init__.py",
            self.project_dir / "tests" / "__init__.py",
        ]

        if self.config.use_database:
            init_files.append(
                self.project_dir / "app" / "infrastructure" / "__init__.py"
            )

        for init_file in init_files:
            init_file.touch()

    def _generate_test_files(self, context: dict) -> None:
        """Generate basic test files."""
        test_main_content = '''"""Tests for main application."""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health():
    """Test health endpoint."""
    response = client.get(f"{app.url_path_for('health_check')}")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
'''
        self._write_file(
            self.project_dir / "tests" / "test_main.py",
            test_main_content,
        )
