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
    bio = db.Column(db.String(120), nullable=False)
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
    tags: list of str
    reoccuring: bool
    date created : date
    owner: Host
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
    tags = db.Column(db.ARRAY(db.String(50)))
    reoccuring = db.Column(db.Boolean, nullable=False)
    date_created = db.Column(db.Date, nullable=False)
    owner = db.Column(db.Integer, db.ForeignKey("host.hid"), nullable=False)

    def __init__(self, name, location, description, date, time, capacity, attendees, tags, reoccuring, date_created, owner):
        self.name = name
        self.location = location
        self.description = description
        self.date = date
        self.time = time
        self.capacity = capacity
        self.attendees = attendees
        self.tags = tags
        self.reoccuring = reoccuring
        self.date_created = date_created
        self.owner = owner

    def __repr__(self):
        return f"<Event {self.eid} {self.name} {self.location} {self.description} {self.date} {self.time} {self.capacity} {self.attendees} {self.tags} {self.reoccuring} {self.date_created} {self.owner}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, name, location, description, date, time, capacity, attendees, tags, reoccuring, date_created, owner):
        self.name = name

        self.location = location
        self.description = description
        self.date = date
        self.time = time
        self.capacity = capacity
        self.attendees = attendees
        self.tags = tags
        self.reoccuring = reoccuring
        self.date_created = date_created
        self.owner = owner
        db.session.commit()

"""
class Tag:
    tag: str primary key
"""

class Tag(db.Model):
    __tablename__ = "tag"
    tag = db.Column(db.String(50), primary_key=True)

    def __init__(self, tag):
        self.tag = tag

    def __repr__(self):
        return f"<Tag {self.tag}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()