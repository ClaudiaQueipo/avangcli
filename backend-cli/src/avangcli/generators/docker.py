"""Generator for Docker configuration files."""

from pathlib import Path

from jinja2 import Environment, FileSystemLoader

from avangcli.core.config import DOCKER_TEMPLATES_DIR
from avangcli.models.project_config import DockerEnvironment, ProjectConfig


class DockerGenerator:
    """Generates Docker configuration files."""

    def __init__(self, config: ProjectConfig, project_dir: Path):
        """
        Initialize Docker generator.

        Args:
            config: Project configuration
            project_dir: Project directory path
        """
        self.config = config
        self.project_dir = project_dir

        # Set up Jinja2 environment
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(DOCKER_TEMPLATES_DIR)),
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
        """Generate Docker configuration files."""
        if not self.config.use_docker:
            return

        context = self.config.model_dump_template_context()

        # Always generate Dockerfile if Docker is enabled
        self._generate_dockerfile(context)

        # Generate docker-compose files based on environments
        if DockerEnvironment.DEVELOPMENT in self.config.db_environments:
            self._generate_docker_compose_dev(context)

        if DockerEnvironment.PRODUCTION in self.config.db_environments:
            self._generate_docker_compose_prod(context)

    def _generate_dockerfile(self, context: dict) -> None:
        """Generate Dockerfile."""
        content = self._render_template("Dockerfile.jinja", context)
        (self.project_dir / "Dockerfile").write_text(content)

    def _generate_docker_compose_dev(self, context: dict) -> None:
        """Generate docker-compose.dev.yml."""
        content = self._render_template("docker-compose.dev.yml.jinja", context)
        (self.project_dir / "docker-compose.dev.yml").write_text(content)

    def _generate_docker_compose_prod(self, context: dict) -> None:
        """Generate docker-compose.prod.yml."""
        content = self._render_template("docker-compose.prod.yml.jinja", context)
        (self.project_dir / "docker-compose.prod.yml").write_text(content)
