"""Git configuration step."""

from textual.app import ComposeResult
from textual.widgets import Checkbox, Static

from .base_step import BaseStep


class GitStep(BaseStep):
    """Git and commit linting configuration step."""

    title = "Version Control"

    checkbox_ids = ["git-checkbox", "commitizen-checkbox"]

    def compose(self) -> ComposeResult:
        """Compose widgets."""
        yield Static("📚 Version Control", classes="step-title")
        yield Static("Configure Git repository and commit linting", classes="step-description")

        yield Checkbox(
            "Initialize Git repository",
            value=self.config_data.get("use_git", True),
            id="git-checkbox",
        )

        yield Static(
            "Commit Linting (Conventional Commits)",
            classes="static-subtitle",
            id="commitizen-title",
        )

        yield Checkbox(
            "Configure Commitizen and Commitlint for standardized commits",
            value=self.config_data.get("use_commitizen", False),
            id="commitizen-checkbox",
        )

        yield Static(
            "💡 Commitizen helps you write standardized commit messages",
            classes="static-hint",
            id="commitizen-hint",
        )

    def on_mount(self) -> None:
        """Set initial visibility and focus."""
        self.update_commitizen_visibility()
        try:
            first_checkbox = self.query_one(f"#{self.checkbox_ids[0]}")
            first_checkbox.focus()
        except:
            pass

    def on_key(self, event) -> None:
        """Handle key events for navigation."""
        if event.key == "down":
            self.focus_next_checkbox()
            event.prevent_default()
        elif event.key == "up":
            self.focus_previous_checkbox()
            event.prevent_default()

    def focus_next_checkbox(self) -> None:
        """Focus the next checkbox."""
        current = self.app.focused
        if current and hasattr(current, "id") and current.id in self.checkbox_ids:
            index = self.checkbox_ids.index(current.id)
            next_index = (index + 1) % len(self.checkbox_ids)
            next_checkbox = self.query_one(f"#{self.checkbox_ids[next_index]}")
            next_checkbox.focus()

    def focus_previous_checkbox(self) -> None:
        """Focus the previous checkbox."""
        current = self.app.focused
        if current and hasattr(current, "id") and current.id in self.checkbox_ids:
            index = self.checkbox_ids.index(current.id)
            prev_index = (index - 1) % len(self.checkbox_ids)
            prev_checkbox = self.query_one(f"#{self.checkbox_ids[prev_index]}")
            prev_checkbox.focus()

    def on_checkbox_changed(self, event: Checkbox.Changed) -> None:
        """Handle checkbox changes."""
        if event.checkbox.id == "git-checkbox":
            self.update_commitizen_visibility()

            # If git is disabled, also disable commitizen
            if not event.value:
                commitizen_check = self.query_one("#commitizen-checkbox", Checkbox)
                commitizen_check.value = False

    def update_commitizen_visibility(self) -> None:
        """Show/hide commitizen option based on git checkbox."""
        git_check = self.query_one("#git-checkbox", Checkbox)
        commitizen_check = self.query_one("#commitizen-checkbox", Checkbox)
        commitizen_title = self.query_one("#commitizen-title", Static)
        commitizen_hint = self.query_one("#commitizen-hint", Static)

        if git_check.value:
            commitizen_check.display = True
            commitizen_title.display = True
            commitizen_hint.display = True
        else:
            commitizen_check.display = False
            commitizen_title.display = False
            commitizen_hint.display = False

    def save_data(self) -> None:
        """Save git configuration."""
        git_check = self.query_one("#git-checkbox", Checkbox)
        commitizen_check = self.query_one("#commitizen-checkbox", Checkbox)

        self.config_data["use_git"] = git_check.value
        self.config_data["use_commitizen"] = commitizen_check.value if git_check.value else False
