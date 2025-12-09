"""Init command for creating new FastAPI projects."""

import typer
from rich.console import Console
from typing_extensions import Annotated

console = Console()


def main(
    project_name: Annotated[str, typer.Argument(help="Name of the project to create")] = None,
) -> None:
    """
    Initialize a new FastAPI backend project.

    This command will guide you through an interactive setup process to create
    a new FastAPI project with your preferred configuration.
    """
    console.print("[bold blue]AvangCLI Init[/bold blue] - Create a new FastAPI project")
    console.print(f"Project name: {project_name or '[interactive mode]'}")
    console.print("\n[yellow]Coming soon...[/yellow]")
    console.print("The interactive setup will be implemented in the next phases.")
