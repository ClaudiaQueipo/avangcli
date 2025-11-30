from typing import Annotated
from fastapi import Query



DEFAULT_PAGE_SIZE = 10


async def get_pagination_parameters(
    page: Annotated[
        int,
        Query(
            title="List pagination",
            description="Page of elements.",
            examples=[1],
        ),
    ] = 1,
    size: Annotated[
        int,
        Query(
            title="Amount of records per page.",
            description="Amount of elements per page.",
            examples=[50],
        ),
    ] = DEFAULT_PAGE_SIZE,
) -> tuple[int, int]:
    offset = size * (page - 1)
    return size, offset
