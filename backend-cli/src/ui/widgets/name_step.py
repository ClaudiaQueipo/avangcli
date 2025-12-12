"""Project name input step."""

from pathlib import Path

from textual.app import ComposeResult
from textual.widgets import Input, Static

from ...core.validators import ProjectValidator
from .base_step import BaseStep


class NameStep(BaseStep):
    """Project name configuration step."""

    title = "Project Name"

    def __init__(self, config_data: dict):
        """Initialize name step."""
        super().__init__(config_data)
        self.validator = ProjectValidator()

    def compose(self) -> ComposeResult:
        """Compose widgets."""
        yield Static("📝 Project Name", classes="step-title")
        yield Static(
            "Enter a name for your FastAPI project (snake_case recommended)",
            classes="step-description",
        )

        yield Input(
            placeholder="my_awesome_project",
            value=self.config_data.get("name", ""),
            id="project-name-input",
        )

        yield Static("", id="error-message")
        yield Static("", id="validation-message")

    def on_input_changed(self, event: Input.Changed) -> None:
        """Handle input changes with live validation."""
        if event.input.id == "project-name-input":
            name = event.value.strip()
            self.clear_error()

            if not name:
                return

            # Try to normalize
            try:
                normalized = self.validator.normalize_project_name(name)

                # Validate normalized name
                self.validator.validate_project_name(normalized)

                # Show success
                validation_msg = self.query_one("#validation-message", Static)
                if normalized != name:
                    validation_msg.update(f"✓ Will be normalized to: {normalized}")
                    validation_msg.add_class("validation-warning")
                else:
                    validation_msg.update("✓ Valid project name")
                    validation_msg.add_class("validation-success")

                event.input.add_class("-valid")
                event.input.remove_class("-invalid")

            except Exception as e:
                # Show error
                validation_msg = self.query_one("#validation-message", Static)
                validation_msg.update(f"❌ {str(e)}")
                validation_msg.add_class("validation-error")

                event.input.add_class("-invalid")
                event.input.remove_class("-valid")

    def validate(self) -> bool:
        """Validate project name."""
        name_input = self.query_one("#project-name-input", Input)
        name = name_input.value.strip()

        if not name:
            self.show_error("Project name cannot be empty")
            return False

        try:
            normalized = self.validator.normalize_project_name(name)
            self.validator.validate_project_name(normalized)
            self.validator.validate_project_path(Path(normalized))
            return True
        except Exception as e:
            self.show_error(str(e))
            return False

    def save_data(self) -> None:
        """Save project name."""
        name_input = self.query_one("#project-name-input", Input)
        name = name_input.value.strip()
        normalized = self.validator.normalize_project_name(name)
        self.config_data["name"] = normalized
