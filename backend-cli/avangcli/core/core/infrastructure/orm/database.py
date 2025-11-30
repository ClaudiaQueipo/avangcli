import logging
from contextlib import contextmanager

from psycopg2 import errors as psycopg2_errors
from sqlalchemy import create_engine
from sqlalchemy import exc as orm_exceptions
from sqlalchemy.orm import sessionmaker

from core.domain.exceptions import DuplicateException

logger = logging.getLogger(__name__)


class DbConnection:
    def __init__(self, con_str) -> None:
        self.con_str = con_str
        if not con_str:
            logger.error("Missing database connection string.")

        self.engine = create_engine(con_str)
        self.Session = sessionmaker(self.engine)
        logger.info("Create database session maker.")

    @contextmanager
    def new_session(self):
        db_session = self.Session()
        try:
            yield db_session
        except orm_exceptions.IntegrityError as error:
            if isinstance(error.orig, psycopg2_errors.UniqueViolation):
                raise DuplicateException(str(error.orig))
            db_session.rollback()
        except Exception as error:
            logger.exception("Database exception.")
            db_session.rollback()
            raise error
        else:
            db_session.commit()
            logger.debug("Database session executed correctly.")
        finally:
            db_session.close()