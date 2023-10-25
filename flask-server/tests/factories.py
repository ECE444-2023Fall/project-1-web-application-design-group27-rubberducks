from factory import Sequence
from factory.alchemy import SQLAlchemyModelFactory
from main import db
from models import Account, Host, Event


class BaseFactory(SQLAlchemyModelFactory):
    class Meta:
        abstract = True
        sqlalchemy_session = db.session


class AccountFactory(BaseFactory):
    class Meta:
        model = Account

    uid = Sequence(lambda n: n)
    name = Sequence(lambda n: f"account{n}")
    email = Sequence(lambda n: f"user{n}@utoronto.ca")
    password = Sequence(lambda n: f"password{n}")
    events = []
    fav_events = []
    orgs = []


class HostFactory(BaseFactory):
    class Meta:
        model = Host

    hid = Sequence(lambda n: n)
    name = Sequence(lambda n: f"host{n}")
    email = Sequence(lambda n: f"host{n}@utoronto.ca")
    bio = Sequence(lambda n: f"bio{n}")
    events = []
    owner = Sequence(lambda n: n)


class EventFactory(BaseFactory):
    class Meta:
        model = Event

    eid = Sequence(lambda n: n)
    name = Sequence(lambda n: f"event{n}")
    description = Sequence(lambda n: f"desc{n}")
    location = Sequence(lambda n: f"location{n}")
    date = Sequence(lambda n: f"date{n}")
    capacity = Sequence(lambda n: n)
    attendees = []
    owner = Sequence(lambda n: n)
