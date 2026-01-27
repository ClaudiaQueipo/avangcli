import re

from InquirerPy import inquirer
from InquirerPy.validator import ValidationError, Validator

from backend_cli.core.config import DatabaseType, DockerConfig
from backend_cli.prompts.ui import ConsoleUI


class ProjectNameValidator(Validator):
    def validate(self, document) -> None:
        value = document.text
        if not value:
            raise ValidationError(
                message="Project name cannot be empty",
                cursor_position=len(value),
            )
        if not re.match(r"^[a-zA-Z][a-zA-Z0-9_-]*$", value):
            raise ValidationError(
                message="Project name must start with a letter and contain only letters, numbers, hyphens, and underscores",
                cursor_position=len(value),
            )


class InitPrompts:
    def __init__(self, ui: ConsoleUI | None = None):
        self._ui = ui or ConsoleUI()

    @property
    def ui(self) -> ConsoleUI:
        return self._ui

    def show_welcome(self) -> None:
        self._ui.show_welcome()

    def ask_project_name(self, default: str = "my-fastapi-app") -> str:
        return inquirer.text(
            message="What is your project name?",
            default=default,
            validate=ProjectNameValidator(),
        ).execute()

    def ask_database(self, default: DatabaseType = DatabaseType.POSTGRES) -> DatabaseType:
        choices = [
            {"name": "PostgreSQL (Recommended)", "value": DatabaseType.POSTGRES},
            {"name": "MySQL", "value": DatabaseType.MYSQL},
            {"name": "SQL Server", "value": DatabaseType.SQLSERVER},
        ]
        result = inquirer.select(
            message="Select database:",
            choices=choices,
            default=default,
        ).execute()
        return result

    def ask_docker_config(self, default: DockerConfig = DockerConfig.BOTH) -> DockerConfig:
        choices = [
            {
                "name": "Both (Dev + Prod) (Recommended)",
                "value": DockerConfig.BOTH,
            },
            {
                "name": "Development only (Dockerfile.dev + docker-compose.dev.yml)",
                "value": DockerConfig.DEV,
            },
            {
                "name": "Production only (Dockerfile.prod + docker-compose.prod.yml)",
                "value": DockerConfig.PROD,
            },
            {"name": "None", "value": DockerConfig.NONE},
        ]
        result = inquirer.select(
            message="Configure Docker:",
            choices=choices,
            default=default,
        ).execute()
        return result

    def ask_precommit(self, default: bool = True) -> bool:
        return inquirer.confirm(
            message="Setup pre-commit hooks (Ruff + other checks)?",
            default=default,
        ).execute()

    def confirm_config(
        self,
        project_name: str,
        package_name: str,
        database: DatabaseType,
        docker: DockerConfig,
        precommit: bool,
    ) -> bool:
        self._ui.show_project_summary(
            project_name=project_name,
            package_name=package_name,
            database=database.value,
            docker=docker.value,
            precommit=precommit,
        )
        return inquirer.confirm(
            message="Proceed with this configuration?",
            default=True,
        ).execute()
