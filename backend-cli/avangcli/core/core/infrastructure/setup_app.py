import importlib
import logging
import os
import sys

import inject


from fastapi import APIRouter
from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi import status
from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException
from pydantic import ValidationError

from core.domain.exceptions import ValidationException
from core.domain.repositories import DataSources
from core.presentation.serializers import ValidationMapper

logger = logging.getLogger(__name__)
logger.addHandler(logging.StreamHandler(sys.stdout))


LIB_SETTINGS_KEY_ENV_NAME = "SIMPLE_SETTINGS"
SETTINGS_LIB_SETTINGS_KEY = "LIB_SETTINGS"
SETTINGS_SOURCES_KEY = "SOURCES"
SETTINGS_DEPENDENCIES_KEY = "DEPENDENCIES"

DOCS_PATH = "/docs"
DOCS_URL = "/openapi.json"


async def exception_validation_handler(request: Request, error: ValidationException):
    mapper = ValidationMapper()
    output = await mapper.to_api(exception=error)
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=output.model_dump(),
    )


async def exception_request_validation_error_handler(request: Request, error: RequestValidationError):
    mapper = ValidationMapper()
    output = await mapper.to_api_from_request_validation_error(exception=error)
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=output.model_dump(),
    )


async def exception_generic_handler(request: Request, error: Exception):
    mapper = ValidationMapper()
    output = await mapper.to_api_from_generic_error(exception=error)
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=output.model_dump(),
    )


async def exception_http_handler(request: Request, error: HTTPException):
    logger.info(f"Http exception. Code: {error.status_code}. {error.detail}")
    mapper = ValidationMapper()
    output = await mapper.to_api_from_http_error(error=error)
    return JSONResponse(
        status_code=error.status_code,
        content=output.model_dump(),
    )


async def exception_pydantic_validation_error(request: Request, validation_error: ValidationError):
    mapper = ValidationMapper()
    output = await mapper.to_api_from_pydantic_validation_error(validation_error=validation_error)
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=output.model_dump(),
    )

class BaseBootApp:
    SETTINGS_MODULE = "app.settings"

    def __init__(self) -> None:
        os.environ["APP_NAME"] = os.environ.get("APP_NAME", self.SETTINGS_MODULE.split(".")[0])
        self.lib_settings = []
        self.setup_lib_settings()
        self.setup_injection()

    def setup_lib_settings(self) -> tuple:
        self.lib_settings = self.get_all_settings_files(current_settings_str=self.SETTINGS_MODULE)

        lib_settings_str = [item.__name__ for item in self.lib_settings]
        lib_settings_str.reverse()

        os.environ["SIMPLE_SETTINGS"] = ",".join(lib_settings_str)

    def get_all_settings_files(self, current_settings_str: str, settings_files=[]):
        current_settings = importlib.import_module(current_settings_str)
        settings_list = list(getattr(current_settings, SETTINGS_LIB_SETTINGS_KEY, []))

        for settings_str in settings_list:
            depends = self.get_all_settings_files(current_settings_str=settings_str, settings_files=settings_files)
            for depend in depends:
                if depend not in settings_files:
                    settings_files.extend(depend)
                    continue
                print(f"Module already registered: {current_settings_str} >> {depend.__name__}")

        if current_settings not in settings_files:
            settings_files.append(current_settings)
        else:
            print(f"Module already registered: {current_settings_str}")

        return settings_files

    def get_data_source(self) -> DataSources:
        logger.debug("Creating datasource.")
        data_source = DataSources()

        for settings_module in self.lib_settings:
            for key, item in getattr(settings_module, SETTINGS_SOURCES_KEY, {}).items():
                try:
                    class_ = item["class"]
                    args, kwargs = item.get("args", []), item.get("kwargs", {})
                    source_instance = class_(*args, **kwargs)
                    data_source.add(name=key, source_instance=source_instance)
                except:  # noqa
                    logger.exception(f"Error loading source: {key}")
                    raise

        return data_source

    def get_dependencies(self):
        dependencies = {}

        for settings_module in self.lib_settings:
            dependencies.update(getattr(settings_module, SETTINGS_DEPENDENCIES_KEY, {}))

        logger.info(f"Dependencies settings: {dependencies}")

        for interface, implementation in dependencies.items():
            yield interface, implementation

    def config_inject(self, binder):
        data_source = self.get_data_source()
        for interface, implementation in self.get_dependencies():
            try:
                if isinstance(implementation, dict):
                    factory = implementation["factory"]
                    args = implementation.get("args", [])
                    kwargs = implementation.get("kwargs", {})
                    kwargs["data_source"] = data_source
                    instance = factory(*args, **kwargs)
                else:
                    instance = implementation(data_source=data_source)
            except:  # noqa
                logger.exception(f"Injecting instance of: {interface}")
                raise
            try:
                binder.bind(interface, instance)
            except:  # noqa
                logger.exception("Binding inject")
                raise

    def setup_injection(self):
        logger.debug("Start Injection.")
        inject.configure_once(self.config_inject)


class BootApp(BaseBootApp):
    def __init__(self, app: FastAPI, router: APIRouter) -> None:
        super().__init__()
        self.add_exception_handlers(app=app)
        self.setup_middlewares(app=app)
        self.get_data_source()
        self.register_routers(app=app, router=router)

    def setup_middlewares(self, app: FastAPI) -> FastAPI:
        pass

    def add_exception_handlers(self, app: FastAPI):
        app.add_exception_handler(ValidationException, exception_validation_handler)
        app.add_exception_handler(RequestValidationError, exception_request_validation_error_handler)
        app.add_exception_handler(Exception, exception_generic_handler)
        app.add_exception_handler(HTTPException, exception_http_handler)
        app.add_exception_handler(ValidationError, exception_pydantic_validation_error)

    def register_routers(self, app: FastAPI, router: APIRouter) -> None:
        app.include_router(router, prefix="/api/v1")


def create_app(router: APIRouter, boot_app_class: BootApp = None, root_path: str = None):
    app = FastAPI(docs_url=DOCS_PATH, openapi_url=DOCS_URL, root_path=root_path or "/")
    boot_class = boot_app_class or BootApp
    boot_class(app, router)
    return app
