"""Database configuration step."""

from textual.app import ComposeResult
from textual.containers import Horizontal
from textual.widgets import Checkbox, RadioButton, RadioSet, Static

from avangcli.ui.widgets.base_step import BaseStep


class DatabaseStep(BaseStep):
    """Database configuration step."""

    title = "Database Configuration"

    def compose(self) -> ComposeResult:
        """Compose widgets."""
        yield Static(
            "🗄️  Database Configuration",
            classes="step-title"
        )
        yield Static(
            "Configure database support with Docker",
            classes="step-description"
        )

        yield Checkbox(
            "Enable database support (PostgreSQL with Docker)",
            value=self.config_data.get("use_database", False),
            id="database-checkbox"
        )

        yield Static(
            "Docker Environments",
            classes="static-subtitle",
            id="env-title"
        )

        with RadioSet(id="db-environments-radio"):
            yield RadioButton("Development only", value="dev")
            yield RadioButton("Production only", value="prod")
            yield RadioButton("Both Development and Production", value="both")

        yield Static(
            "💡 Docker configuration will be generated for selected environments",
            classes="static-hint"
        )

    def on_mount(self) -> None:
        """Set default values and visibility."""
        self.update_environments_visibility()

        # Set default environment selection
        radio_set = self.query_one("#db-environments-radio", RadioSet)
        db_envs = self.config_data.get("db_environments", [])

        if "dev" in db_envs and "prod" in db_envs:
            radio_set.pressed_index = 2
        elif "dev" in db_envs:
            radio_set.pressed_index = 0
        elif "prod" in db_envs:
            radio_set.pressed_index = 1
        else:
            radio_set.pressed_index = 2  # Default to both

    def on_checkbox_changed(self, event: Checkbox.Changed) -> None:
        """Handle database checkbox changes."""
        if event.checkbox.id == "database-checkbox":
            self.update_environments_visibility()

    def update_environments_visibility(self) -> None:
        """Show/hide environment options based on database checkbox."""
        checkbox = self.query_one("#database-checkbox", Checkbox)
        radio_set = self.query_one("#db-environments-radio", RadioSet)
        env_title = self.query_one("#env-title", Static)

        if checkbox.value:
            radio_set.display = True
            env_title.display = True
        else:
            radio_set.display = False
            env_title.display = False

    def save_data(self) -> None:
        """Save database configuration."""
        checkbox = self.query_one("#database-checkbox", Checkbox)
        self.config_data["use_database"] = checkbox.value

        if checkbox.value:
            radio_set = self.query_one("#db-environments-radio", RadioSet)
            selected = radio_set.pressed_button

            if selected:
                if selected.value == "dev":
                    self.config_data["db_environments"] = ["dev"]
                elif selected.value == "prod":
                    self.config_data["db_environments"] = ["prod"]
                else:  # both
                    self.config_data["db_environments"] = ["dev", "prod"]
        else:
            self.config_data["db_environments"] = []
