
import os
import shutil
import subprocess
from pathlib import Path

# Folders to copy
FOLDERS_TO_COPY = [
    'core',
    'sync-database',
    'db-declarative'
]


def create_env_from_example(project_path):
    """
    Create .env from .env_example if it exists
    """
    project_path = Path(project_path)
    env_example = project_path / ".env_example"
    env_file = project_path / ".env"

    # Check if .env_example exists
    if not env_example.exists():
        return False

    # Check if .env exists
    if env_file.exists():
        return False

    try:
        # Copy .env_example to .env
        shutil.copy2(env_example, env_file)
        print(f"✅ .env file created successfully in : {project_path}")
        return True

    except Exception as e:
        print(f"❌ Error to create .env file: {e}")
        return False

def setup_poetry_venv(project_dir: Path) -> bool:
    """
    Define the virtual environment and install dependencies for specified rute
    """
    try:
        if (project_dir / "pyproject.toml").exists():
            env = os.environ.copy()
            env.pop('VIRTUAL_ENV', None)

            print(f"✅ Creating venv for: {Path(project_dir).name}")

            subprocess.run([
                "poetry", "config", "virtualenvs.in-project", "true", "--local"
            ], cwd=project_dir, env=env, check=True)

            subprocess.run([
                "poetry", "install"
            ], cwd=project_dir, env=env, check=True)

            print(f"✅ Venv created for: {Path(project_dir).name}")
            return True

    except Exception as e:
        print(f"❌ Error creating venv: {e}")
        return False


def create_project(project_name: str) -> bool:
    """
    Create a folder with the project name
    """
    try:
        # Get current directory
        current_dir = Path.cwd()
        project_dir = current_dir / project_name

        # Check if the project folder already exists
        if project_dir.exists():
            print(f"Error: Already exists a folder called '{project_name}'")
            return False

        # Create project folder
        project_dir.mkdir()
        print(f"Folder '{project_name}' created successfully!")

        # Get the path of the package
        package_base = Path(__file__).parent.parent.parent.parent

        for folder in FOLDERS_TO_COPY:
            src_path = package_base / folder
            dst_path = project_dir / folder

            if src_path.exists():
                shutil.copytree(src_path, dst_path)
                print(f"Folder '{folder}' copied successfully!")
                create_env_from_example(dst_path)
            else:
                print(f"Warning: Folder '{folder}' not found in {src_path}")

        for folder in FOLDERS_TO_COPY:
            dst_path = project_dir / folder
            venv_created = setup_poetry_venv(dst_path)

        print(f"Project folder: {project_dir} generated successfully!")
        return True

    except Exception as e:
        print(f"Error: {e}")
        return False



