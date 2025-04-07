import logging
from logging.config import fileConfig

from flask import current_app
from alembic import context
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

config = context.config

# Set up logging configuration
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')


def get_url():
    return os.getenv("DATABASE_URL")


def get_engine():
    try:
        # this works with Flask-SQLAlchemy<3 and Alchemical
        return current_app.extensions['migrate'].db.get_engine()
    except (TypeError, AttributeError):
        # this works with Flask-SQLAlchemy>=3
        return current_app.extensions['migrate'].db.engine


def get_metadata():
    if hasattr(current_app.extensions['migrate'].db, 'metadatas'):
        return current_app.extensions['migrate'].db.metadatas[None]
    return current_app.extensions['migrate'].db.metadata


def run_migrations_offline():
    url = get_url()
    context.configure(url=url, target_metadata=get_metadata(), literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, 'autogenerate', False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info('No changes in schema detected.')

    connectable = get_engine()

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=get_metadata())

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()