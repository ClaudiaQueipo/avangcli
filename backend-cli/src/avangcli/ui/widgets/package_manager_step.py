"""Package manager selection step."""

from textual.app import ComposeResult
from textual.widgets import RadioButton, RadioSet, Static

from avangcli.ui.widgets.base_step import BaseStep


class PackageManagerStep(BaseStep):
    """Package manager selection step."""

    title = "Package Manager"

    def compose(self) -> ComposeResult:
        """Compose widgets."""
        yield Static(
            "📦 Package Manager",
            classes="step-title"
        )
        yield Static(
            "Choose your preferred Python package manager",
            classes="step-description"
        )

        with RadioSet(id="package-manager-radio"):
            yield RadioButton("UV (recommended - faster, modern)", value="uv")
            yield RadioButton("Poetry (traditional, mature)", value="poetry")

        yield Static(
            "💡 UV is a modern, fast package manager built in Rust",
            classes="static-hint"
        )

    def on_mount(self) -> None:
        """Set default selection on mount."""
        radio_set = self.query_one("#package-manager-radio", RadioSet)
        current = self.config_data.get("package_manager", "uv")

        # Set pressed based on current value
        for idx, button in enumerate(radio_set.query(RadioButton)):
            if button.value == current:
                radio_set.pressed_index = idx
                break

    def save_data(self) -> None:
        """Save package manager selection."""
        radio_set = self.query_one("#package-manager-radio", RadioSet)
        selected = radio_set.pressed_button

        if selected:
            self.config_data["package_manager"] = selected.value
