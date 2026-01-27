import typer
from rich.console import Console

from backend_cli import __version__

app = typer.Typer(
    name="avangcli-backend",
    help="CLI for scaffolding FastAPI projects with clean architecture",
    add_completion=True,
)

console = Console()


def version_callback(value: bool) -> None:
    if value:
        console.print(f"avangcli-backend v{__version__}")
        raise typer.Exit()


@app.callback()
def main(
    version: bool = typer.Option(
        None,
        "--version",
        "-v",
        callback=version_callback,
        is_eager=True,
        help="Show version and exit",
    ),
) -> None:
    pass


if __name__ == "__main__":
    app()
