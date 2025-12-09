"""Textual TUI application for AvangCLI project setup."""

from pathlib import Path

from textual.app import App, ComposeResult
from textual.containers import Container, Horizontal, Vertical
from textual.screen import Screen
from textual.widgets import Button, Footer, Header, Label, Static

from ..models.project_config import ProjectConfig
from ..ui.messages import ASCII_ART
from ..ui.widgets.database_step import DatabaseStep
from ..ui.widgets.git_step import GitStep
from ..ui.widgets.linter_step import LinterStep
from ..ui.widgets.makefile_step import MakefileStep
from ..ui.widgets.name_step import NameStep
from ..ui.widgets.package_manager_step import PackageManagerStep
from ..ui.widgets.summary_step import SummaryStep


class SetupScreen(Screen):
    """Main setup screen with step-by-step configuration."""

    CSS_PATH = Path(__file__).parent / "theme.tcss"

    # Keyboard bindings
    BINDINGS = [
        ("ctrl+n", "next_step", "Next"),
        ("ctrl+b", "previous_step", "Back"),
        ("ctrl+c,ctrl+q", "quit", "Quit"),
        ("f1", "show_help", "Help"),
    ]

    def __init__(self, initial_name: str | None = None):
        """
        Initialize setup screen.

        Args:
            initial_name: Optional pre-filled project name
        """
        super().__init__()
        self.initial_name = initial_name
        self.current_step = 0
        self.config_data = {
            "name": initial_name or "",
            "package_manager": "uv",
            "use_database": True,
            "db_environments": ["dev", "prod"],
            "linters": ["ruff"],
            "use_git": True,
            "use_commitizen": False,
            "use_makefile": True,
            "python_version": "3.11",
        }

        # Define setup steps
        self.steps = [
            NameStep(self.config_data),
            PackageManagerStep(self.config_data),
            DatabaseStep(self.config_data),
            LinterStep(self.config_data),
            GitStep(self.config_data),
            MakefileStep(self.config_data),
            SummaryStep(self.config_data),
        ]

    def compose(self) -> ComposeResult:
        """Create child widgets."""
        yield Header()

        with Container(id="main-container"):
            # ASCII Art Banner
            yield Static(ASCII_ART, classes="ascii-art", id="ascii-banner")
            yield Static(
                "FastAPI Backend Project Generator", classes="static-subtitle", id="subtitle"
            )

            # Step indicator
            yield Label(
                f"Step {self.current_step + 1} of {len(self.steps)}",
                id="step-indicator",
                classes="label-primary",
            )

            # Step container (will be swapped)
            with Vertical(id="step-content"):
                yield self.steps[self.current_step]

            # Navigation buttons
            with Horizontal(id="nav-buttons"):
                yield Button("← Back", id="btn-back", variant="default", disabled=True)
                yield Button("Next →", id="btn-next", variant="primary")

        yield Footer()

    def on_mount(self) -> None:
        """Handle mount event."""
        self.update_step_indicator()

    def on_button_pressed(self, event: Button.Pressed) -> None:
        """Handle button press events."""
        if event.button.id == "btn-next":
            self.action_next_step()
        elif event.button.id == "btn-back":
            self.action_previous_step()

    def action_next_step(self) -> None:
        """Action: Move to next step (triggered by keyboard or button)."""
        self.next_step()

    def action_previous_step(self) -> None:
        """Action: Move to previous step (triggered by keyboard or button)."""
        self.previous_step()

    def action_quit(self) -> None:
        """Action: Quit the application."""
        self.app.exit(None)

    def action_show_help(self) -> None:
        """Action: Show help message with keyboard shortcuts."""
        from textual.widgets import Label

        help_text = """
[bold cyan]Keyboard Shortcuts:[/bold cyan]

[yellow]Navigation:[/yellow]
  Ctrl+N               → Next step
  Ctrl+B               → Previous step
  Tab / Shift+Tab      → Navigate widgets

[yellow]Actions:[/yellow]
  Space                → Toggle checkbox/radio
  Arrow Keys           → Navigate options

[yellow]Application:[/yellow]
  Ctrl+C / Ctrl+Q      → Quit
  F1                   → Show this help

[dim]Press any key to close this help...[/dim]
"""
        # Create a simple help overlay
        help_label = self.query_one("#step-indicator", Label)
        original_text = help_label.renderable
        help_label.update(help_text)

        # TODO: Implement proper modal dialog
        # For now, just show in step indicator temporarily

    def next_step(self) -> None:
        """Move to next step."""
        # Validate current step
        current = self.steps[self.current_step]
        if not current.validate():
            return

        # Save current step data
        current.save_data()

        # Check if this is the last step
        if self.current_step == len(self.steps) - 1:
            # Finish setup
            self.finish_setup()
            return

        # Move to next step
        self.current_step += 1
        self.update_step_display()

    def previous_step(self) -> None:
        """Move to previous step."""
        if self.current_step > 0:
            self.current_step -= 1
            self.update_step_display()

    def update_step_display(self) -> None:
        """Update the displayed step."""
        # Remove old step
        step_content = self.query_one("#step-content", Vertical)
        step_content.remove_children()

        # Add new step
        step_content.mount(self.steps[self.current_step])

        # Set focus based on step
        from .widgets.database_step import DatabaseStep

        if isinstance(self.steps[self.current_step], DatabaseStep):
            try:
                checkbox = self.query_one("#database-checkbox")
                checkbox.focus()
            except:
                pass
        else:
            try:
                radioset = self.query_one("RadioSet")
                radioset.focus()
            except:
                pass

        # Update UI
        self.update_step_indicator()
        self.update_navigation_buttons()

    def update_step_indicator(self) -> None:
        """Update step indicator text."""
        indicator = self.query_one("#step-indicator", Label)
        indicator.update(
            f"Step {self.current_step + 1} of {len(self.steps)}: "
            f"{self.steps[self.current_step].title}"
        )

    def update_navigation_buttons(self) -> None:
        """Update navigation button states."""
        back_btn = self.query_one("#btn-back", Button)
        next_btn = self.query_one("#btn-next", Button)

        # Back button
        back_btn.disabled = self.current_step == 0

        # Next button - change label based on step (don't change ID)
        if self.current_step == len(self.steps) - 1:
            next_btn.label = "✓ Create Project"
            # Add a class to style it differently if needed
            next_btn.add_class("finish-button")
        else:
            next_btn.label = "Next →"
            next_btn.remove_class("finish-button")

    def finish_setup(self) -> None:
        """Finish setup and return configuration."""
        self.app.exit(self.config_data)


