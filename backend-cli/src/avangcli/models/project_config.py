"""Project configuration model."""

from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class PackageManager(str, Enum):
    """Supported package managers."""

    UV = "uv"
    POETRY = "poetry"


class Linter(str, Enum):
    """Supported linters and formatters."""

    RUFF = "ruff"
    BLACK = "black"
    FLAKE8 = "flake8"


class DockerEnvironment(str, Enum):
    """Docker environment types."""

    DEVELOPMENT = "dev"
    PRODUCTION = "prod"


class ProjectConfig(BaseModel):
    """
    Configuration for a FastAPI backend project.

    This model holds all the user's choices during project initialization.
    """

    name: str = Field(
        ...,
        description="Project name (must be a valid Python identifier)",
        min_length=1,
        max_length=100,
    )

    package_manager: PackageManager = Field(
        default=PackageManager.UV,
        description="Package manager to use (UV or Poetry)",
    )

    use_database: bool = Field(
        default=False,
        description="Whether to configure database support",
    )

    db_environments: list[DockerEnvironment] = Field(
        default_factory=list,
        description="Docker environments to generate (dev, prod, or both)",
    )

    linters: list[Linter] = Field(
        default_factory=lambda: [Linter.RUFF],
        description="Linters and formatters to configure",
    )

    use_git: bool = Field(
        default=True,
        description="Whether to initialize a Git repository",
    )

    use_makefile: bool = Field(
        default=True,
        description="Whether to generate a Makefile with useful commands",
    )

    python_version: str = Field(
        default="3.11",
        description="Python version to use",
    )

    @field_validator("db_environments")
    @classmethod
    def validate_db_environments(
        cls, v: list[DockerEnvironment], info
    ) -> list[DockerEnvironment]:
        """Ensure db_environments is empty if use_database is False."""
        # Access other fields via info.data
        use_database = info.data.get("use_database", False)
        if not use_database and v:
            return []
        return v

    @property
    def use_docker(self) -> bool:
        """Whether Docker configuration should be generated."""
        return self.use_database and len(self.db_environments) > 0

    @property
    def project_slug(self) -> str:
        """Project name normalized for use in file names and imports."""
        return self.name.lower().replace("-", "_")

    def model_dump_template_context(self) -> dict:
        """
        Export configuration as template context for Jinja2.

        Returns:
            Dictionary with all config values formatted for templates
        """
        return {
            "project_name": self.name,
            "project_slug": self.project_slug,
            "package_manager": self.package_manager.value,
            "python_version": self.python_version,
            "use_database": self.use_database,
            "db_environments": [env.value for env in self.db_environments],
            "use_docker": self.use_docker,
            "linters": [linter.value for linter in self.linters],
            "use_git": self.use_git,
            "use_makefile": self.use_makefile,
            # Convenience flags for templates
            "has_ruff": Linter.RUFF in self.linters,
            "has_black": Linter.BLACK in self.linters,
            "has_flake8": Linter.FLAKE8 in self.linters,
            "has_dev_env": DockerEnvironment.DEVELOPMENT in self.db_environments,
            "has_prod_env": DockerEnvironment.PRODUCTION in self.db_environments,
        }

    class Config:
        """Pydantic config."""

        use_enum_values = False
        validate_assignment = True
