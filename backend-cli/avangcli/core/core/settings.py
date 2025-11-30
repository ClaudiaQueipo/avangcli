from decouple import config

from core.infrastructure.orm.database import DbConnection

DB_PG_CONNECTION_STR = config("DB_PG_CONNECTION_STR", "postgresql://postgres:postgres@localhost/db_name")

SOURCES = {
    "pg_con": {
        "class": DbConnection,
        "kwargs": {
            "con_str": DB_PG_CONNECTION_STR,
        },
    },
}


