"""Core configuration for my_app."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # API Configuration
    PROJECT_NAME: str = "my_app"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # CORS Configuration
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:8000"]

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True

    # Database Configuration
    DATABASE_URL: str = "postgresql://my_app_user:dev_password@localhost:5432/my_app_db"
    DB_ECHO: bool = False


settings = Settings()