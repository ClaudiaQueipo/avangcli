from pathlib import Path

import typer
from rich.console import Console

from backend_cli.core.config import (
    DatabaseType,
    DockerConfig,
    ProjectConfig,
)
from backend_cli.generators.alembic_setup import AlembicSetupGenerator
from backend_cli.generators.database_setup import DatabaseSetupGenerator
from backend_cli.generators.docker_setup import DockerSetupGenerator
from backend_cli.generators.linter_setup import LinterSetupGenerator
from backend_cli.generators.precommit_setup import PrecommitSetupGenerator
from backend_cli.generators.project_structure import ProjectStructureGenerator
from backend_cli.prompts.init_prompts import InitPrompts
from backend_cli.prompts.ui import ConsoleUI

console = Console()


def to_snake_case(name: str) -> str:
    return name.lower().replace("-", "_").replace(" ", "_")


def _gather_config_params(
    ui: ConsoleUI,
    prompts: InitPrompts,
    project_name: str | None,
    db: DatabaseType | None,
    docker: DockerConfig | None,
    precommit: bool | None,
    interactive: bool,
) -> dict:
    if interactive:
        return _gather_interactive_params(prompts, ui, project_name, db, docker, precommit)
    return _gather_non_interactive_params(ui, project_name, db, docker, precommit)


def _gather_interactive_params(
    prompts: InitPrompts,
    ui: ConsoleUI,
    project_name: str | None,
    db: DatabaseType | None,
    docker: DockerConfig | None,
    precommit: bool | None,
) -> dict:
    prompts.show_welcome()

    name = project_name or prompts.ask_project_name()
    database = db if db is not None else prompts.ask_database()
    docker_cfg = docker if docker is not None else prompts.ask_docker_config()
    precommit_cfg = precommit if precommit is not None else prompts.ask_precommit()
    package_name = to_snake_case(name)

    if not prompts.confirm_config(
        project_name=name,
        package_name=package_name,
        database=database,
        docker=docker_cfg,
        precommit=precommit_cfg,
    ):
        ui.show_error("Cancelled by user")
        raise typer.Exit(1)

    return {
        "project_name": name,
        "package_name": package_name,
        "db": database,
        "docker": docker_cfg,
        "precommit": precommit_cfg,
    }


def _gather_non_interactive_params(
    ui: ConsoleUI,
    project_name: str | None,
    db: DatabaseType | None,
    docker: DockerConfig | None,
    precommit: bool | None,
) -> dict:
    if not project_name:
        ui.show_error("Project name is required in non-interactive mode")
        raise typer.Exit(1)

    return {
        "project_name": project_name,
        "package_name": to_snake_case(project_name),
        "db": db or DatabaseType.POSTGRES,
        "docker": docker or DockerConfig.BOTH,
        "precommit": precommit if precommit is not None else True,
    }


def init(
    project_name: str = typer.Argument(
        None,
        help="Project name (will be converted to snake_case for package)",
    ),
    output_dir: Path = typer.Option(
        Path.cwd(),
        "--output",
        "-o",
        help="Output directory for the project",
    ),
    db: DatabaseType = typer.Option(
        None,
        "--db",
        help="Database type",
    ),
    docker: DockerConfig = typer.Option(
        None,
        "--docker",
        help="Docker configuration",
    ),
    precommit: bool = typer.Option(
        None,
        "--precommit/--no-precommit",
        help="Setup pre-commit hooks",
    ),
    interactive: bool = typer.Option(
        True,
        "--interactive/--no-interactive",
        "-i/-y",
        help="Run in interactive mode",
    ),
) -> None:
    ui = ConsoleUI()
    prompts = InitPrompts(ui)

    config_params = _gather_config_params(
        ui=ui,
        prompts=prompts,
        project_name=project_name,
        db=db,
        docker=docker,
        precommit=precommit,
        interactive=interactive,
    )

    config = ProjectConfig(
        project_name=config_params["project_name"],
        package_name=config_params["package_name"],
        output_path=output_dir,
        database=config_params["db"],
        docker=config_params["docker"],
        precommit=config_params["precommit"],
    )

    try:
        _run_generators(config, ui)
        _show_next_steps(config, ui)
    except Exception as e:
        ui.show_error(f"Failed to generate project: {e}")
        raise typer.Exit(1)


def _run_generators(config: ProjectConfig, ui: ConsoleUI) -> None:
    ui.show_phase("Phase 1/5: Generating project structure")
    ProjectStructureGenerator(ui=ui).generate(config)

    ui.show_phase("Phase 2/5: Setting up database")
    DatabaseSetupGenerator(ui=ui).generate(config)

    if config.docker != DockerConfig.NONE:
        ui.show_phase("Phase 3/5: Configuring Docker")
        DockerSetupGenerator(ui=ui).generate(config)
    else:
        ui.show_info("Phase 3/5: Skipping Docker setup")

    ui.show_phase("Phase 4/5: Setting up Alembic migrations")
    AlembicSetupGenerator(ui=ui).generate(config)

    if config.precommit:
        ui.show_phase("Phase 5/5: Configuring linting and pre-commit hooks")
        LinterSetupGenerator(ui=ui).generate(config)
        PrecommitSetupGenerator(ui=ui).generate(config)
    else:
        ui.show_info("Phase 5/5: Skipping pre-commit setup")

    ui.show_success(f"\nProject '{config.project_name}' generated successfully!")


def _show_next_steps(config: ProjectConfig, ui: ConsoleUI) -> None:
    steps = [
        f"cd {config.project_name}",
        "uv sync",
    ]

    if config.docker != DockerConfig.NONE:
        if config.docker in (DockerConfig.DEV, DockerConfig.BOTH):
            steps.append("docker-compose -f docker-compose.dev.yml up -d")
        else:
            steps.append("docker-compose -f docker-compose.prod.yml up -d")

    steps.extend([
        "alembic upgrade head",
        "uv run uvicorn {package}.api.main:app --reload".format(
            package=config.package_name
        ),
    ])

    if config.precommit:
        steps.insert(-1, "pre-commit install")

    ui.show_next_steps(steps)
