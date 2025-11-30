from enum import Enum
from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Integer

from core.infrastructure.orm.tables import BaseTable


class TableName(str, Enum):
    TABLE_DUMMY = "table_dummy"


class DummyTable(BaseTable):
    __tablename__ = TableName.TABLE_DUMMY.value

    name_object = Column(String(100), nullable=True)
    phone = Column(String(100), nullable=True, unique=True)
    object_count = Column(Integer(), nullable=True)
