from pydantic import BaseModel, ValidationError
from typing import TypeVar
from typing import Generic
from typing import List
import logging
from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException

from core.domain.exceptions import ValidationException
from core.domain.models import BaseEntity, PageResult

ModelOutput = TypeVar("ModelOutput")

logger = logging.getLogger(__name__)


class ApiInput(BaseModel):
    pass


class ApiOutput(BaseModel):
    pass


class BasePageOutput(ApiOutput, Generic[ModelOutput]):
    items: List[ModelOutput]
    total: int = 0


class ApiMapper(BaseModel):
    async def to_api(self, *args, **kwargs) -> ApiOutput:
        """Map an Entity to a Presenter"""
        raise NotImplementedError()

    async def to_entity(self, *args, **kwargs) -> BaseEntity:
        """Map a Payload to an Entity"""
        raise NotImplementedError()


class PageMapper(ApiMapper):
    entity_mapper: ApiMapper

    async def to_api(self, page_result: PageResult) -> BasePageOutput:
        return BasePageOutput(
            total=page_result.total,
            items=[await self.entity_mapper.to_api(entity=entity) for entity in page_result.items],
        )

class ValidationItemOutput(ApiOutput):
    key: str
    message: str


class ValidationOutput(ApiOutput):
    message: str
    fails: List[ValidationItemOutput]


class ValidationMapper(ApiMapper):
    async def to_api(self, exception: ValidationException) -> ValidationOutput:
        items = []
        for fail_rule in exception.fail_rules:
            items.append(ValidationItemOutput(key=fail_rule.key, message=fail_rule.message))

        return ValidationOutput(message=str(exception), fails=items)

    async def to_api_from_request_validation_error(self, exception: RequestValidationError) -> ValidationOutput:
        exception_message = "The request contains some invalid values."
        items = []
        for fail_rules in exception.args:
            for fail_rule in fail_rules:
                try:
                    items.append(
                        ValidationItemOutput(key=".".join(map(str, fail_rule["loc"])), message=fail_rule["msg"])
                    )
                except KeyError:
                    logger.error(f"Unknown error format: {fail_rule}")

        return ValidationOutput(message=exception_message, fails=items)

    async def to_api_from_generic_error(self, exception: Exception) -> ValidationOutput:
        exception_message = "The request contains some invalid values."

        logger.error(f"There is some internal error: {exception}")

        return ValidationOutput(message=exception_message, fails=[])

    async def to_api_from_unauthorized(self) -> ValidationOutput:
        exception_message = "Unauthorized"
        return ValidationOutput(message=exception_message, fails=[])

    async def to_api_from_http_error(self, error: HTTPException) -> ValidationOutput:
        exception_message = error.detail
        return ValidationOutput(message=exception_message, fails=[])

    async def to_api_from_pydantic_validation_error(self, validation_error: ValidationError) -> ValidationOutput:
        exception_message = "The request contains some invalid values."
        fails = [
            ValidationItemOutput(
                key=error.get("type", None),
                message=error.get("msg", None),
            )
            for error in validation_error.errors()
        ]
        return ValidationOutput(message=exception_message, fails=fails)
