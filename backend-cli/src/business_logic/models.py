
from enum import Enum


class ServiceType(str, Enum):
    LIST = "LIST"
    PAGINATION = "PAGINATION"
    CREATE = "CREATE"
    UPDATE = "UPDATE"


class ModelType(str, Enum):
    MODEL = "MODEL"
    CHANGE_REQUEST = "CHANGE_REQUEST"
