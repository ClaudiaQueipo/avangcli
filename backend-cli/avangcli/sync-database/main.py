from alembic import command
from alembic.config import Config


def lambda_handler(event, context):
    # Run the migrations
    command.upgrade(Config("alembic.ini"), "head")


if __name__ == "__main__":
    lambda_handler(event=None, context=None)