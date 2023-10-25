from exts import db
from sqlalchemy.dialects.postgresql import JSON

"""
class Account:
    uid: int primary key
    name: str
    email: str unique
    password: str
    events: list of Event
    fav_events: list of Event
    orgs: list of Host
"""


class Account(db.Model):
    __tablename__ = "account"
    uid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    events = db.Column(db.ARRAY(db.Integer))
    fav_events = db.Column(db.ARRAY(db.Integer))
    orgs = db.relationship("Host", backref="account")

    def __init__(self, name, email, password, events, fav_events, orgs):
        self.name = name
        self.email = email
        self.password = password
        self.events = events
        self.fav_events = fav_events
        self.orgs = orgs

    def __repr__(self):
        return f"<Account {self.uid} {self.name} {self.email} {self.password} {self.events} {self.fav_events} {self.orgs}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, name, email, password, events, fav_events, orgs):
        self.name = name
        self.email = email
        self.password = password
        self.events = events
        self.fav_events = fav_events
        self.orgs = orgs
        db.session.commit()


"""
class Host:
    hid: int primary key
    name: str
    email: str
    bio: str
    events: list of Event
    owner: Account
"""


class Host(db.Model):
    __tablename__ = "host"
    hid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    bio = db.Column(db.String(50), nullable=False)
    events = db.Column(db.ARRAY(db.Integer))
    owner = db.Column(db.Integer, db.ForeignKey("account.uid"), nullable=False)

    def __init__(self, name, email, bio, events, owner):
        self.name = name
        self.email = email
        self.bio = bio
        self.events = events
        self.owner = owner

    def __repr__(self):
        return f"<Host {self.hid} {self.name} {self.email} {self.bio} {self.events} {self.owner}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, name, email, bio, events, owner):
        self.name = name
        self.email = email
        self.bio = bio
        self.events = events
        self.owner = owner
        db.session.commit()


"""
class Event:
    eid: int primary key
    name: str
    location: str
    date: date
    capacity: int
    attendees: list of Account
    owner: Host
"""


class Event(db.Model):
    __tablename__ = "event"
    eid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    attendees = db.Column(db.ARRAY(db.Integer))
    owner = db.Column(db.Integer, db.ForeignKey("host.hid"), nullable=False)

    def __init__(self, name, location, date, capacity, attendees, owner):
        self.name = name
        self.location = location
        self.date = date
        self.capacity = capacity
        self.attendees = attendees
        self.owner = owner

    def __repr__(self):
        return f"<Event {self.eid} {self.name} {self.location} {self.date} {self.capacity} {self.attendees} {self.owner}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, name, location, date, capacity, attendees, owner):
        self.name = name
        self.location = location
        self.date = date
        self.capacity = capacity
        self.attendees = attendees
        self.owner = owner
        db.session.commit()