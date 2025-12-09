"""Generator for configuration files."""

from pathlib import Path

from jinja2 import Environment, FileSystemLoader

from avangcli.core.config import CONFIG_TEMPLATES_DIR
from avangcli.models.project_config import ProjectConfig


class ConfigFilesGenerator:
    """Generates configuration files for the project."""

    def __init__(self, config: ProjectConfig, project_dir: Path):
        """
        Initialize config files generator.

        Args:
            config: Project configuration
            project_dir: Project directory path
        """
        self.config = config
        self.project_dir = project_dir

        # Set up Jinja2 environment
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(CONFIG_TEMPLATES_DIR)),
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
        """Generate all configuration files."""
        context = self.config.model_dump_template_context()

        # Generate avangclirc.json (project configuration file)
        self._generate_avangclirc(context)

        # Generate pyproject.toml
        self._generate_pyproject(context)

        # Generate .env.example
        self._generate_env_example(context)

        # Generate .gitignore
        self._generate_gitignore(context)

        # Generate README.md
        self._generate_readme(context)

        # Generate commitizen/commitlint config if enabled
        if self.config.use_commitizen:
            self._generate_commitlint_config(context)

    def _generate_pyproject(self, context: dict) -> None:
        """Generate pyproject.toml file."""
        content = self._render_template("pyproject.toml.jinja", context)
        (self.project_dir / "pyproject.toml").write_text(content)

    def _generate_env_example(self, context: dict) -> None:
        """Generate .env.example file."""
        content = self._render_template(".env.example.jinja", context)
        (self.project_dir / ".env.example").write_text(content)

    def _generate_gitignore(self, context: dict) -> None:
        """Generate .gitignore file."""
        content = self._render_template(".gitignore.jinja", context)
        (self.project_dir / ".gitignore").write_text(content)

    def _generate_readme(self, context: dict) -> None:
        """Generate README.md file."""
        content = self._render_template("README.md.jinja", context)
        (self.project_dir / "README.md").write_text(content)

    def _generate_commitlint_config(self, context: dict) -> None:
        """Generate commitlint configuration file."""
        content = self._render_template("commitlint.config.js.jinja", context)
        (self.project_dir / "commitlint.config.js").write_text(content)

    def _generate_avangclirc(self, context: dict) -> None:
        """Generate avangclirc.json configuration file."""
        content = self._render_template("avangclirc.json.jinja", context)
        (self.project_dir / "avangclirc.json").write_text(content)
