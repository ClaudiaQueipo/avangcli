"""Module generation command for AvangCLI Backend."""

import os
from pathlib import Path

import typer
from rich.console import Console

from ..core.config import MODULE_TEMPLATES_DIR
from ..models.project_config import ProjectConfig

console = Console()


def is_fastapi_project(project_dir: Path) -> bool:
    """Check if the current directory is a valid FastAPI project."""
    # Check for app/main.py
    main_file = project_dir / "app" / "main.py"
    if not main_file.exists():
        return False

    # Check for pyproject.toml with fastapi
    pyproject_file = project_dir / "pyproject.toml"
    if pyproject_file.exists():
        content = pyproject_file.read_text()
        if "fastapi" not in content.lower():
            return False

    return True


def generate_module(module_name: str, use_database: bool) -> None:
    """Generate a new module with boilerplate code."""
    project_dir = Path.cwd()

    if not is_fastapi_project(project_dir):
        console.print("[red]Error: Not in a valid FastAPI project directory.[/red]")
        console.print("Make sure you're in the root of a FastAPI project with app/main.py")
        raise typer.Exit(1)

    # Create module directory
    module_dir = project_dir / "app" / "modules" / module_name
    module_dir.mkdir(parents=True, exist_ok=True)

    # Create __init__.py
    (module_dir / "__init__.py").touch()

    # Generate files
    context = {
        "module_name": module_name,
        "use_database": use_database,
    }

    # Generate schemas.py
    schemas_content = _render_template("schemas.py.jinja", context)
    (module_dir / "schemas.py").write_text(schemas_content)

    # Generate routes.py
    routes_content = _render_template("routes.py.jinja", context)
    (module_dir / "routes.py").write_text(routes_content)

    # Generate services.py
    services_content = _render_template("services.py.jinja", context)
    (module_dir / "services.py").write_text(services_content)

    # Generate helpers.py
    helpers_content = _render_template("helpers.py.jinja", context)
    (module_dir / "helpers.py").write_text(helpers_content)

    # Generate models.py if database
    if use_database:
        models_content = _render_template("models.py.jinja", context)
        (module_dir / "models.py").write_text(models_content)

    # Update main.py to include the router
    _update_main_py(project_dir, module_name)

    console.print(f"[green]✓ Module '{module_name}' created successfully![/green]")


def _render_template(template_name: str, context: dict) -> str:
    """Render a Jinja2 template."""
    from jinja2 import Environment, FileSystemLoader

    jinja_env = Environment(
        loader=FileSystemLoader(str(MODULE_TEMPLATES_DIR)),
        trim_blocks=True,
        lstrip_blocks=True,
    )
    template = jinja_env.get_template(template_name)
    return template.render(**context)


def _update_main_py(project_dir: Path, module_name: str) -> None:
    """Update main.py to include the new module router."""
    main_file = project_dir / "app" / "main.py"
    content = main_file.read_text()

    # Add import
    import_line = f"from app.modules.{module_name}.routes import router as {module_name}_router\n"
    if import_line not in content:
        # Find the last import
        lines = content.splitlines()
        last_import_idx = -1
        for i, line in enumerate(lines):
            if line.startswith("from ") or line.startswith("import "):
                last_import_idx = i

        if last_import_idx >= 0:
            lines.insert(last_import_idx + 1, import_line)
        else:
            lines.insert(0, import_line)

    # Add include_router
    include_line = f'app.include_router({module_name}_router, prefix="/api/v1/{module_name}", tags=["{module_name}"])\n'
    if include_line not in content:
        # Find where routers are included
        include_idx = -1
        for i, line in enumerate(lines):
            if "include_router" in line:
                include_idx = i

        if include_idx >= 0:
            lines.insert(include_idx + 1, include_line)
        else:
            # Add after app = FastAPI(...)
            app_idx = -1
            for i, line in enumerate(lines):
                if "app = FastAPI" in line:
                    app_idx = i
            if app_idx >= 0:
                # Find the end of the FastAPI block
                bracket_count = 0
                for j in range(app_idx, len(lines)):
                    bracket_count += lines[j].count("(") - lines[j].count(")")
                    if bracket_count == 0 and ")" in lines[j]:
                        lines.insert(j + 1, "")
                        lines.insert(j + 2, "# Include routers")
                        lines.insert(j + 3, include_line)
                        break

    # Write back
    main_file.write_text("\n".join(lines))


app = typer.Typer()


def module(
    name: str = typer.Argument(..., help="Name of the module to create"),
) -> None:
    """
    Generate a new FastAPI module with boilerplate code.

    This command creates a complete module structure including schemas, routes,
    services, and helpers. The module router is automatically added to the main app.
    """
    # Check if database is configured
    project_dir = Path.cwd()
    use_database = False
    if (project_dir / "app" / "database.py").exists():
        use_database = True

    generate_module(name, use_database)
