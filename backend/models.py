from exts import db
from sqlalchemy.dialects.postgresql import JSON
from flask_login import UserMixin

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


class Account(UserMixin, db.Model):
    __tablename__ = "account"
    uid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    events = db.Column(db.ARRAY(db.Integer))
    fav_events = db.Column(db.ARRAY(db.Integer))
    orgs = db.Column(db.ARRAY(db.Integer))

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
    
    @property
    def is_active(self):
        return True
    
    def get_id(self):
        return str(self.uid)


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
    name = db.Column(db.String(50), nullable=False, unique=True)
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
    description: str
    time: time
    date: date
    capacity: int
    attendees: list of Account
    reoccuring: bool
    date created : date
    owner: Host
    tags: list of Event Tags
"""


class Event(db.Model):
    __tablename__ = "event"
    eid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    attendees = db.Column(db.ARRAY(db.Integer))
    reoccuring = db.Column(db.Integer, nullable=False)
    date_created = db.Column(db.Date, nullable=False)
    owner = db.Column(db.Integer, db.ForeignKey("host.hid"), nullable=False)
    tags = db.Column(db.ARRAY(db.Integer))

    def __init__(self, name, location, description, date, time, capacity, attendees, reoccuring, date_created, owner, tags):
        self.name = name
        self.location = location
        self.description = description
        self.date = date
        self.time = time
        self.capacity = capacity
        self.attendees = attendees
        self.reoccuring = reoccuring
        self.date_created = date_created
        self.owner = owner
        self.tags = tags

    def __repr__(self):
        return f"<Event {self.eid} {self.name} {self.location} {self.description} {self.date} {self.time} {self.capacity} {self.attendees} {self.reoccuring} {self.date_created} {self.owner} {self.tags}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, name, location, description, date, time, capacity, attendees, reoccuring, date_created, owner, tags):
        self.name = name

        self.location = location
        self.description = description
        self.date = date
        self.time = time
        self.capacity = capacity
        self.attendees = attendees
        self.reoccuring = reoccuring
        self.date_created = date_created
        self.owner = owner
        self.tags = tags
        db.session.commit()

    def serialize(self):
        return {
            "eid": self.eid,
            "name": self.name,
            "description": self.description,
            "location": self.location,
            "date": self.date,
            "time": self.time,
            "capacity": self.capacity,
            "reoccuring": self.reoccuring,
            "date_created": self.date_created,
            "attendees": self.attendees,
            "owner": self.owner,
            "tags": self.tags
        }

"""
class Event_tags:
    etid: int primary key
    name: str
    description: str
"""

class Event_tag(db.Model):
    __tablename__ = "event_tags"
    etid = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))

    def __init__(self, etid, name, description):
        self.etid = etid
        self.name = name
        self.description = description

    def __repr__(self):
        return f"<Event tag {self.etid} {self.name} {self.description}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, etid, name, description):
        self.etid = etid
        self.name = name
        self.description = description
        db.session.commit()