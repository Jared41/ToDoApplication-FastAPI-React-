import os
import tempfile
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# Ensure the app's global engine uses SQLite during tests to avoid psycopg2
_tmp_db_path = os.path.join(tempfile.gettempdir(), "pytest_db.sqlite3")
os.environ["DATABASE_URL"] = "sqlite:///" + _tmp_db_path.replace("\\", "/")

from database import Base, get_db
from main import app
import models


@pytest.fixture(scope="session")
def db_engine():
    # Use SQLite in a temp file to support Date type easily
    fd, path = tempfile.mkstemp()
    os.close(fd)
    url = f"sqlite:///{path}"
    engine = create_engine(url, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    try:
        yield engine
    finally:
        Base.metadata.drop_all(bind=engine)
        try:
            os.remove(path)
        except OSError:
            pass


@pytest.fixture()
def db_session(db_engine):
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)


