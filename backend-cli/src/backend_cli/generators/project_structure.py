from pathlib import Path

from backend_cli.core.config import ProjectConfig
from backend_cli.generators.base import BaseGenerator


class ProjectStructureGenerator(BaseGenerator):
    CLEAN_ARCH_LAYERS = [
        "domain/entities",
        "domain/repositories",
        "domain/exceptions",
        "application/use_cases",
        "application/dtos",
        "infrastructure/orm",
        "infrastructure/repositories",
        "api/routes",
        "api/schemas",
        "api/dependencies",
    ]

    CLEAN_ARCH_TEMPLATES = [
        ("domain/__init__.py.j2", "domain/__init__.py"),
        ("domain/entities/__init__.py.j2", "domain/entities/__init__.py"),
        ("domain/entities/base.py.j2", "domain/entities/base.py"),
        ("domain/repositories/__init__.py.j2", "domain/repositories/__init__.py"),
        ("domain/repositories/base.py.j2", "domain/repositories/base.py"),
        ("domain/exceptions/__init__.py.j2", "domain/exceptions/__init__.py"),
        ("domain/exceptions/base.py.j2", "domain/exceptions/base.py"),
        ("application/__init__.py.j2", "application/__init__.py"),
        ("application/use_cases/__init__.py.j2", "application/use_cases/__init__.py"),
        ("application/use_cases/base.py.j2", "application/use_cases/base.py"),
        ("application/dtos/__init__.py.j2", "application/dtos/__init__.py"),
        ("application/dtos/base.py.j2", "application/dtos/base.py"),
        ("infrastructure/__init__.py.j2", "infrastructure/__init__.py"),
        ("infrastructure/orm/__init__.py.j2", "infrastructure/orm/__init__.py"),
        ("infrastructure/orm/base.py.j2", "infrastructure/orm/base.py"),
        ("infrastructure/orm/session.py.j2", "infrastructure/orm/session.py"),
        ("infrastructure/repositories/__init__.py.j2", "infrastructure/repositories/__init__.py"),
        ("infrastructure/repositories/base.py.j2", "infrastructure/repositories/base.py"),
        ("api/__init__.py.j2", "api/__init__.py"),
        ("api/main.py.j2", "api/main.py"),
        ("api/routes/__init__.py.j2", "api/routes/__init__.py"),
        ("api/routes/health.py.j2", "api/routes/health.py"),
        ("api/schemas/__init__.py.j2", "api/schemas/__init__.py"),
        ("api/schemas/base.py.j2", "api/schemas/base.py"),
        ("api/schemas/health.py.j2", "api/schemas/health.py"),
        ("api/dependencies/__init__.py.j2", "api/dependencies/__init__.py"),
        ("api/dependencies/database.py.j2", "api/dependencies/database.py"),
        ("api/dependencies/settings.py.j2", "api/dependencies/settings.py"),
    ]

    PROJECT_TEMPLATES = [
        ("project/pyproject.toml.j2", "pyproject.toml"),
        ("project/README.md.j2", "README.md"),
        ("project/.env.example.j2", ".env.example"),
        ("project/.gitignore.j2", ".gitignore"),
    ]

    def generate(self, config: ProjectConfig) -> None:
        with self._ui.spinner("Creating project structure..."):
            self._create_project_directories(config)
            self._generate_project_files(config)
            self._generate_clean_architecture_files(config)
            self._create_init_file(config.src_path / "__init__.py")

        self._ui.show_success("Project structure created")

    def _create_project_directories(self, config: ProjectConfig) -> None:
        self._create_directory(config.project_path)
        self._create_directory(config.src_path)
        self._create_directory(config.project_path / "tests")

        for layer in self.CLEAN_ARCH_LAYERS:
            self._create_directory(config.src_path / layer)

    def _generate_project_files(self, config: ProjectConfig) -> None:
        for template_path, output_file in self.PROJECT_TEMPLATES:
            output_path = config.project_path / output_file
            self._render_template(template_path, output_path, config)

    def _generate_clean_architecture_files(self, config: ProjectConfig) -> None:
        for template_path, output_file in self.CLEAN_ARCH_TEMPLATES:
            full_template_path = f"clean_architecture/{template_path}"
            output_path = config.src_path / output_file
            self._render_template(full_template_path, output_path, config)

    def _create_init_file(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("")
