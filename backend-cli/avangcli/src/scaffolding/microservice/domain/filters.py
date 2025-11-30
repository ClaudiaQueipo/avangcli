from src.scaffolding_crud.files_content_logic.common import generate_class_content


def generate_filter_class_content(model_name: str, fields: list[dict]) -> str:
    class_name = model_name.replace("_", "").replace(" ", "").capitalize()

    lines = [
        "from core.domain.filters import BaseSchemaFilter",
        "\n",
        f"class {class_name}SchemaFilter(BaseSchemaFilter):"
    ]

    if not fields:
        lines.append("    pass")
    else:
        for f in fields:
            field_content = f"{f['name']}: {f['type']} | None"
            field_content += f" = None"
            lines.append(f"    {field_content}")

    return generate_class_content(lines)
