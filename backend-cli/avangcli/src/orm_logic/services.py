import importlib.util
import inspect
from pathlib import Path

from simple_settings import settings
from sqlalchemy import Column


def read_file(file_path: str):
    file_path = Path(file_path)

    if not file_path.exists():
        raise FileNotFoundError(f"File: {file_path},  not found")

    if file_path.suffix != '.py':
        raise ValueError("The file is not a Python file (.py)")

    module_name = file_path.stem
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"The module could not be loaded from: {file_path}")

    module = importlib.util.module_from_spec(spec)

    return module


def analyze_sqlalchemy_columns(class_obj):
    """Analyze the SQLAlchemy columns of a class"""
    properties = []

    for attr_name in dir(class_obj):
        attr_value = getattr(class_obj, attr_name)

        # Check if it is an SQLAlchemy column
        if isinstance(attr_value, Column):
            column_info = {
                'name': attr_name,
                'type': str(attr_value.type),
                'nullable': attr_value.nullable,
                'unique': getattr(attr_value, 'unique', None),
                'primary_key': getattr(attr_value, 'primary_key', False),
                'default': getattr(attr_value, 'default', None),
                'server_default': getattr(attr_value, 'server_default', None),
                'foreign_keys': getattr(attr_value, 'foreign_keys', None),
                'constraints': []
            }

            # Additional information about the column type
            if hasattr(attr_value.type, 'length'):
                column_info['max_length'] = attr_value.type.length

            # Get constraints
            if hasattr(attr_value, 'constraints'):
                for constraint in attr_value.constraints:
                    column_info['constraints'].append(str(constraint))

            properties.append(column_info)

    return properties


def analyze_module_classes_with_properties(module):
    """Analyze the classes in a module and their properties"""
    classes_info = []

    for name, obj in inspect.getmembers(module):
        if inspect.isclass(obj) and obj.__module__ == module.__name__ and name != 'TableName':
            class_info = {
                'name': name,
                'attributes': [],
                'methods': [],
                'properties': [],
                'table_info': {}
            }

            # SQLAlchemy table information if it exists
            if hasattr(obj, '__tablename__'):
                class_info['table_info']['tablename'] = obj.__tablename__

            # Analyze class attributes
            for attr_name in dir(obj):
                if not attr_name.startswith('_'):
                    attr_value = getattr(obj, attr_name)

                    if not callable(attr_value):
                        # It is a regular attribute.
                        class_info['attributes'].append({
                            'name': attr_name,
                            'value': attr_value,
                            'type': type(attr_value).__name__
                        })
                    else:
                        # It is a method
                        class_info['methods'].append(attr_name)

            # Analyze properties specifically (SQLAlchemy columns)
            class_info['properties'] = analyze_sqlalchemy_columns(obj)

            classes_info.append(class_info)

    return classes_info


def get_detailed_class_info():
    """Get detailed information about classes and their properties"""
    table_path = settings.TABLES_PATH # TODO missing define settings
    module = read_file(table_path)
    classes_data = analyze_module_classes_with_properties(module)
    return classes_data
