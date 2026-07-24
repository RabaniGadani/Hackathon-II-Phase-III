from sqlmodel import create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from ..models import SQLModel  # Import the SQLModel from models module

# Get database URL from environment variable
# Default to SQLite for local/Vercel dev; set DATABASE_URL for production PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# SQLite needs connect_args for thread safety
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# Create engine
engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)


def create_db_and_tables():
    """
    Creates the database and tables based on the defined models.
    This function should be called on application startup.
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency to get a database session for use with FastAPI.
    Ensures proper cleanup after the session is used.
    """
    with Session(engine) as session:
        yield session