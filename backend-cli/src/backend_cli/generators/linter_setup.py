from backend_cli.core.config import ProjectConfig
from backend_cli.generators.base import BaseGenerator


class LinterSetupGenerator(BaseGenerator):
    def generate(self, config: ProjectConfig) -> None:
        with self._ui.spinner("Setting up Ruff linter and formatter..."):
            self._generate_ruff_config(config)
            self._generate_editorconfig(config)

        self._ui.show_success("Ruff linter configured")

    def _generate_ruff_config(self, config: ProjectConfig) -> None:
        output_path = config.project_path / "ruff.toml"
        self._render_template("linting/ruff.toml.j2", output_path, config)

    def _generate_editorconfig(self, config: ProjectConfig) -> None:
        output_path = config.project_path / ".editorconfig"
        self._render_template("linting/.editorconfig.j2", output_path, config)
