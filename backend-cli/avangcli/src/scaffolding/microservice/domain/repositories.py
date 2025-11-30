from src.scaffolding_crud.files_content_logic.common import generate_class_content


def generate_irepository_class_content(model_name: str) -> str:
    class_name = model_name.replace("_", "").replace(" ", "").capitalize()

    lines = [
        "from core.domain.repositories import ISourceRepository",
        "\n",
        f"class I{class_name}Repository(ISourceRepository):"
    ]

    lines.append("    pass")

    return generate_class_content(lines)
