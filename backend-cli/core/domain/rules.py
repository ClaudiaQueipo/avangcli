import re
from abc import abstractmethod
from typing import Optional

from pydantic import BaseModel


class BaseRule(BaseModel):
    rule_key: str = "general"
    rule_message: str = "Fail validation."
    rule_error_key: Optional[str] = None

    @abstractmethod
    async def execute(self) -> bool:
        raise NotImplementedError()

    @property
    def key(self) -> str:
        return self.rule_key

    @property
    def message(self) -> str:
        return self.rule_message


class RegexRule(BaseRule):
    value: Optional[str] = None
    pattern: str

    async def execute(self) -> bool:
        if self.value is None:
            return True

        # compiling the pattern for alphanumeric string
        pat = re.compile(self.pattern)

        # Checks whether the whole string matches the re.pattern or not
        return re.fullmatch(pat, self.value)


class EmailRule(RegexRule):
    value: Optional[str] = None
    pattern: str = r"([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])"  # noqa
    rule_message: str = "Invalid email"
