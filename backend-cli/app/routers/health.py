"""Health check endpoints for my_app."""

from fastapi import APIRouter, statusfrom app.dependencies import DBSession
from sqlalchemy import text

router = APIRouter()


@router.get("/health")
async def health_check(db: DBSession):
    """
    Health check endpoint.

    Returns the health status of the application and database connection.
    """
    health_status = {
        "status": "healthy",
        "service": "my_app",
    }

    # Check database connection
    try:
        await db.execute(text("SELECT 1"))
        health_status["database"] = "connected"
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["database"] = f"error: {str(e)}"
        return health_status

    return health_status