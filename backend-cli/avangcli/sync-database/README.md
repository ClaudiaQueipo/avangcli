# Create PostgreSQL Database with Aurora

This service is a tool that facilitates the creation of tables structure in PostgreSQL.

AWS Official Documentation describe Amazon Aurora as follows: [(User Guide for Aurora/ What is Amazon Aurora?)](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html)

> Amazon Aurora (Aurora) is a fully managed relational database engine that's compatible with MySQL and PostgreSQL.

> Aurora includes a high-performance storage subsystem. Its MySQL- and PostgreSQL-compatible database engines are customized to take advantage of that fast distributed storage.

**This service**:

1. Create the tables structure for Aurora Database with PostgreSQL, and all the necessary migrations in the DB squema.

## 1. Installation

The following steps outline the procedure for installing this service in a local environment. You may need to adjust these steps based on your specific environment or platform.

This service is configurable by environment variables. You can define them on your execution environment or simple use a `.env` to define them.

**Follow these steps to install locally**:

1. Install [Task](https://taskfile.dev): It's a task runner/build tool.
2. Install [pyenv](https://github.com/pyenv/pyenv): It lets you easily switch between multiple versions of Python.
3. Install [Poetry](https://python-poetry.org/): It's a tool for dependency management and packaging in Python.
4. Create a copy of `.env_example` as `.env` and edit it with correct values.

**Notes:**

* `.env_example` file contains a minimal configuration to be able to run. You can see all available values of configuration at `app/settings.py` module.
* Docker provides a container to simulate PostgreSQL locally. See: [postgres](https://hub.docker.com/_/postgres). You should configure `DB_PG_CONNECTION_STR` with correct value to reference local PostgreSQL.

### Requirements

Following are global requirements for the solution:

* **Python 3.10.0**: This service has been developed and tested using [Python 3.10.0](https://www.python.org/downloads/release/python-3100/) as base programming language.
* **PostgreSQL Database**: *PostgreSQL is a powerful, open source object-relational database system that uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads*. ([About/What is PostgreSQL?](https://www.postgresql.org/about/)). This service uses `PostgreSQL` as an object-relational database system.
* **Others**: You can see more specific requirements at [pyproject.toml](./pyproject.toml) file.

## 2. Usage

Following usages use [Task](https://taskfile.dev). See [Taskfile.yml](./Taskfile.yml) to see details about their execution.

### 2.1 Interaction with PostgreSQL via Alembic using Makefile

The Makefile can be used for the corresponding actions that are executed with Alembic, for working with PostgreSQL:

```makefile
upgrade:  ## RUN all database migrations.
	alembic upgrade head

history:  ## LIST applied migrations history.
	alembic history

reset:  ## RESET all database migrations.
	alembic downgrade base

downgrade:  ## DOWNGRADE database migrations to specific version
	alembic downgrade $(revision)

autogenerate:  ## Autogenerate migration
	alembic revision --autogenerate -m $(comment)

merge:  ## Merge heads
	alembic merge heads
```

### 2.2 Aurora with PostgreSQL Database

This service is used to create database structure in `Amazon Aurora` at AWS platform.

### 2.3 Execute tests

Execute tests using [pytest](https://docs.pytest.org/):

```bash
task venv_update tests
```
