"""Init command for creating new FastAPI projects."""

import typer
from rich.console import Console
from typing_extensions import Annotated

from avangcli.ui.messages import confirm_action, print_config_summary, print_next_steps
from avangcli.ui.prompts import ProjectSetupPrompt

console = Console()


def main(
    project_name: Annotated[
        str, typer.Argument(help="Name of the project to create")
    ] = None,
) -> None:
    """
    Initialize a new FastAPI backend project.

    This command will guide you through an interactive setup process to create
    a new FastAPI project with your preferred configuration.
    """
    try:
        # Run interactive setup
        prompt = ProjectSetupPrompt()
        config = prompt.run_interactive_setup(project_name=project_name)

        # Show configuration summary
        print_config_summary(config.model_dump_template_context())

        # Confirm before generating
        if not confirm_action("Continue with project generation?", default=True):
            console.print("\n[yellow]Project generation cancelled.[/yellow]")
            raise typer.Exit(0)

        # TODO: Generate project (FASE 4 & 5)
        console.print("\n[bold green]Project configuration saved![/bold green]")
        console.print(
            "[yellow]Project generation will be implemented in the next phases.[/yellow]\n"
        )

        # Show next steps (will be real after generation)
        print_next_steps(config.name, config.use_makefile)

    except KeyboardInterrupt:
        console.print("\n\n[yellow]Operation cancelled by user.[/yellow]")
        raise typer.Exit(1)
    except Exception as e:
        console.print(f"\n[bold red]Error:[/bold red] {str(e)}")
        raise typer.Exit(1)
