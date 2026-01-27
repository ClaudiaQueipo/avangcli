from enum import Enum
from pathlib import Path

from pydantic import BaseModel, field_validator


class DatabaseType(str, Enum):
    POSTGRES = "postgres"
    MYSQL = "mysql"
    SQLSERVER = "sqlserver"


class DockerConfig(str, Enum):
    DEV = "dev"
    PROD = "prod"
    BOTH = "both"
    NONE = "none"


class ProjectConfig(BaseModel):
    project_name: str
    package_name: str
    database: DatabaseType
    docker: DockerConfig
    precommit: bool = True
    output_path: Path = Path(".")

    @field_validator("package_name", mode="before")
    @classmethod
    def convert_to_snake_case(cls, v: str) -> str:
        return v.lower().replace("-", "_").replace(" ", "_")

    @classmethod
    def from_project_name(
        cls,
        project_name: str,
        database: DatabaseType,
        docker: DockerConfig,
        precommit: bool = True,
        output_path: Path | None = None,
    ) -> "ProjectConfig":
        package_name = project_name.lower().replace("-", "_").replace(" ", "_")
        return cls(
            project_name=project_name,
            package_name=package_name,
            database=database,
            docker=docker,
            precommit=precommit,
            output_path=output_path or Path("."),
        )

    @property
    def project_path(self) -> Path:
        return self.output_path / self.project_name

    @property
    def src_path(self) -> Path:
        return self.project_path / "src" / self.package_name