class AvangCLIApp(App):
    """AvangCLI Textual application."""

    TITLE = "AvangCLI"
    CSS_PATH = Path(__file__).parent / "theme.tcss"

    def __init__(self, initial_name: str | None = None):
        """
        Initialize app.

        Args:
            initial_name: Optional pre-filled project name
        """
        super().__init__()
        self.initial_name = initial_name
        self.result = None

    def on_mount(self) -> None:
        """Handle mount event."""
        self.push_screen(SetupScreen(self.initial_name))

    def run_setup(self) -> ProjectConfig | None:
        """
        Run the interactive setup and return configuration.

        Returns:
            ProjectConfig if setup completed, None if cancelled
        """
        result = self.run()

        if result is None:
            return None

        # Convert result dict to ProjectConfig
        from ..models.project_config import (
            DockerEnvironment,
            Linter,
            PackageManager,
        )

        return ProjectConfig(
            name=result["name"],
            package_manager=PackageManager(result["package_manager"]),
            use_database=result["use_database"],
            db_environments=[DockerEnvironment(env) for env in result["db_environments"]],
            linters=[Linter(linter) for linter in result["linters"]],
            use_git=result["use_git"],
            use_commitizen=result["use_commitizen"],
            use_makefile=result["use_makefile"],
            python_version=result.get("python_version", "3.11"),
        )
