from src.business_logic.models import ServiceType
from src.scaffolding_crud.files_content_logic.common import generate_class_content

IREPO_PATH_TEMPLATE = "{base_path}.domain.repositories.py"
FILTER_PATH_TEMPLATE = "{base_path}.domain.filter.py"
MODEL_PATH_TEMPLATE = "{base_path}.domain.models.py"


def generate_list_service_class_content(import_data: dict) -> str:
    lines = [
        "import inject",
        "\n",
        "from core.use_cases.core_use_cases import BaseListMixinService",
        f"{import_data['irepo']['import']}",
        f"{import_data['schema_filter']['import']}",
        f"{import_data['model']['import']}",
        "\n\n",
        f"class {import_data['model']['name']}ListService(BaseListMixinService):"
        f"      repo_instance = inject.attr({import_data['irepo']['name']})"
        "\n",
        f"      async def execute(self, filter_schema: {import_data['schema_filter']['name']})"
        f" -> list[{import_data['model']['name']}]:"
        f"          return await super().execute(filter_schema=filter_schema)"
    ]

    return generate_class_content(lines)


def generate_pagination_service_class_content(import_data: dict) -> str:

    lines = [
        "import inject",
        "\n",
        "from core.domain.models import PageResult",
        "from core.use_cases.core_use_cases import BaseListPaginationMixinService",
        f"{import_data['irepo']['import']}",
        f"{import_data['schema_filter']['import']}",
        f"{import_data['model']['import']}",
        "\n\n",
        f"class {import_data['model']['name']}PaginationListService(BaseListPaginationMixinService):"
        f"      repo_instance = inject.attr({import_data['irepo']['name']})"
        "\n",
        f"      async def execute(self, filter_schema: {import_data['schema_filter']['name']})"
        f" -> PageResult[{import_data['model']['name']}]:"
        f"          return await super().execute(filter_schema=filter_schema)"
    ]

    return generate_class_content(lines)


def generate_create_service_class_content(import_data: dict) -> str:

    lines = [
        "import inject",
        "\n",
        "from core.use_cases.core_use_cases import BaseCreateMixinService",
        f"{import_data['irepo']['import']}",
        f"{import_data['model']['import']}",
        "\n\n",
        f"class {import_data['model']['name']}CreateService(BaseCreateMixinService):"
        f"      repo_instance = inject.attr({import_data['irepo']['name']})"
        "\n",
        f"      async def execute(self, entity: {import_data['irepo']['name']})"
        f" -> {import_data['irepo']['name']}:"
        f"          return await super().execute(entity=entity)"
    ]

    return generate_class_content(lines)


def generate_update_service_class_content(import_data: dict) -> str:

    lines = [
        "import inject",
        "\n",
        "from core.use_cases.core_use_cases import BaseUpdateMixinService",
        f"{import_data['irepo']['import']}",
        f"{import_data['model']['import']}",
        f"{import_data['change_request']['import']}",
        "\n\n",
        f"class {import_data['model']['name']}UpdateService(BaseUpdateMixinService):"
        f"      repo_instance = inject.attr({import_data['irepo']['name']})"
        "\n",
        f"      async def execute(self, entity: {import_data['irepo']['name']}, "
        f"change_request: {import_data['change_request']['name']}) -> {import_data['irepo']['name']}:"
        f"          return await super().execute(entity=entity, change_request=change_request)"
    ]

    return generate_class_content(lines)


def get_imports_base(model_name: str, base_path: str) -> dict:
    class_name = model_name.replace("_", "").replace(" ", "").capitalize()

    irepo_path = IREPO_PATH_TEMPLATE.format(base_path=base_path)
    irepo_name = f"I{class_name}Repository"
    irepo_import = f"from {irepo_path} import {irepo_name}"

    schema_filter_path = FILTER_PATH_TEMPLATE.format(base_path=base_path)
    schema_filter_name = f"{class_name}SchemaFilter"
    schema_filter_import = f"from {schema_filter_path} import {schema_filter_name}"

    model_path = MODEL_PATH_TEMPLATE.format(base_path=base_path)
    model_import = f"from {model_path} import {class_name}"

    change_request_name = f"{class_name}ChangeRequest"
    change_request_import = f"from {model_path} import {change_request_name}"

    result = {
        'irepo': {
            'name': irepo_name,
            'import': irepo_import,
        },
        'schema_filter': {
            'name': schema_filter_name,
            'import': schema_filter_import,
        },
        'model': {
            'name': class_name,
            'import': model_import,
        },
        'change_request': {
            'name': change_request_name,
            'import': change_request_import
        }
    }

    return result


def get_content_file(model_name: str, base_path: str, service_type: ServiceType) -> str:
    import_data = get_imports_base(model_name, base_path)

    if service_type == ServiceType.LIST:
        return generate_list_service_class_content(import_data)
    elif service_type == ServiceType.PAGINATION:
        return generate_pagination_service_class_content(import_data)
    elif service_type == ServiceType.CREATE:
        return generate_create_service_class_content(import_data)
    elif service_type == ServiceType.UPDATE:
        return generate_update_service_class_content(import_data)
    else:
        raise ValueError("The service type is not valid")
