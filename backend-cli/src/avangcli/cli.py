"""Main CLI entry point for AvangCLI Backend."""

import logging
from pathlib import Path

import typer
from rich.console import Console
from typing_extensions import Annotated

from avangcli.commands import init

# Package version
__version__ = "0.1.0"

# Initialize Rich console for beautiful output
console = Console()

# Initialize Typer app
app = typer.Typer(
    name="avangcli",
    help="CLI tool to generate and manage FastAPI backend projects",
    add_completion=False,
    rich_markup_mode="rich",
)

# Register init command
app.command(name="init", help="Initialize a new FastAPI backend project")(init.main)


def version_callback(value: bool) -> None:
    """Show version and exit."""
    if value:
        console.print(f"[bold blue]AvangCLI Backend[/bold blue] version [green]{__version__}[/green]")
        raise typer.Exit()


@app.callback()
def main(
    version: Annotated[
        bool,
        typer.Option(
            "--version",
            "-v",
            help="Show version and exit",
            callback=version_callback,
            is_eager=True,
        ),
    ] = False,
    verbose: Annotated[
        bool,
        typer.Option(
            "--verbose",
            help="Enable verbose logging",
        ),
    ] = False,
) -> None:
    """
    AvangCLI Backend - Generate and manage FastAPI projects.

    Generate FastAPI backend projects following Screaming Architecture principles
    with interactive setup, database configuration, and development tooling.
    """
    # Configure logging level based on verbose flag
    if verbose:
        logging.basicConfig(
            level=logging.DEBUG,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        )
    else:
        logging.basicConfig(
            level=logging.INFO,
            format="%(levelname)s: %(message)s",
        )


if __name__ == "__main__":
    app()
