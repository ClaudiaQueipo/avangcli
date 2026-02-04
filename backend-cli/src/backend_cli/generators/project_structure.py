from pathlib import Path

from backend_cli.core.config import ProjectConfig
from backend_cli.generators.base import BaseGenerator


class ProjectStructureGenerator(BaseGenerator):
    PROJECT_TEMPLATES = [
        ("project/pyproject.toml.j2", "pyproject.toml"),
        ("project/README.md.j2", "README.md"),
        ("project/.env.example.j2", ".env.example"),
        ("project/.gitignore.j2", ".gitignore"),
    ]

    LAYER_FILES = [
        ("clean_architecture/settings.py.j2", "settings.py"),
        ("clean_architecture/domain/__init__.py.j2", "domain/__init__.py"),
        ("clean_architecture/domain/entities.py.j2", "domain/entities.py"),
        ("clean_architecture/domain/repositories.py.j2", "domain/repositories.py"),
        ("clean_architecture/domain/exceptions.py.j2", "domain/exceptions.py"),
        ("clean_architecture/application/__init__.py.j2", "application/__init__.py"),
        ("clean_architecture/application/use_cases.py.j2", "application/use_cases.py"),
        ("clean_architecture/application/dtos.py.j2", "application/dtos.py"),
        ("clean_architecture/infrastructure/__init__.py.j2", "infrastructure/__init__.py"),
        ("clean_architecture/infrastructure/orm.py.j2", "infrastructure/orm.py"),
        ("clean_architecture/infrastructure/database.py.j2", "infrastructure/database.py"),
        ("clean_architecture/infrastructure/repositories.py.j2", "infrastructure/repositories.py"),
        ("clean_architecture/api/__init__.py.j2", "api/__init__.py"),
        ("clean_architecture/api/main.py.j2", "api/main.py"),
        ("clean_architecture/api/dependencies.py.j2", "api/dependencies.py"),
        ("clean_architecture/api/schemas.py.j2", "api/schemas.py"),
        ("clean_architecture/api/routes/__init__.py.j2", "api/routes/__init__.py"),
        ("clean_architecture/api/routes/health.py.j2", "api/routes/health.py"),
    ]

    TEST_FILES = [
        ("clean_architecture/tests/conftest.py.j2", "conftest.py"),
    ]

    def generate(self, config: ProjectConfig) -> None:
        with self._ui.spinner("Creating project structure..."):
            self._create_project_directories(config)
            self._generate_project_files(config)
            self._generate_layer_files(config)
            self._generate_test_files(config)
            self._create_init_files(config)

        self._ui.show_success("Project structure created")

    def _create_project_directories(self, config: ProjectConfig) -> None:
        self._create_directory(config.project_path)
        self._create_directory(config.src_path)
        self._create_directory(config.src_path / "domain")
        self._create_directory(config.src_path / "application")
        self._create_directory(config.src_path / "infrastructure")
        self._create_directory(config.src_path / "api" / "routes")
        self._create_directory(config.project_path / "tests")

    def _generate_project_files(self, config: ProjectConfig) -> None:
        for template_path, output_file in self.PROJECT_TEMPLATES:
            output_path = config.project_path / output_file
            self._render_template(template_path, output_path, config)

    def _generate_layer_files(self, config: ProjectConfig) -> None:
        for template_path, output_file in self.LAYER_FILES:
            output_path = config.src_path / output_file
            self._render_template(template_path, output_path, config)

    def _generate_test_files(self, config: ProjectConfig) -> None:
        for template_path, output_file in self.TEST_FILES:
            output_path = config.project_path / "tests" / output_file
            self._render_template(template_path, output_path, config)

    def _create_init_files(self, config: ProjectConfig) -> None:
        init_path = config.src_path / "__init__.py"
        init_path.write_text("")
