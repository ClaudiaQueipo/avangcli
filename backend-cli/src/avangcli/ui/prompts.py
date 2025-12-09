"""Interactive prompts for project configuration."""

from typing import Any

from rich.console import Console
from rich.prompt import Confirm, Prompt
from rich.table import Table

from avangcli.core.exceptions import InvalidProjectNameError
from avangcli.core.validators import DependencyValidator, ProjectValidator
from avangcli.models.project_config import (
    DockerEnvironment,
    Linter,
    PackageManager,
    ProjectConfig,
)
from avangcli.ui.messages import print_error, print_step, print_warning

console = Console()


class ProjectSetupPrompt:
    """Handles interactive prompts for project setup."""

    def __init__(self):
        self.dependency_validator = DependencyValidator()
        self.project_validator = ProjectValidator()

    def prompt_project_name(self) -> str:
        """
        Prompt for project name with validation.

        Returns:
            Valid project name
        """
        print_step(1, 6, "Project Name")
        console.print(
            "[dim]Enter a name for your project (snake_case recommended)[/dim]"
        )

        while True:
            name = Prompt.ask("\n[cyan]Project name[/cyan]").strip()

            if not name:
                print_error("Project name cannot be empty")
                continue

            # Try to normalize the name
            normalized_name = self.project_validator.normalize_project_name(name)

            # Validate the normalized name
            try:
                self.project_validator.validate_project_name(normalized_name)

                # If the name was changed, ask for confirmation
                if normalized_name != name:
                    console.print(
                        f"\n[yellow]Name normalized to:[/yellow] [green]{normalized_name}[/green]"
                    )
                    if not Confirm.ask("Use this name?", default=True):
                        continue

                return normalized_name

            except InvalidProjectNameError as e:
                print_error(e.message, e.suggestion)

    def prompt_package_manager(self) -> PackageManager:
        """
        Prompt for package manager selection with validation.

        Returns:
            Selected package manager
        """
        print_step(2, 6, "Package Manager")
        console.print("[dim]Choose your preferred package manager[/dim]\n")

        # Display options
        table = Table(show_header=False, box=None, padding=(0, 2))
        table.add_column("Option", style="cyan")
        table.add_column("Description")

        table.add_row("1", "UV (recommended - faster, modern)")
        table.add_row("2", "Poetry (traditional, mature)")

        console.print(table)

        while True:
            choice = Prompt.ask(
                "\n[cyan]Select package manager[/cyan]",
                choices=["1", "2"],
                default="1",
            )

            manager = PackageManager.UV if choice == "1" else PackageManager.POETRY

            # Validate that the selected manager is installed
            try:
                self.dependency_validator.validate_package_manager(manager.value)
                console.print(f"[green]✓ {manager.value} is available[/green]")
                return manager
            except Exception as e:
                print_error(str(e.message), e.suggestion)
                console.print(
                    "[yellow]Would you like to continue anyway? "
                    "(The project will be generated but you'll need to install "
                    "the package manager later)[/yellow]"
                )
                if Confirm.ask("Continue?", default=False):
                    return manager

    def prompt_database_config(self) -> tuple[bool, list[DockerEnvironment]]:
        """
        Prompt for database configuration.

        Returns:
            Tuple of (use_database, db_environments)
        """
        print_step(3, 6, "Database Configuration")
        console.print("[dim]Configure database support with Docker[/dim]\n")

        use_database = Confirm.ask(
            "[cyan]Do you want to set up database support?[/cyan]", default=True
        )

        if not use_database:
            return False, []

        # Ask about Docker environments
        console.print(
            "\n[dim]Select which Docker environments to generate:[/dim]\n"
        )

        table = Table(show_header=False, box=None, padding=(0, 2))
        table.add_column("Option", style="cyan")
        table.add_column("Description")

        table.add_row("1", "Development only")
        table.add_row("2", "Production only")
        table.add_row("3", "Both Development and Production")

        console.print(table)

        choice = Prompt.ask(
            "\n[cyan]Select environments[/cyan]", choices=["1", "2", "3"], default="3"
        )

        env_map = {
            "1": [DockerEnvironment.DEVELOPMENT],
            "2": [DockerEnvironment.PRODUCTION],
            "3": [DockerEnvironment.DEVELOPMENT, DockerEnvironment.PRODUCTION],
        }

        db_environments = env_map[choice]

        # Validate Docker if environments selected
        if db_environments:
            is_available, message = self.dependency_validator.validate_docker()
            if not is_available:
                print_warning(message)
                console.print(
                    "[yellow]Docker files will be generated, but you'll need to install Docker to use them.[/yellow]"
                )
                console.print("[dim]Install Docker: https://docs.docker.com/get-docker/[/dim]\n")

        return True, db_environments

    def prompt_linters(self) -> list[Linter]:
        """
        Prompt for linter/formatter selection.

        Returns:
            List of selected linters
        """
        print_step(4, 6, "Code Quality Tools")
        console.print("[dim]Select linter and formatter (you can select multiple)[/dim]\n")

        table = Table(show_header=False, box=None, padding=(0, 2))
        table.add_column("Option", style="cyan")
        table.add_column("Tool", style="green")
        table.add_column("Description")

        table.add_row("1", "Ruff", "Fast, all-in-one linter and formatter (recommended)")
        table.add_row("2", "Black", "Opinionated code formatter")
        table.add_row("3", "Flake8", "Traditional Python linter")
        table.add_row("4", "None", "Skip linter configuration")

        console.print(table)

        choice = Prompt.ask(
            "\n[cyan]Select tools (comma-separated, e.g., 1,2)[/cyan]",
            default="1",
        )

        if choice.strip() == "4":
            return []

        # Parse selections
        selections = [s.strip() for s in choice.split(",")]
        linter_map = {
            "1": Linter.RUFF,
            "2": Linter.BLACK,
            "3": Linter.FLAKE8,
        }

        linters = []
        for selection in selections:
            if selection in linter_map and selection != "4":
                linter = linter_map[selection]
                if linter not in linters:
                    linters.append(linter)

        if not linters:
            linters = [Linter.RUFF]  # Default to Ruff if nothing selected

        # Warn if both Ruff and Black are selected
        if Linter.RUFF in linters and Linter.BLACK in linters:
            print_warning(
                "Both Ruff and Black selected. Ruff includes formatting capabilities."
            )
            console.print(
                "[yellow]You may want to use Ruff's formatter instead of Black.[/yellow]\n"
            )

        return linters

    def prompt_git_init(self) -> bool:
        """
        Prompt for Git initialization.

        Returns:
            Whether to initialize Git repository
        """
        print_step(5, 6, "Git Repository")
        console.print("[dim]Initialize a Git repository for version control[/dim]\n")

        use_git = Confirm.ask(
            "[cyan]Initialize Git repository?[/cyan]", default=True
        )

        if use_git:
            is_available, version = self.dependency_validator.validate_git()
            if not is_available:
                print_warning("Git is not installed")
                console.print(
                    "[yellow].gitignore will be generated, but Git won't be initialized.[/yellow]"
                )
                console.print("[dim]Install Git: https://git-scm.com/downloads[/dim]\n")

        return use_git

    def prompt_makefile(self) -> bool:
        """
        Prompt for Makefile generation.

        Returns:
            Whether to generate Makefile
        """
        print_step(6, 6, "Makefile")
        console.print(
            "[dim]Generate a Makefile with convenient commands (install, dev, test, etc.)[/dim]\n"
        )

        return Confirm.ask("[cyan]Generate Makefile?[/cyan]", default=True)

    def run_interactive_setup(
        self, project_name: str | None = None
    ) -> ProjectConfig:
        """
        Run the complete interactive setup process.

        Args:
            project_name: Optional pre-filled project name

        Returns:
            Complete project configuration
        """
        console.print("\n")
        from avangcli.ui.messages import print_banner

        print_banner()
        console.print(
            "[bold]Let's set up your FastAPI project! 🚀[/bold]",
            style="cyan",
        )
        console.print("\n")

        # Collect all configuration
        if project_name is None:
            project_name = self.prompt_project_name()

        package_manager = self.prompt_package_manager()
        use_database, db_environments = self.prompt_database_config()
        linters = self.prompt_linters()
        use_git = self.prompt_git_init()
        use_makefile = self.prompt_makefile()

        # Create configuration
        config = ProjectConfig(
            name=project_name,
            package_manager=package_manager,
            use_database=use_database,
            db_environments=db_environments,
            linters=linters,
            use_git=use_git,
            use_makefile=use_makefile,
        )

        return config
