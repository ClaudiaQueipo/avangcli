"""Standardized messages and UI formatting for AvangCLI Backend."""

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

console = Console()

# ASCII Art Logo
ASCII_ART = """
 █████╗ ██╗   ██╗ █████╗ ███╗   ██╗ ██████╗        ██████╗██╗     ██╗
██╔══██╗██║   ██║██╔══██╗████╗  ██║██╔════╝       ██╔════╝██║     ██║
███████║██║   ██║███████║██╔██╗ ██║██║  ███╗█████╗██║     ██║     ██║
██╔══██║╚██╗ ██╔╝██╔══██║██║╚██╗██║██║   ██║╚════╝██║     ██║     ██║
██║  ██║ ╚████╔╝ ██║  ██║██║ ╚████║╚██████╔╝      ╚██████╗███████╗██║
╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝        ╚═════╝╚══════╝╚═╝
"""


def print_banner() -> None:
    """Print the AvangCLI welcome banner with ASCII art."""
    console.print(ASCII_ART, style="bold green")
    console.print(
        "    [dim]FastAPI Backend Project Generator[/dim]\n",
        style="bold cyan"
    )


def print_success(message: str) -> None:
    """
    Print a success message.

    Args:
        message: Success message to display
    """
    console.print(f"✓ {message}", style="bold green")


def print_error(message: str, suggestion: str | None = None) -> None:
    """
    Print an error message with optional suggestion.

    Args:
        message: Error message to display
        suggestion: Optional suggestion for fixing the error
    """
    console.print(f"✗ Error: {message}", style="bold red")
    if suggestion:
        console.print(f"💡 Suggestion: {suggestion}", style="yellow")


def print_warning(message: str) -> None:
    """
    Print a warning message.

    Args:
        message: Warning message to display
    """
    console.print(f"⚠ Warning: {message}", style="bold yellow")


def print_info(message: str) -> None:
    """
    Print an informational message.

    Args:
        message: Info message to display
    """
    console.print(f"ℹ {message}", style="blue")


def print_step(step_number: int, total_steps: int, description: str) -> None:
    """
    Print a step indicator.

    Args:
        step_number: Current step number
        total_steps: Total number of steps
        description: Step description
    """
    console.print(
        f"\n[bold cyan]Step {step_number}/{total_steps}:[/bold cyan] {description}"
    )


def print_config_summary(config_data: dict) -> None:
    """
    Print a formatted summary of the project configuration.

    Args:
        config_data: Dictionary with configuration values
    """
    table = Table(title="Project Configuration Summary", show_header=False)
    table.add_column("Setting", style="cyan", no_wrap=True)
    table.add_column("Value", style="green")

    # Add rows
    table.add_row("Project Name", config_data.get("project_name", "N/A"))
    table.add_row(
        "Package Manager", config_data.get("package_manager", "N/A").upper()
    )

    # Database configuration
    if config_data.get("use_database"):
        db_envs = config_data.get("db_environments", [])
        db_value = "Yes (" + ", ".join(env.upper() for env in db_envs) + ")"
        table.add_row("Database", db_value)
    else:
        table.add_row("Database", "No")

    # Linters
    linters = config_data.get("linters", [])
    if linters:
        linters_value = ", ".join(linter.capitalize() for linter in linters)
    else:
        linters_value = "None"
    table.add_row("Linter/Formatter", linters_value)

    # Git and Makefile
    table.add_row("Git Repository", "Yes" if config_data.get("use_git") else "No")

    # Commitizen (only if Git is enabled)
    if config_data.get("use_git"):
        table.add_row("Commitizen/Commitlint", "Yes" if config_data.get("use_commitizen") else "No")

    table.add_row("Makefile", "Yes" if config_data.get("use_makefile") else "No")

    console.print("\n")
    console.print(table)
    console.print("\n")


def print_next_steps(project_name: str, use_makefile: bool = True) -> None:
    """
    Print next steps after successful project generation.

    Args:
        project_name: Name of the generated project
        use_makefile: Whether a Makefile was generated
    """
    panel_content = f"""
[bold green]Project '{project_name}' created successfully![/bold green]

[bold cyan]Next steps:[/bold cyan]

1. Navigate to your project:
   [yellow]cd {project_name}[/yellow]

2. Activate the virtual environment:
   [yellow]source .venv/bin/activate[/yellow]  (Unix/macOS)
   [yellow].venv\\Scripts\\activate[/yellow]     (Windows)

"""

    if use_makefile:
        panel_content += """3. Install dependencies:
   [yellow]make install[/yellow]

4. Start the development server:
   [yellow]make dev[/yellow]

5. Run tests:
   [yellow]make test[/yellow]

6. Check linting:
   [yellow]make lint[/yellow]
"""
    else:
        panel_content += """3. Install dependencies and start developing!

[dim]Check the README.md file for more information.[/dim]
"""

    panel = Panel(
        panel_content,
        title="Success!",
        border_style="green",
        padding=(1, 2),
    )
    console.print(panel)


def print_dependency_not_found(
    dependency: str, install_url: str | None = None
) -> None:
    """
    Print a message about a missing dependency.

    Args:
        dependency: Name of the missing dependency
        install_url: Optional URL with installation instructions
    """
    message = f"{dependency} is not installed"
    suggestion = f"Install {dependency}"
    if install_url:
        suggestion += f": {install_url}"

    print_error(message, suggestion)


def confirm_action(message: str, default: bool = True) -> bool:
    """
    Ask for user confirmation.

    Args:
        message: Confirmation message
        default: Default value if user presses Enter

    Returns:
        True if user confirms, False otherwise
    """
    prompt_text = f"{message} [Y/n]" if default else f"{message} [y/N]"
    console.print(f"\n{prompt_text}", style="bold yellow", end=" ")

    response = input().strip().lower()

    if not response:
        return default

    return response in ("y", "yes")
