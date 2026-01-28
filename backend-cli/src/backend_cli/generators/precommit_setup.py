from backend_cli.core.config import ProjectConfig
from backend_cli.generators.base import BaseGenerator


class PrecommitSetupGenerator(BaseGenerator):
    def generate(self, config: ProjectConfig) -> None:
        if not config.precommit:
            return

        with self._ui.spinner("Setting up pre-commit hooks..."):
            self._generate_precommit_config(config)

        self._ui.show_success("Pre-commit hooks configured")

    def _generate_precommit_config(self, config: ProjectConfig) -> None:
        output_path = config.project_path / ".pre-commit-config.yaml"
        self._render_template("precommit/.pre-commit-config.yaml.j2", output_path, config)
