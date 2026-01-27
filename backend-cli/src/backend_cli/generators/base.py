from abc import ABC, abstractmethod
from pathlib import Path

from backend_cli.core.config import ProjectConfig
from backend_cli.core.template_engine import TemplateEngine
from backend_cli.prompts.ui import ConsoleUI


class BaseGenerator(ABC):
    def __init__(
        self,
        template_engine: TemplateEngine | None = None,
        ui: ConsoleUI | None = None,
    ):
        self._template_engine = template_engine or TemplateEngine()
        self._ui = ui or ConsoleUI()

    @property
    def template_engine(self) -> TemplateEngine:
        return self._template_engine

    @property
    def ui(self) -> ConsoleUI:
        return self._ui

    @abstractmethod
    def generate(self, config: ProjectConfig) -> None: ...

    def _get_template_context(self, config: ProjectConfig) -> dict:
        return {
            "project_name": config.project_name,
            "package_name": config.package_name,
            "database": config.database.value,
            "docker": config.docker.value,
            "precommit": config.precommit,
        }

    def _create_directory(self, path: Path) -> None:
        path.mkdir(parents=True, exist_ok=True)

    def _render_template(
        self,
        template_path: str,
        output_path: Path,
        config: ProjectConfig,
    ) -> None:
        context = self._get_template_context(config)
        self._template_engine.render_to_file(template_path, output_path, context)
