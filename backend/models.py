from exts import db
from sqlalchemy.dialects.postgresql import JSON
from flask_login import UserMixin
from datetime import datetime
from sqlalchemy import DateTime

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
    msgids = db.Column(db.ARRAY(db.Integer))

    def __init__(self, name, email, password, events, fav_events, orgs, msgids):
        self.name = name
        self.email = email
        self.password = password
        self.events = events
        self.fav_events = fav_events
        self.orgs = orgs
        self.msgids = msgids


    def __repr__(self):
        return f"<Account {self.uid} {self.name} {self.email} {self.password} {self.events} {self.fav_events} {self.orgs} {self.msgids}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, name, email, events, fav_events, orgs, msgids, password=None):
        self.name = name
        self.email = email
        if password is not None:
            self.password = password
        self.events = events
        self.fav_events = fav_events
        self.orgs = orgs
        self.msgids = msgids
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
class Message(db.Model):
    __tablename__ = "messages"
    msgid = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey("account.uid"), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    created_at = db.Column(DateTime, nullable=False)
    read = db.Column(db.Boolean, default=False, nullable=False)
    msg_type =  db.Column(db.Integer, nullable=False)

    def __init__(self, account_id, message, msg_type, created_at=None, read=False):
        self.account_id = account_id
        self.message = message
        self.msg_type = msg_type
        if created_at is None:
            self.created_at = datetime.utcnow().isoformat()
        else: 
            self.created_at = created_at
        self.read = read  # Initialize the read field

    def __repr__(self):
        return f"<Message {self.msgid} {self.account_id} {self.message} {self.created_at} {self.read} {self.msg_type}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, account_id=None, message=None, created_at=None, read=None, msg_type=None):
        if account_id is not None:
            self.account_id = account_id
        if message is not None:
            self.message = message
        if created_at is not None:
            self.created_at = created_at
        if read is not None:
            self.read = read  # Update the read field
        if msg_type is not None:
            self.msg_type = msg_type

        db.session.commit()

class Host(db.Model):
    __tablename__ = "host"
    hid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(50), nullable=False)
    bio = db.Column(db.String(120), nullable=False)
    events = db.Column(db.ARRAY(db.Integer))
    owner = db.Column(db.Integer, db.ForeignKey("account.uid"), nullable=False)
    pending_transfer = db.Column(db.Boolean, default=False, nullable=False)

    def __init__(self, name, email, bio, events, owner, pending_transfer=False):
        self.name = name
        self.email = email
        self.bio = bio
        self.events = events
        self.owner = owner
        self.pending_transfer = pending_transfer

    def __repr__(self):
        return f"<Host {self.hid} {self.name} {self.email} {self.bio} {self.events} {self.owner} {self.pending_transfer}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, name=None, email=None, bio=None, events=None, owner=None, pending_transfer=False):
        if name is not None:
            self.name = name
        if email is not None:
            self.email = email
        if bio is not None:
            self.bio = bio
        if events is not None:
            self.events = events
        if owner is not None:
            self.owner = owner
        self.pending_transfer = pending_transfer
        db.session.commit()


"""
class Event:
    eid: int primary key
    name: str
    location: str
    description: str
    start_time: time
    end_time
    date: date
    capacity: int
    attendees: list of Account
    tags: list of str
    reoccuring: int
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
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    attendees = db.Column(db.ARRAY(db.Integer))
    reoccuring = db.Column(db.Integer, nullable=False)
    date_created = db.Column(db.Date, nullable=False)
    owner = db.Column(db.Integer, db.ForeignKey("host.hid"), nullable=False)
    tags = db.Column(db.ARRAY(db.Integer))

    def __init__(self, name, location, description, date, start_time, end_time, capacity, attendees, reoccuring, date_created, owner, tags):
        self.name = name
        self.location = location
        self.description = description
        self.date = date
        self.start_time = start_time
        self.end_time = end_time
        self.capacity = capacity
        self.attendees = attendees
        self.reoccuring = reoccuring
        self.date_created = date_created
        self.owner = owner
        self.tags = tags

    def __repr__(self):
        return f"<Event {self.eid} {self.name} {self.location} {self.description} {self.date} {self.start_time} {self.end_time} {self.capacity} {self.attendees} {self.reoccuring} {self.date_created} {self.owner} {self.tags}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, name, location, description, date, start_time, end_time, capacity, attendees, reoccuring, date_created, owner, tags):
        self.name = name

        self.location = location
        self.description = description
        self.date = date
        self.start_time = start_time
        self.end_time = end_time
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
            "start_time": self.start_time,
            "end_time": self.end_time,
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