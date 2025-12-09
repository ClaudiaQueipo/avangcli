"""Custom exceptions for AvangCLI Backend."""


class AvangCLIError(Exception):
    """Base exception for all AvangCLI errors."""

    def __init__(self, message: str, suggestion: str | None = None):
        self.message = message
        self.suggestion = suggestion
        super().__init__(self.message)


class DependencyNotFoundError(AvangCLIError):
    """Raised when a required system dependency is not found."""

    pass


class InvalidProjectNameError(AvangCLIError):
    """Raised when the project name is invalid."""

    pass


class ProjectAlreadyExistsError(AvangCLIError):
    """Raised when the project directory already exists."""

    pass


class ValidationError(AvangCLIError):
    """Raised when validation fails."""

    pass
