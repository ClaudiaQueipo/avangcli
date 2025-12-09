# AvangCLI Backend

CLI tool to generate and manage FastAPI backend projects following Screaming Architecture principles.

## Installation

```bash
# Using UV (recommended)
uv pip install -e .

# Using pip
pip install -e .
```

## Development

```bash
# Install development dependencies
uv pip install -e ".[dev]"

# Run tests
pytest

# Run linter
ruff check .

# Format code
ruff format .
```

## Usage

```bash
# Initialize a new FastAPI project
avangcli init

# Show version
avangcli --version

# Show help
avangcli --help
```

## Features

- Interactive project setup
- Screaming Architecture structure
- Support for Poetry and UV package managers
- Optional database configuration with Docker
- Linter/formatter setup (Ruff, Black, Flake8)
- Git initialization
- Makefile generation with useful commands

## Project Structure

Generated projects follow Screaming Architecture principles with FastAPI best practices.
