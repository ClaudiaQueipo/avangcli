from typing import List
from typing import Tuple

from pydantic import BaseModel


class BaseSchemaFilter(BaseModel):
    ordering: List[str] | None = None
    pagination: Tuple[int, int] | None = None
    batch_token: str | None = None

    @property
    def filters_as_dict(self):
        return self.model_dump(exclude_unset=True, exclude_none=True)
