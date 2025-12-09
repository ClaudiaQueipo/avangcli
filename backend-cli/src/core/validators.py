"""Validators for system dependencies and project configuration."""

import keyword
import re
import subprocess
from pathlib import Path

from ..core.exceptions import (
    DependencyNotFoundError,
    InvalidProjectNameError,
    ProjectAlreadyExistsError,
)


class DependencyValidator:
    """Validates system dependencies."""

    @staticmethod
    def check_command(command: str, args: list[str] | None = None) -> tuple[bool, str]:
        """
        Check if a command is available in the system.

        Args:
            command: The command to check
            args: Arguments to pass to the command (default: ["--version"])

        Returns:
            Tuple of (is_available, output)
        """
        if args is None:
            args = ["--version"]

        try:
            result = subprocess.run(
                [command, *args],
                capture_output=True,
                text=True,
                timeout=5,
            )
            return result.returncode == 0, result.stdout.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError):
            return False, ""

    def validate_package_manager(self, manager: str) -> None:
        """
        Validate that the selected package manager is installed.

        Args:
            manager: Package manager name ("poetry" or "uv")

        Raises:
            DependencyNotFoundError: If package manager is not installed
        """
        is_available, version = self.check_command(manager)

        if not is_available:
            install_instructions = {
                "poetry": "https://python-poetry.org/docs/#installation",
                "uv": "https://docs.astral.sh/uv/getting-started/installation/",
            }
            raise DependencyNotFoundError(
                f"{manager} is not installed",
                suggestion=f"Install {manager}: {install_instructions.get(manager, '')}",
            )

    def validate_docker(self) -> tuple[bool, str]:
        """
        Validate that Docker is installed and running.

        Returns:
            Tuple of (is_available, message)
        """
        # Check if Docker is installed
        is_installed, version = self.check_command("docker")
        if not is_installed:
            return False, "Docker is not installed"

        # Check if Docker daemon is running
        is_running, _ = self.check_command("docker", ["ps"])
        if not is_running:
            return False, "Docker is installed but the daemon is not running"

        return True, f"Docker is available: {version}"

    def validate_git(self) -> tuple[bool, str]:
        """
        Validate that Git is installed.

        Returns:
            Tuple of (is_available, version)
        """
        is_available, version = self.check_command("git")
        if not is_available:
            return False, "Git is not installed"

        return True, version


class ProjectValidator:
    """Validates project configuration."""

    # Valid Python identifier pattern (snake_case preferred)
    VALID_NAME_PATTERN = re.compile(r"^[a-z][a-z0-9_]*$")

    @staticmethod
    def validate_project_name(name: str) -> None:
        """
        Validate that the project name is a valid Python identifier.

        Args:
            name: Project name to validate

        Raises:
            InvalidProjectNameError: If name is invalid
        """
        if not name:
            raise InvalidProjectNameError(
                "Project name cannot be empty",
                suggestion="Provide a valid project name in snake_case format",
            )

        # Check if it's a Python keyword
        if keyword.iskeyword(name):
            raise InvalidProjectNameError(
                f"'{name}' is a Python keyword and cannot be used as a project name",
                suggestion="Choose a different name",
            )

        # Check if it matches the valid pattern
        if not ProjectValidator.VALID_NAME_PATTERN.match(name):
            raise InvalidProjectNameError(
                f"'{name}' is not a valid project name",
                suggestion=(
                    "Project name must start with a lowercase letter and contain only "
                    "lowercase letters, numbers, and underscores (snake_case)"
                ),
            )

        # Check length
        if len(name) > 100:
            raise InvalidProjectNameError(
                "Project name is too long (max 100 characters)",
                suggestion="Choose a shorter name",
            )

    @staticmethod
    def validate_project_path(path: Path) -> None:
        """
        Validate that the project path doesn't already exist.

        Args:
            path: Path to validate

        Raises:
            ProjectAlreadyExistsError: If directory already exists
        """
        if path.exists():
            raise ProjectAlreadyExistsError(
                f"Directory '{path}' already exists",
                suggestion="Choose a different project name or remove the existing directory",
            )

    @staticmethod
    def normalize_project_name(name: str) -> str:
        """
        Normalize project name to snake_case.

        Args:
            name: Project name to normalize

        Returns:
            Normalized project name
        """
        # Replace hyphens and spaces with underscores
        normalized = name.replace("-", "_").replace(" ", "_")

        # Convert to lowercase
        normalized = normalized.lower()

        # Remove any invalid characters
        normalized = re.sub(r"[^a-z0-9_]", "", normalized)

        # Ensure it starts with a letter
        if normalized and not normalized[0].isalpha():
            normalized = "project_" + normalized

        return normalized
