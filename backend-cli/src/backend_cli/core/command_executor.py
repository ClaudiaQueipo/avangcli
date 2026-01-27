import subprocess
from dataclasses import dataclass
from pathlib import Path


@dataclass
class CommandResult:
    return_code: int
    stdout: str
    stderr: str

    @property
    def success(self) -> bool:
        return self.return_code == 0


class CommandExecutor:
    def __init__(self, cwd: Path | None = None):
        self._cwd = cwd or Path.cwd()

    @property
    def cwd(self) -> Path:
        return self._cwd

    def set_cwd(self, cwd: Path) -> None:
        self._cwd = cwd

    def execute(
        self,
        command: str,
        args: list[str] | None = None,
        capture_output: bool = True,
        check: bool = False,
    ) -> CommandResult:
        full_command = [command] + (args or [])

        result = subprocess.run(
            full_command,
            cwd=str(self._cwd),
            capture_output=capture_output,
            text=True,
            check=check,
        )

        return CommandResult(
            return_code=result.returncode,
            stdout=result.stdout if capture_output else "",
            stderr=result.stderr if capture_output else "",
        )

    def execute_with_output(
        self,
        command: str,
        args: list[str] | None = None,
    ) -> CommandResult:
        full_command = [command] + (args or [])

        process = subprocess.Popen(
            full_command,
            cwd=str(self._cwd),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        stdout, stderr = process.communicate()

        return CommandResult(
            return_code=process.returncode,
            stdout=stdout,
            stderr=stderr,
        )

    def execute_interactive(
        self,
        command: str,
        args: list[str] | None = None,
    ) -> int:
        full_command = [command] + (args or [])

        result = subprocess.run(
            full_command,
            cwd=str(self._cwd),
        )

        return result.returncode
