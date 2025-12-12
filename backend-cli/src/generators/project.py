"""Project generation logic for AvangCLI Backend."""

from pathlib import Path

from jinja2 import Environment, FileSystemLoader

from ..core.config import PROJECT_TEMPLATES_DIR
from ..models.project_config import ProjectConfig


class ProjectGenerator:
    """Generates complete FastAPI project structure."""

    def __init__(self, config: ProjectConfig, project_dir: Path):
        """
        Initialize project generator.

        Args:
            config: Project configuration
            project_dir: Target project directory
        """
        self.config = config
        self.project_dir = project_dir

        # Set up Jinja2 environment
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(PROJECT_TEMPLATES_DIR)),
            trim_blocks=True,
            lstrip_blocks=True,
        )

    def _create_directory_structure(self) -> None:
        """Create the basic directory structure."""
        directories = [
            self.project_dir / "app",
            self.project_dir / "app" / "routers",
            self.project_dir / "tests",
        ]

        # Add database-related directories if using database
        if self.config.use_database:
            directories.extend(
                [
                    self.project_dir / "app" / "models",
                    self.project_dir / "app" / "schemas",
                    self.project_dir / "app" / "crud",
                    self.project_dir / "alembic",
                    self.project_dir / "alembic" / "versions",
                ]
            )

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
            "basic/main.py.jinja",
            context,
        )
        self._write_file(self.project_dir / "app" / "main.py", main_content)

        # Configuration
        config_content = self._render_template(
            "basic/config.py.jinja",
            context,
        )
        self._write_file(self.project_dir / "app" / "config.py", config_content)

        # Dependencies
        deps_content = self._render_template(
            "basic/dependencies.py.jinja",
            context,
        )
        self._write_file(
            self.project_dir / "app" / "dependencies.py",
            deps_content,
        )

        # Health check route
        health_content = self._render_template(
            "basic/routers/health.py.jinja",
            context,
        )
        self._write_file(
            self.project_dir / "app" / "routers" / "health.py",
            health_content,
        )

        # Development server script
        run_content = self._render_template(
            "basic/run.py.jinja",
            context,
        )
        self._write_file(self.project_dir / "run.py", run_content)
        self._write_file(self.project_dir / "app" / "main.py", main_content)

        # Development server script
        run_content = self._render_template(
            "basic/run.py.jinja",
            context,
        )
        self._write_file(self.project_dir / "run.py", run_content)

        # Configuration
        config_content = self._render_template(
            "basic/config.py.jinja",
            context,
        )
        self._write_file(self.project_dir / "app" / "config.py", config_content)

        # Dependencies
        deps_content = self._render_template(
            "basic/dependencies.py.jinja",
            context,
        )
        self._write_file(
            self.project_dir / "app" / "dependencies.py",
            deps_content,
        )

        # Health check route
        health_content = self._render_template(
            "basic/routers/health.py.jinja",
            context,
        )
        self._write_file(
            self.project_dir / "app" / "routers" / "health.py",
            health_content,
        )

        # Database configuration if needed
        if self.config.use_database:
            db_content = self._render_template(
                "with_db/database.py.jinja",
                context,
            )
            self._write_file(
                self.project_dir / "app" / "database.py",
                db_content,
            )
            self._write_file(
                self.project_dir / "app" / "database.py",
                db_content,
            )

    def _generate_init_files(self) -> None:
        """Generate __init__.py files for all packages."""
        # Special case for app/__init__.py
        app_init_content = "from .main import app\n"
        self._write_file(self.project_dir / "app" / "__init__.py", app_init_content)

        # Other init files
        init_files = [
            self.project_dir / "app" / "routers" / "__init__.py",
            self.project_dir / "tests" / "__init__.py",
        ]

        if self.config.use_database:
            init_files.extend(
                [
                    self.project_dir / "app" / "models" / "__init__.py",
                    self.project_dir / "app" / "schemas" / "__init__.py",
                    self.project_dir / "app" / "crud" / "__init__.py",
                ]
            )

        for init_file in init_files:
            init_file.touch()

    def _generate_test_files(self, context: dict) -> None:
        """Generate basic test files."""
        test_main_content = '''"""Tests for main application."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


def test_root():
    """Test root endpoint."""
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health():
    """Test health endpoint."""
    client = TestClient(app)
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
'''
        self._write_file(self.project_dir / "tests" / "test_main.py", test_main_content)
