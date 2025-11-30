import logging

from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.sql import Delete
from sqlalchemy.sql import Select
from sqlalchemy.sql import Update
from sqlalchemy_filterset import FilterSet
from sqlalchemy import update
from sqlalchemy import delete

from core.infrastructure.orm import tables
from core.domain.filters import BaseSchemaFilter
from core.domain.models import BaseEntity, BaseChangeRequest
from core.domain.repositories import ISourceRepository, DataSources
from core.infrastructure.orm import tables
from core.infrastructure.orm.database import DbConnection
from core.infrastructure.orm.mappers import BaseSourceMapper, create_generic_source_mapper

logger = logging.getLogger(__name__)

DB_CONNECTION_NAME = "pg_con"


class BaseFilterSet(FilterSet):
    def __init__(self, session: Session, query: Select | Delete | Update) -> None:
        super().__init__(session, query)


class BaseSourceRepository(ISourceRepository):
    def __init__(
        self,
        data_source: dict | None,
        domain_class: BaseEntity,
        table_class: tables.BaseTable,
        filterset_class: FilterSet,
        mapper_class: BaseSourceMapper | None = None,
    ):
        super().__init__(data_source=data_source)
        self.domain_class = domain_class
        self.table_class: tables.BaseTable = table_class
        self.filterset_class: FilterSet = filterset_class
        self.mapper: BaseSourceMapper = (
            mapper_class()
            if mapper_class
            else create_generic_source_mapper(table_class=table_class, domain_class=domain_class)
        )

    @property
    def db_con(self) -> DbConnection:
        return self.data_source.get(DB_CONNECTION_NAME)

    async def find(self, filter_schema: BaseSchemaFilter) -> list[BaseEntity]:
        mapper = self.mapper
        with self.db_con.new_session() as session:
            try:
                filter_set = self.filterset_class(session, select(self.table_class))
                filtered_items = filter_set.filter(filter_schema.filters_as_dict)
                return [await mapper.to_entity(entity_table=item_table) for item_table in filtered_items]
            except Exception as error:
                logger.exception(f"Failed find process: {error}")

            return []

    async def create(self, entity: BaseEntity) -> BaseEntity:
        mapper = self.mapper
        with self.db_con.new_session() as session:
            try:
                item_table = await self.mapper.to_table(entity)
                session.add(item_table)
                session.flush()
                return await mapper.to_entity(entity_table=item_table)
            except Exception as error:
                logger.exception(f"Failed create process: {error}")


    async def count(self, filter_schema: BaseSchemaFilter) -> int:
        with self.db_con.new_session() as session:
            try:
                filter_set = self.filterset_class(session, select(self.table_class))
                query = filter_set.count_query(filter_schema.filters_as_dict)
                return session.execute(query).scalar()
            except Exception as error:
                logger.exception(f"Count process failed: {error}")

            return 0

    async def update_one(self, entity: BaseEntity, change_request: BaseChangeRequest) -> BaseEntity:
        with self.db_con.new_session() as session:
            try:
                query = update(self.table_class).where(self.table_class.entity_id == entity.entity_id)
                query = query.values(**change_request.changes_as_dict)
                session.execute(query)
            except Exception as error:
                logger.exception(f"Update one process failed: {error}")
        entity = entity.model_copy(update=change_request.changes_as_dict)
        return entity

    async def update_many(self, filter_schema: BaseSchemaFilter, change_request: BaseChangeRequest) -> int:
        with self.db_con.new_session() as session:
            try:
                filter_set = self.filterset_class(session, update(self.table_class))
                query = filter_set.filter_query(filter_schema.filters_as_dict)
                query = query.values(**change_request.changes_as_dict)
                result = session.execute(query)
                return result.rowcount
            except Exception as error:
                logger.exception(f"Update many process failed: {error}")

            return 0

    async def delete(self, filter_schema: BaseSchemaFilter) -> int:
        with self.db_con.new_session() as session:
            try:
                filter_set = self.filterset_class(session, delete(self.table_class))
                query = filter_set.filter_query(filter_schema.filters_as_dict)
                result = session.execute(query)
                session.commit()

                return result.rowcount
            except Exception as error:
                logger.exception(f"Failed delete process: {error}")

            return 0


def create_generic_source_repository(
    data_source: DataSources,
    domain_class: BaseEntity,
    table_class: tables.BaseTable,
    filterset_class: FilterSet,
    mapper_class: BaseSourceMapper | None = None,
):
    repo_instance = BaseSourceRepository(
        data_source=data_source,
        domain_class=domain_class,
        table_class=table_class,
        filterset_class=filterset_class,
        mapper_class=mapper_class,
    )
    return repo_instance
