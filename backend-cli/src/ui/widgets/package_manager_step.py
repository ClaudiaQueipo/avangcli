"""Package manager selection step."""

from textual.app import ComposeResult
from textual.widgets import RadioButton, RadioSet, Static

from .base_step import BaseStep
from .database_step import NavigableRadioSet


class PackageManagerStep(BaseStep):
    """Package manager selection step."""

    title = "Package Manager"

    def compose(self) -> ComposeResult:
        """Compose widgets."""
        yield Static("📦 Package Manager", classes="step-title")
        yield Static("Choose your preferred Python package manager", classes="step-description")

        with NavigableRadioSet(id="package-manager-radio"):
            yield RadioButton("UV (recommended - faster, modern)", id="radio-uv")
            yield RadioButton("Poetry (traditional, mature)", id="radio-poetry")

        yield Static("💡 UV is a modern, fast package manager built in Rust", classes="static-hint")

    def on_mount(self) -> None:
        """Set default selection on mount."""
        current = self.config_data.get("package_manager", "uv")

        # Toggle the appropriate button based on current value
        button_id = f"radio-{current}"
        try:
            button = self.query_one(f"#{button_id}", RadioButton)
            button.toggle()
        except Exception:
            # Default to UV if button not found
            try:
                button = self.query_one("#radio-uv", RadioButton)
                button.toggle()
            except Exception:
                pass

    def save_data(self) -> None:
        """Save package manager selection."""
        radio_set = self.query_one("#package-manager-radio", RadioSet)
        selected = radio_set.pressed_button

        if selected:
            # Extract value from button ID (radio-uv -> uv, radio-poetry -> poetry)
            button_id = selected.id
            if button_id:
                value = button_id.replace("radio-", "")
                self.config_data["package_manager"] = value
