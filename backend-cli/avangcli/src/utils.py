from pathlib import Path
import json


def read_json_file(file_path: Path | str) -> dict:

    if isinstance(file_path, str):
        file_path = Path(file_path)

    with open(file_path, "r") as f:
        content = json.load(f)
        return content