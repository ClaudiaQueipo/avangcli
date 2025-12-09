"""Help screen with keyboard shortcuts."""

from textual.app import ComposeResult
from textual.containers import Container, Vertical
from textual.screen import ModalScreen
from textual.widgets import Button, Static


class HelpScreen(ModalScreen):
    """Modal screen showing keyboard shortcuts and help."""

    CSS = """
    HelpScreen {
        align: center middle;
    }

    #help-dialog {
        width: 70;
        height: auto;
        background: $surface;
        border: thick $primary;
        padding: 2;
    }

    #help-title {
        color: $primary;
        text-style: bold;
        text-align: center;
        margin: 0 0 1 0;
    }

    #help-content {
        color: $text-primary;
        margin: 1 0;
    }

    #help-close-btn {
        width: 100%;
        margin: 1 0 0 0;
    }
    """

    def compose(self) -> ComposeResult:
        """Compose the help screen."""
        with Container(id="help-dialog"):
            yield Static("⌨️  Keyboard Shortcuts", id="help-title")

            help_content = """
[bold cyan]Navigation:[/bold cyan]
  [yellow]Enter[/yellow] or [yellow]Ctrl+N[/yellow]       → Next step
  [yellow]Escape[/yellow] or [yellow]Ctrl+B[/yellow]     → Previous step
  [yellow]Tab[/yellow]                    → Next widget
  [yellow]Shift+Tab[/yellow]              → Previous widget

[bold cyan]Widget Actions:[/bold cyan]
  [yellow]Space[/yellow]                  → Toggle checkbox/radio button
  [yellow]Arrow Keys[/yellow]             → Navigate radio options
  [yellow]Enter[/yellow]                  → Activate focused button

[bold cyan]Input Fields:[/bold cyan]
  [yellow]Ctrl+A[/yellow]                 → Select all text
  [yellow]Ctrl+K[/yellow]                 → Delete to end of line
  [yellow]Home/End[/yellow]               → Move to start/end

[bold cyan]Application:[/bold cyan]
  [yellow]Ctrl+C[/yellow] or [yellow]Ctrl+Q[/yellow]    → Quit (cancel setup)
  [yellow]F1[/yellow]                     → Show this help

[dim]Tip: You can navigate the entire setup using only the keyboard![/dim]
"""
            yield Static(help_content, id="help-content")
            yield Button("Close (Press Escape)", id="help-close-btn", variant="primary")

    def on_button_pressed(self, event: Button.Pressed) -> None:
        """Handle close button press."""
        self.dismiss()

    def on_key(self, event) -> None:
        """Handle any key press to close."""
        if event.key == "escape" or event.key == "enter":
            self.dismiss()
