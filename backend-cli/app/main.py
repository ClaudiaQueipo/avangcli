"""Main application entry point for my_app."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import health

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="my_app - FastAPI Backend",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["health"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to my_app API",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
    }