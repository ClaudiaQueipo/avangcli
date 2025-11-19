
from typing import List

from core.domain.rules import BaseRule


class BaseException(Exception):
    pass


class ValidationException(BaseException):
    def __init__(self, message: str, fail_rules: List[BaseRule] = None):
        self.fail_rules = fail_rules or []
        super().__init__(message)


class DuplicateException(BaseException):
    pass
