"""Init command for creating new FastAPI projects."""

import subprocess
from pathlib import Path

import typer
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from typing_extensions import Annotated

from avangcli.core.validators import ProjectValidator
from avangcli.generators.config_files import ConfigFilesGenerator
from avangcli.generators.docker import DockerGenerator
from avangcli.generators.makefile import MakefileGenerator
from avangcli.generators.project import ProjectGenerator
from avangcli.ui.messages import (
    confirm_action,
    print_config_summary,
    print_error,
    print_next_steps,
    print_success,
)
from avangcli.ui.prompts import ProjectSetupPrompt

console = Console()


def main(
    project_name: Annotated[
        str, typer.Argument(help="Name of the project to create")
    ] = None,
) -> None:
    """
    Initialize a new FastAPI backend project.

    This command will guide you through an interactive setup process to create
    a new FastAPI project with your preferred configuration.
    """
    try:
        # Run interactive setup
        prompt = ProjectSetupPrompt()
        config = prompt.run_interactive_setup(project_name=project_name)

        # Show configuration summary
        print_config_summary(config.model_dump_template_context())

        # Confirm before generating
        if not confirm_action("Continue with project generation?", default=True):
            console.print("\n[yellow]Project generation cancelled.[/yellow]")
            raise typer.Exit(0)

        # Validate project path
        output_dir = Path.cwd()
        project_path = output_dir / config.name

        try:
            ProjectValidator.validate_project_path(project_path)
        except Exception as e:
            print_error(str(e.message), e.suggestion)
            raise typer.Exit(1)

        # Generate project with progress indicators
        _generate_project(config, output_dir)

        # Post-generation tasks
        _post_generation(config, project_path)

        # Show next steps
        console.print("\n")
        print_next_steps(config.name, config.use_makefile)

    except KeyboardInterrupt:
        console.print("\n\n[yellow]Operation cancelled by user.[/yellow]")
        raise typer.Exit(1)
    except Exception as e:
        console.print(f"\n[bold red]Error:[/bold red] {str(e)}")
        raise typer.Exit(1)


def _generate_project(config, output_dir: Path) -> None:
    """
    Generate the project structure and files.

    Args:
        config: Project configuration
        output_dir: Output directory
    """
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        # Generate main project structure
        task = progress.add_task("Creating project structure...", total=None)
        project_gen = ProjectGenerator(config, output_dir)
        project_gen.generate()
        progress.update(task, completed=True)
        print_success("Project structure created")

        # Generate configuration files
        task = progress.add_task("Generating configuration files...", total=None)
        config_gen = ConfigFilesGenerator(config, output_dir / config.name)
        config_gen.generate()
        progress.update(task, completed=True)
        print_success("Configuration files generated")

        # Generate Docker files if needed
        if config.use_docker:
            task = progress.add_task("Generating Docker configuration...", total=None)
            docker_gen = DockerGenerator(config, output_dir / config.name)
            docker_gen.generate()
            progress.update(task, completed=True)
            print_success("Docker configuration generated")

        # Generate Makefile if needed
        if config.use_makefile:
            task = progress.add_task("Generating Makefile...", total=None)
            makefile_gen = MakefileGenerator(config, output_dir / config.name)
            makefile_gen.generate()
            progress.update(task, completed=True)
            print_success("Makefile generated")


def _post_generation(config, project_path: Path) -> None:
    """
    Execute post-generation tasks.

    Args:
        config: Project configuration
        project_path: Path to generated project
    """
    console.print("\n[bold cyan]Running post-generation tasks...[/bold cyan]\n")

    # Initialize Git repository if requested
    if config.use_git:
        try:
            subprocess.run(
                ["git", "init"],
                cwd=project_path,
                check=True,
                capture_output=True,
            )
            print_success("Initialized Git repository")
        except subprocess.CalledProcessError:
            console.print("[yellow]⚠ Could not initialize Git repository[/yellow]")
        except FileNotFoundError:
            console.print("[yellow]⚠ Git not found, skipping repository initialization[/yellow]")

    # Install dependencies
    console.print("\n[cyan]Installing dependencies...[/cyan]")
    try:
        if config.package_manager.value == "uv":
            subprocess.run(
                ["uv", "sync"],
                cwd=project_path,
                check=True,
            )
            print_success("Dependencies installed with UV")
        elif config.package_manager.value == "poetry":
            subprocess.run(
                ["poetry", "install"],
                cwd=project_path,
                check=True,
            )
            print_success("Dependencies installed with Poetry")
    except subprocess.CalledProcessError as e:
        console.print(f"[yellow]⚠ Failed to install dependencies: {e}[/yellow]")
        console.print("[dim]You can install them manually later[/dim]")
    except FileNotFoundError:
        console.print(
            f"[yellow]⚠ {config.package_manager.value} not found[/yellow]"
        )
        console.print("[dim]Install dependencies manually when ready[/dim]")
