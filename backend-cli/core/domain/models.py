
from datetime import datetime
from typing import Any
from typing import Generic
from typing import List
from typing import TypeVar
from enum import Enum

from pydantic import BaseModel
from pydantic import Field
from pydantic import field_validator

ResultModel = TypeVar("ResultModel")


class BaseEntity(BaseModel):
    entity_id: str = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True
        validate_assignment = True

    @field_validator("entity_id", mode="before")
    @classmethod
    def entity_id_as_str(cls, data: Any) -> str:
        if data:
            return str(data)
        return data


class PageResult(BaseModel, Generic[ResultModel]):
    items: List[ResultModel] = []
    total: int | None = None


class BaseChangeRequest(BaseModel):
    """Base class for all possible request changes to update entities."""

    @property
    def changes_as_dict(self):
        return self.model_dump(exclude_unset=True)
