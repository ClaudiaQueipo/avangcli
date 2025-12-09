"""Linter/formatter selection step."""

from textual.app import ComposeResult
from textual.widgets import Checkbox, Static

from avangcli.ui.widgets.base_step import BaseStep


class LinterStep(BaseStep):
    """Linter and formatter selection step."""

    title = "Code Quality Tools"

    def compose(self) -> ComposeResult:
        """Compose widgets."""
        yield Static(
            "🔍 Code Quality Tools",
            classes="step-title"
        )
        yield Static(
            "Select linters and formatters for your project",
            classes="step-description"
        )

        current_linters = self.config_data.get("linters", ["ruff"])

        yield Checkbox(
            "Ruff (recommended - fast, all-in-one linter and formatter)",
            value="ruff" in current_linters,
            id="linter-ruff"
        )
        yield Checkbox(
            "Black (opinionated code formatter)",
            value="black" in current_linters,
            id="linter-black"
        )
        yield Checkbox(
            "Flake8 (traditional Python linter)",
            value="flake8" in current_linters,
            id="linter-flake8"
        )

        yield Static("", id="warning-message", classes="validation-warning")
        yield Static(
            "💡 Ruff is recommended as it combines linting and formatting in one tool",
            classes="static-hint"
        )

    def on_checkbox_changed(self, event: Checkbox.Changed) -> None:
        """Handle linter checkbox changes."""
        # Check if both Ruff and Black are selected
        ruff_check = self.query_one("#linter-ruff", Checkbox)
        black_check = self.query_one("#linter-black", Checkbox)
        warning = self.query_one("#warning-message", Static)

        if ruff_check.value and black_check.value:
            warning.update(
                "⚠️  Both Ruff and Black selected. Ruff includes formatting - you may not need Black."
            )
        else:
            warning.update("")

    def validate(self) -> bool:
        """Validate that at least one linter is selected."""
        ruff_check = self.query_one("#linter-ruff", Checkbox)
        black_check = self.query_one("#linter-black", Checkbox)
        flake8_check = self.query_one("#linter-flake8", Checkbox)

        if not (ruff_check.value or black_check.value or flake8_check.value):
            self.show_error("Please select at least one linter/formatter")
            return False

        return True

    def save_data(self) -> None:
        """Save linter selections."""
        ruff_check = self.query_one("#linter-ruff", Checkbox)
        black_check = self.query_one("#linter-black", Checkbox)
        flake8_check = self.query_one("#linter-flake8", Checkbox)

        linters = []
        if ruff_check.value:
            linters.append("ruff")
        if black_check.value:
            linters.append("black")
        if flake8_check.value:
            linters.append("flake8")

        self.config_data["linters"] = linters
