from core.domain.models import BaseEntity
from core.infrastructure.orm.tables import BaseTable


class BaseSourceMapper:
    domain_class: BaseEntity
    table_class: BaseTable

    async def to_entity(self, entity_table: BaseTable) -> BaseEntity:
        return self.domain_class.model_validate(entity_table)

    async def to_table(self, entity: BaseEntity) -> BaseTable:
        return self.table_class(**entity.model_dump())


def create_generic_source_mapper(table_class: BaseTable, domain_class: BaseEntity) -> BaseSourceMapper:
    mapper_instance = BaseSourceMapper()
    mapper_instance.domain_class = domain_class
    mapper_instance.table_class = table_class
    return mapper_instance
