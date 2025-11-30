
from pathlib import Path

from avangcli.src.scaffolding_crud.files_content_logic.domain.models import generate_model_class_content


CONTENT_GENERATOR = {
    "models.py": generate_model_class_content
}


def create_structure(base_path: Path, structure: dict | str, model_data: dict):
    """
    Recursively create the folder/file structure.
    """
    try:
        for name, content in structure.items():
            item_path = base_path / name

            # If value is a dictionary, create a folder
            if isinstance(content, dict):
                item_path.mkdir(parents=True, exist_ok=True)
                create_structure(item_path, content, model_data)

            #  If value is a string, create a file
            elif isinstance(content, str):
                item_path.parent.mkdir(parents=True, exist_ok=True)
                if name in CONTENT_GENERATOR:
                    content = CONTENT_GENERATOR.get(name)(model_data['name'], model_data['fields'])
                item_path.write_text(content)
            else:
                raise ValueError(f"Type not supported in structure: {type(content)}")
    except Exception as error:
        raise error
