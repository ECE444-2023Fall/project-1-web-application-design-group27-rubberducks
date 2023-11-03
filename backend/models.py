from exts import db
from sqlalchemy.dialects.postgresql import JSON
from flask_login import UserMixin
from datetime import datetime

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

    def update(self, name, email, password, events, fav_events, orgs, msgids):
        self.name = name
        self.email = email
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
    created_at = db.Column(db.Date, nullable=False)
    read = db.Column(db.Boolean, default=False, nullable=False)  # New read field

    def __init__(self, account_id, message, created_at=None, read=False):
        self.account_id = account_id
        self.message = message
        if created_at is None:
            self.created_at = datetime.now()
        else: 
            self.created_at = created_at
        self.read = read  # Initialize the read field

    def __repr__(self):
        return f"<Message {self.msgid} {self.account_id} {self.message} {self.created_at}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, account_id, message, created_at, read):
        self.account_id = account_id
        self.message = message
        self.created_at = created_at
        self.read = read  # Update the read field
        db.session.commit()

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
    description: str
"""

"""class Tag(db.Model):
    __tablename__ = "tags"
    tag = db.Column(db.String(50), primary_key=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)

    def __init__(self, tag, description):
        self.tag = tag
        self.description = description

    def __repr__(self):
        return f"<Tag {self.tag} {self.description}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, tag, description):
        self.tag = tag
        self.description = description
        db.session.commit()"""
