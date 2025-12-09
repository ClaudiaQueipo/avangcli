# AvangCLI Backend

CLI tool to generate and manage FastAPI backend projects following Screaming Architecture principles.

## Installation

This project uses **UV** as the package manager.

```bash
# Install with UV
uv sync

# Or install in editable mode
uv pip install -e .
```

## Development

```bash
# Sync dependencies (including dev dependencies)
uv sync

# Run tests
uv run pytest

# Run linter
uv run ruff check .

# Format code
uv run ruff format .
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
