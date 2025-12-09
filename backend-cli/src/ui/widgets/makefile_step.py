"""Makefile configuration step."""

from textual.app import ComposeResult
from textual.widgets import Checkbox, Static

from .base_step import BaseStep


class MakefileStep(BaseStep):
    """Makefile generation step."""

    title = "Development Tools"

    def compose(self) -> ComposeResult:
        """Compose widgets."""
        yield Static(
            "🛠️  Development Tools",
            classes="step-title"
        )
        yield Static(
            "Configure development convenience tools",
            classes="step-description"
        )

        yield Checkbox(
            "Generate Makefile with convenient commands",
            value=self.config_data.get("use_makefile", True),
            id="makefile-checkbox"
        )

        yield Static(
            "The Makefile will include commands for:",
            classes="static-subtitle"
        )

        yield Static(
            "  • Installing dependencies\n"
            "  • Running the development server\n"
            "  • Running tests\n"
            "  • Code formatting and linting\n"
            "  • Docker operations (if enabled)",
            classes="static-hint"
        )

    def save_data(self) -> None:
        """Save makefile configuration."""
        makefile_check = self.query_one("#makefile-checkbox", Checkbox)
        self.config_data["use_makefile"] = makefile_check.value
