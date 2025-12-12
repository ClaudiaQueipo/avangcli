"""Dependency injection for my_app."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

# Database dependency
DBSession = Annotated[AsyncSession, Depends(get_db)]
