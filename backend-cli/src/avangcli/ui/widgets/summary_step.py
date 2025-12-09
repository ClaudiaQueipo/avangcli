"""Configuration summary step."""

from textual.app import ComposeResult
from textual.widgets import Static
from textual.containers import VerticalScroll

from avangcli.ui.widgets.base_step import BaseStep


class SummaryStep(BaseStep):
    """Configuration summary and confirmation step."""

    title = "Review & Confirm"

    def compose(self) -> ComposeResult:
        """Compose widgets."""
        yield Static(
            "✨ Configuration Summary",
            classes="step-title"
        )
        yield Static(
            "Review your project configuration before creation",
            classes="step-description"
        )

        with VerticalScroll(id="summary-container", classes="card-highlight"):
            yield Static("", id="summary-content")

    def on_mount(self) -> None:
        """Generate summary on mount."""
        self.update_summary()

    def update_summary(self) -> None:
        """Update summary content."""
        summary = self.query_one("#summary-content", Static)

        # Build summary text
        lines = []
        lines.append("📝 [bold]Project Configuration[/bold]\n")

        # Project details
        lines.append(f"  [cyan]Name:[/cyan] {self.config_data['name']}")
        lines.append(
            f"  [cyan]Package Manager:[/cyan] {self.config_data['package_manager']}"
        )
        lines.append(f"  [cyan]Python Version:[/cyan] 3.11\n")

        # Features
        lines.append("🎯 [bold]Features[/bold]\n")
        lines.append(
            f"  [cyan]Database:[/cyan] "
            f"{'✓ Enabled' if self.config_data['use_database'] else '✗ Disabled'}"
        )
        if self.config_data["use_database"]:
            envs = ", ".join(self.config_data["db_environments"])
            lines.append(f"    [dim]Environments: {envs}[/dim]")

        lines.append(
            f"  [cyan]Git:[/cyan] "
            f"{'✓ Enabled' if self.config_data['use_git'] else '✗ Disabled'}"
        )
        if self.config_data["use_git"]:
            lines.append(
                f"    [dim]Commitizen: "
                f"{'✓ Yes' if self.config_data['use_commitizen'] else '✗ No'}[/dim]"
            )

        lines.append(
            f"  [cyan]Makefile:[/cyan] "
            f"{'✓ Enabled' if self.config_data['use_makefile'] else '✗ Disabled'}"
        )

        # Linters
        lines.append("\n🔍 [bold]Code Quality[/bold]\n")
        linters = ", ".join(self.config_data["linters"])
        lines.append(f"  [cyan]Linters:[/cyan] {linters}")

        # Project structure
        lines.append("\n📁 [bold]Project Structure[/bold]\n")
        lines.append("  [dim]FastAPI with Screaming Architecture[/dim]")
        lines.append("  [dim]Clean separation of concerns[/dim]")
        lines.append("  [dim]Ready for production use[/dim]")

        summary.update("\n".join(lines))

    def validate(self) -> bool:
        """Always valid - this is just a summary."""
        return True

    def save_data(self) -> None:
        """Nothing to save - data already collected."""
        pass
