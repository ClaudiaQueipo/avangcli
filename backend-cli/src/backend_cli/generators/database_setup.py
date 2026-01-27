from backend_cli.core.config import DatabaseType, ProjectConfig
from backend_cli.generators.base import BaseGenerator


class DatabaseSetupGenerator(BaseGenerator):
    DATABASE_TEMPLATES = {
        DatabaseType.POSTGRES: "database/postgres/docker-compose.db.yml.j2",
        DatabaseType.MYSQL: "database/mysql/docker-compose.db.yml.j2",
        DatabaseType.SQLSERVER: "database/sqlserver/docker-compose.db.yml.j2",
    }

    def generate(self, config: ProjectConfig) -> None:
        with self._ui.spinner(f"Setting up {config.database.value} database..."):
            self._generate_database_compose(config)

        self._ui.show_success(f"{config.database.value.capitalize()} database configured")

    def _generate_database_compose(self, config: ProjectConfig) -> None:
        template_path = self.DATABASE_TEMPLATES.get(config.database)
        if template_path is None:
            return

        output_path = config.project_path / "docker-compose.db.yml"
        self._render_template(template_path, output_path, config)
