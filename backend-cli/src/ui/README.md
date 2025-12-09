# AvangCLI UI Components

This directory contains the user interface components for AvangCLI, including both the modern Textual TUI and the classic Rich-based prompts.

## Architecture

### Textual TUI (Default)

The Textual-based interface provides an interactive, widget-driven experience with a custom green color palette.

**Components:**

- `textual_app.py` - Main Textual application and setup screen
- `theme.tcss` - Textual CSS theme with green color palette
- `widgets/` - Individual step widgets for the setup flow
  - `base_step.py` - Base class for all step widgets
  - `name_step.py` - Project name configuration
  - `package_manager_step.py` - Package manager selection
  - `database_step.py` - Database configuration
  - `linter_step.py` - Code quality tools selection
  - `git_step.py` - Git and commit linting setup
  - `makefile_step.py` - Makefile generation option
  - `summary_step.py` - Configuration review and confirmation

**Color Palette:**

- Primary: `#00ff87` (Bright green)
- Secondary: `#10b981` (Emerald green)
- Accent: `#34d399` (Light emerald)
- Success: `#22c55e` (Green)
- Background: `#0f172a` (Dark blue)
- Surface: `#1e293b` (Dark slate)

### Classic Rich Prompts (Fallback)

The classic interface uses Rich prompts and is automatically used in:
- Non-interactive terminals (CI/CD)
- When `--classic` flag is used
- When `AVANGCLI_CLASSIC_UI` environment variable is set

**Components:**

- `prompts.py` - Interactive prompt-based setup
- `messages.py` - Utility functions for printing formatted messages

## Usage

### Using the Textual TUI (default)

```bash
avangcli init
```

### Using the Classic UI

```bash
# Via flag
avangcli init --classic

# Via environment variable
export AVANGCLI_CLASSIC_UI=1
avangcli init
```

## Development

### Testing the TUI

The TUI can be tested in development mode:

```bash
uv run avangcli init
```

### Customizing the Theme

Edit `theme.tcss` to customize colors, spacing, and widget styles. The theme follows Textual's CSS syntax.

### Adding New Steps

1. Create a new widget in `widgets/` inheriting from `BaseStep`
2. Implement `compose()`, `validate()`, and `save_data()` methods
3. Add the step to the `steps` list in `SetupScreen.__init__()`

Example:

```python
from textual.app import ComposeResult
from textual.widgets import Static, Checkbox
from avangcli.ui.widgets.base_step import BaseStep

class MyNewStep(BaseStep):
    title = "My Feature"

    def compose(self) -> ComposeResult:
        yield Static("Configure my feature", classes="step-title")
        yield Checkbox("Enable my feature", id="my-feature-checkbox")

    def validate(self) -> bool:
        return True

    def save_data(self) -> None:
        checkbox = self.query_one("#my-feature-checkbox", Checkbox)
        self.config_data["my_feature"] = checkbox.value
```

## Features

### Live Validation

Input fields provide real-time validation feedback with color-coded borders and messages.

### Navigation

- **Next/Back buttons**: Navigate between steps
- **Keyboard shortcuts**: Use Tab/Shift+Tab to navigate, Enter to activate
- **Smart state**: Back button is disabled on first step, Next becomes "Create Project" on final step

### Responsive Layout

The TUI adapts to terminal size and gracefully handles resize events.

### Accessibility

- Full keyboard navigation
- Screen reader friendly (when using classic mode)
- High contrast green theme for visibility
