from contextlib import contextmanager
from typing import Generator

from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn


class ConsoleUI:
    LOGO = r"""
    ___  _    _____    _  __________   ____  ___   ________ ______  _   ______
   /   || |  / /   |  / |/ / ____/ /  /  _/ / _ ) / ____/ //_/ __ \/ | / / __ \
  / /| || | / / /| | /    / / __/ /   / /  / _  |/ __/ / ,< / / / /  |/ / / / /
 / ___ || |/ / ___ |/ /|  / /_/ / /____/ / /____/ /___/ /| / /_/ / /|  / /_/ /
/_/  |_||___/_/  |_/_/ |_/\____/_____/___/      /_____/_/ |_\____/_/ |_/_____/
    """

    def __init__(self):
        self._console = Console()

    @property
    def console(self) -> Console:
        return self._console

    def show_welcome(self) -> None:
        self._console.print(self.LOGO, style="bold blue")
        self._console.print(
            Panel(
                "[bold green]FastAPI Project Generator[/bold green]\n"
                "Create production-ready FastAPI projects with clean architecture",
                border_style="blue",
            )
        )
        self._console.print()

    def show_success(self, message: str) -> None:
        self._console.print(f"[green]✓[/green] {message}")

    def show_error(self, message: str) -> None:
        self._console.print(f"[red]✗[/red] {message}")

    def show_info(self, message: str) -> None:
        self._console.print(f"[blue]ℹ[/blue] {message}")

    def show_warning(self, message: str) -> None:
        self._console.print(f"[yellow]⚠[/yellow] {message}")

    def show_panel(self, content: str, title: str = "", style: str = "blue") -> None:
        self._console.print(Panel(content, title=title, border_style=style))

    @contextmanager
    def spinner(self, message: str) -> Generator[Progress, None, None]:
        progress = Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            transient=True,
            console=self._console,
        )
        with progress:
            progress.add_task(description=message, total=None)
            yield progress

    def show_project_summary(
        self,
        project_name: str,
        package_name: str,
        database: str,
        docker: str,
        precommit: bool,
    ) -> None:
        summary = (
            f"[bold]Project:[/bold] {project_name}\n"
            f"[bold]Package:[/bold] {package_name}\n"
            f"[bold]Database:[/bold] {database}\n"
            f"[bold]Docker:[/bold] {docker}\n"
            f"[bold]Pre-commit:[/bold] {'Yes' if precommit else 'No'}"
        )
        self.show_panel(summary, title="Project Configuration", style="green")

    def show_next_steps(self, project_name: str) -> None:
        steps = (
            f"[bold]1.[/bold] cd {project_name}\n"
            f"[bold]2.[/bold] uv sync\n"
            f"[bold]3.[/bold] cp .env.example .env\n"
            f"[bold]4.[/bold] docker compose -f docker-compose.dev.yml up -d\n"
            f"[bold]5.[/bold] uv run alembic upgrade head\n"
            f"[bold]6.[/bold] uv run uvicorn src.{project_name.replace('-', '_')}.api.main:app --reload"
        )
        self.show_panel(steps, title="Next Steps", style="cyan")
