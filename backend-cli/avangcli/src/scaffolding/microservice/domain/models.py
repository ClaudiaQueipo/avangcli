from src.scaffolding_crud.files_content_logic.common import generate_class_content


def generate_model_class_content(model_name: str, fields: list[dict]) -> str:
    class_name = model_name.replace("_", "").replace(" ", "").capitalize()

    lines = [
        "from core.domain.models import BaseEntity",
        "\n",
        f"class {class_name}(BaseEntity):"
    ]

    if not fields:
        lines.append("    pass")
    else:
        for f in fields:
            field_content = f"{f['name']}: {f['type']}"
            if 'default_value' in f:
                field_content += f" = {f['default_value']}"
            lines.append(f"    {field_content}")

    return generate_class_content(lines)


def generate_change_request_model_class_content(model_name: str, fields: list[dict]) -> str:
    class_name = model_name.replace("_", "").replace(" ", "").capitalize()

    lines = [
        "from core.domain.models import BaseChangeRequest",
        "\n",
        f"class {class_name}ChangeRequest(BaseChangeRequest):"
    ]

    if not fields:
        lines.append("    pass")
    else:
        for f in fields:
            field_content = f"{f['name']}: {f['type']} | None"
            field_content += f" = None"
            lines.append(f"    {field_content}")

    return generate_class_content(lines)
