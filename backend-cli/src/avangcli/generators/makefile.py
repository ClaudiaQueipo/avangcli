"""Generator for Makefile."""

from pathlib import Path

from jinja2 import Environment, FileSystemLoader

from avangcli.core.config import MAKEFILE_TEMPLATES_DIR
from avangcli.models.project_config import ProjectConfig


class MakefileGenerator:
    """Generates Makefile for the project."""

    def __init__(self, config: ProjectConfig, project_dir: Path):
        """
        Initialize Makefile generator.

        Args:
            config: Project configuration
            project_dir: Project directory path
        """
        self.config = config
        self.project_dir = project_dir

        # Set up Jinja2 environment
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(MAKEFILE_TEMPLATES_DIR)),
            trim_blocks=True,
            lstrip_blocks=True,
        )

    def _render_template(self, template_name: str, context: dict) -> str:
        """
        Render a template.

        Args:
            template_name: Name of template file
            context: Template context

        Returns:
            Rendered content
        """
        template = self.jinja_env.get_template(template_name)
        return template.render(**context)

    def generate(self) -> None:
        """Generate Makefile."""
        if not self.config.use_makefile:
            return

        context = self.config.model_dump_template_context()
        content = self._render_template("Makefile.jinja", context)
        (self.project_dir / "Makefile").write_text(content)
