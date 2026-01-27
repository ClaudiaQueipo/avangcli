from backend_cli.core.config import DockerConfig, ProjectConfig
from backend_cli.generators.base import BaseGenerator


class DockerSetupGenerator(BaseGenerator):
    def generate(self, config: ProjectConfig) -> None:
        if config.docker == DockerConfig.NONE:
            return

        with self._ui.spinner("Setting up Docker configuration..."):
            self._generate_dockerignore(config)
            self._generate_docker_files(config)

        self._ui.show_success("Docker configuration created")

    def _generate_dockerignore(self, config: ProjectConfig) -> None:
        output_path = config.project_path / ".dockerignore"
        self._render_template("docker/.dockerignore.j2", output_path, config)

    def _generate_docker_files(self, config: ProjectConfig) -> None:
        if config.docker in (DockerConfig.DEV, DockerConfig.BOTH):
            self._generate_dev_docker(config)

        if config.docker in (DockerConfig.PROD, DockerConfig.BOTH):
            self._generate_prod_docker(config)

    def _generate_dev_docker(self, config: ProjectConfig) -> None:
        dockerfile_path = config.project_path / "Dockerfile.dev"
        self._render_template("docker/Dockerfile.dev.j2", dockerfile_path, config)

        compose_path = config.project_path / "docker-compose.dev.yml"
        self._render_template("docker/docker-compose.dev.yml.j2", compose_path, config)

    def _generate_prod_docker(self, config: ProjectConfig) -> None:
        dockerfile_path = config.project_path / "Dockerfile.prod"
        self._render_template("docker/Dockerfile.prod.j2", dockerfile_path, config)

        compose_path = config.project_path / "docker-compose.prod.yml"
        self._render_template("docker/docker-compose.prod.yml.j2", compose_path, config)
