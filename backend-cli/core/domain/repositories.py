from abc import abstractmethod
from abc import ABC

from core.domain.filters import BaseSchemaFilter
from core.domain.models import BaseEntity
from core.domain.models import BaseChangeRequest


class DataSources:
    def __init__(self, sources: dict | None = None):
        self.sources = sources.copy() if sources else {}

    def add(self, name: str, source_instance):
        self.sources[name] = source_instance

    def get(self, name):
        return self.sources[name]


class IBaseRepository(ABC):
    def __init__(self, data_source: DataSources | None = None):
        self.data_source = data_source


class ISourceRepository(IBaseRepository):

    @abstractmethod
    async def find(self, filter_schema: BaseSchemaFilter) -> list[BaseEntity]:
        raise NotImplementedError()

    @abstractmethod
    async def create(self, entity: BaseEntity) -> BaseEntity:
        raise NotImplementedError()

    @abstractmethod
    async def count(self, filter_schema: BaseSchemaFilter) -> int:
        raise NotImplementedError()

    @abstractmethod
    async def update_one(self, entity: BaseEntity, change_request: BaseChangeRequest) -> BaseEntity:
        raise NotImplementedError()

    @abstractmethod
    async def update_many(self, filter_schema: BaseSchemaFilter, change_request: BaseChangeRequest) -> int:
        raise NotImplementedError()

    @abstractmethod
    async def delete(self, filter_schema: BaseSchemaFilter) -> int:
        raise NotImplementedError()
