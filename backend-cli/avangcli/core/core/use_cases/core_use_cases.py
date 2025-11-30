import asyncio
import logging
from abc import ABC
from abc import abstractmethod
from typing import Any

from core.domain.exceptions import ValidationException
from core.domain.filters import BaseSchemaFilter
from core.domain.models import PageResult, BaseEntity, BaseChangeRequest
from core.domain.repositories import ISourceRepository
from core.domain.rules import BaseRule

logger = logging.getLogger(__name__)


class BaseService(ABC):
    async def run(self, *args, **kwargs) -> Any:
        await self.pre_execute(*args, **kwargs)

        try:
            result = await self.execute(*args, **kwargs)
        except ValidationException:
            raise
        except Exception as error:  # noqa
            logger.exception(f"Service exception: {error}")
            raise
        else:
            kwargs["result"] = result
            await self.post_execute(*args, **kwargs)
        finally:
            await self.finally_execute(*args, **kwargs)

        return result

    async def pre_execute(self, *args, **kwargs):
        pass

    async def post_execute(self, *args, **kwargs):
        pass

    async def finally_execute(self, *args, **kwargs):
        pass

    @abstractmethod
    async def execute(self, *args, **kwargs) -> Any:
        """Execute an application service and return sth."""
        raise NotImplementedError()


class BaseValidationService(BaseService):
    main_message = "Validation Fails"
    raise_exception = True  # Set True to raise exception is its any fail, otherwise return a bool.
    raise_first = False  # Set true to raise exception at first fail.

    @abstractmethod
    async def get_rules(self, *args, **kwargs) -> list[BaseRule]:
        return []

    @property
    def message(self) -> str:
        return self.main_message

    async def execute(self, *args, **kwargs) -> bool:
        fail_rules = []

        for rule in await self.get_rules(*args, **kwargs):
            valid = await rule.execute()
            if valid:
                continue
            fail_rules.append(rule)

        if not fail_rules:
            return True

        if not self.raise_exception:
            return False

        raise ValidationException(message=self.message, fail_rules=fail_rules)


class BaseValidateMixinService(BaseService):
    validation_class: BaseValidationService | None = None
    is_validation_success: bool | None = None

    async def execute_validations(self, *args, **kwargs):
        validation_srv: BaseValidationService = self.validation_class()
        self.is_validation_success = await validation_srv.run(*args, **kwargs)

    async def pre_execute(self, *args, **kwargs):
        if self.validation_class is not None:
            await self.execute_validations(*args, **kwargs)
        return await super().pre_execute(*args, **kwargs)


class BaseListMixinService(BaseValidateMixinService, BaseService):
    repo_instance: ISourceRepository

    async def execute(self, filter_schema: BaseSchemaFilter, *args, **kwargs) -> list[BaseEntity]:
        return await self.repo_instance.find(filter_schema=filter_schema)


class BaseListPaginationMixinService(BaseValidateMixinService, BaseService):
    repo_instance: ISourceRepository

    async def execute(
        self,
        filter_schema: BaseSchemaFilter,
    ) -> PageResult[BaseEntity]:
        result_count, result_items = await asyncio.gather(
            self.repo_instance.count(filter_schema=filter_schema), self.repo_instance.find(filter_schema=filter_schema)
        )

        return PageResult(items=result_items, total=result_count)


class BaseCreateMixinService(BaseValidateMixinService, BaseService):
    repo_instance: ISourceRepository

    async def execute(
        self,
        entity: BaseEntity,
        *args,
        **kwargs,
    ) -> BaseEntity:
        return await self.repo_instance.create(entity=entity)


class BaseUpdateMixinService(BaseValidateMixinService, BaseService):
    repo_instance: ISourceRepository

    async def execute(
        self,
        entity: BaseEntity,
        change_request: BaseChangeRequest,
        *args,
        **kwargs,
    ) -> BaseEntity:
        return await self.repo_instance.update_one(entity=entity, change_request=change_request)