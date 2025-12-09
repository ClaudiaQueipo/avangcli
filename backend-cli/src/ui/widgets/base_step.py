"""Base class for setup steps."""

from textual.containers import Container
from textual.widgets import Static


class BaseStep(Container):
    """Base class for all setup steps."""

    title: str = "Step"

    def __init__(self, config_data: dict):
        """
        Initialize step.

        Args:
            config_data: Shared configuration data dictionary
        """
        super().__init__()
        self.config_data = config_data

    def compose(self):
        """Compose step widgets - to be overridden."""
        yield Static(f"{self.title} - Override compose() method")

    def validate(self) -> bool:
        """
        Validate step data before proceeding.

        Returns:
            True if validation passed, False otherwise
        """
        return True

    def save_data(self) -> None:
        """Save step data to config_data - to be overridden."""
        pass

    def show_error(self, message: str) -> None:
        """
        Show validation error message.

        Args:
            message: Error message to display
        """
        # Try to find error label, if exists
        try:
            error_label = self.query_one("#error-message", Static)
            error_label.update(f"❌ {message}")
            error_label.add_class("validation-error")
        except Exception:
            # If no error label, we could add one dynamically
            pass

    def clear_error(self) -> None:
        """Clear error message."""
        try:
            error_label = self.query_one("#error-message", Static)
            error_label.update("")
            error_label.remove_class("validation-error")
        except Exception:
            pass
