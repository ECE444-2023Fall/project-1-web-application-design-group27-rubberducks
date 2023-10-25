import logging
import pytest
from webtest import TestApp
from main.app import create_app
from main import db as _db
from .factories import AccountFactory, HostFactory, EventFactory


@pytest.fixture
def app():
    _app = create_app("test.settings")
