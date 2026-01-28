from backend_cli.core.config import ProjectConfig
from backend_cli.generators.base import BaseGenerator


class AlembicSetupGenerator(BaseGenerator):
    def generate(self, config: ProjectConfig) -> None:
        with self._ui.spinner("Setting up Alembic migrations..."):
            self._create_alembic_directory(config)
            self._generate_alembic_ini(config)
            self._generate_env_py(config)
            self._generate_script_template(config)
            self._create_versions_directory(config)

        self._ui.show_success("Alembic migrations configured")

    def _create_alembic_directory(self, config: ProjectConfig) -> None:
        alembic_path = config.project_path / "alembic"
        self._create_directory(alembic_path)

    def _generate_alembic_ini(self, config: ProjectConfig) -> None:
        output_path = config.project_path / "alembic.ini"
        self._render_template("alembic/alembic.ini.j2", output_path, config)

    def _generate_env_py(self, config: ProjectConfig) -> None:
        output_path = config.project_path / "alembic" / "env.py"
        self._render_template("alembic/env.py.j2", output_path, config)

    def _generate_script_template(self, config: ProjectConfig) -> None:
        output_path = config.project_path / "alembic" / "script.py.mako"
        self._render_template("alembic/script.py.mako.j2", output_path, config)

    def _create_versions_directory(self, config: ProjectConfig) -> None:
        versions_path = config.project_path / "alembic" / "versions"
        self._create_directory(versions_path)
        gitkeep_path = versions_path / ".gitkeep"
        gitkeep_path.write_text("")
