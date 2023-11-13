import time
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql.expression import cast
from sqlalchemy import Integer, func
from flask import request
from flask_restx import Namespace, Resource, fields
from backend.models import Event, Event_tag, Host
#from models import Event, Event_tag, Host
from flask_jwt_extended import jwt_required
from backend.exts import db
#from exts import db
events_ns = Namespace("events", description="Event operations")

class DateFormat(fields.Raw):
    def format(self, value):
        return value.strftime('%Y-%m-%d')
    
class TimeFormat(fields.Raw):
    def format(self, value):
        return time.strftime(value, "%H:%M")

event_model = events_ns.model(
    "Event",
    {
        "eid": fields.Integer,
        "name": fields.String,
        "description": fields.String,
        "location": fields.String,
        "coords": fields.List(fields.Float),
        "date": fields.String,
        "start_time": fields.String,
        "end_time": fields.String,
        "capacity": fields.Integer,
        "reoccuring": fields.Integer,
        "date_created": fields.String,
        "attendees": fields.List(fields.Integer),
        "owner": fields.Integer,
        "tags": fields.List(fields.Integer),
        "owner_name": fields.String,
        "profile_pic": fields.Integer,
    },
)

tags_model = events_ns.model(
    "Event_tag",
    {
        "etid": fields.Integer,
        "name": fields.String,
        "description": fields.String,
    }
)

@events_ns.route("/all")
class Events(Resource):
    @events_ns.marshal_list_with(event_model)
    def get(self):
        return Event.query.all(), 200

    @events_ns.expect(event_model)
    @events_ns.marshal_with(event_model)
    def post(self):
        event = Event(**events_ns.payload)
        event.save()
        return event, 201
    
"""
TODO: Limit information transmitted for privacy (attendees list, etc)
TODO: Implement limit for past event
"""
@events_ns.route("/")
class Events(Resource):
    @events_ns.marshal_list_with(event_model)
    def get(self):
        # Infinite scroll
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        offset = (page - 1) * limit

        # Search filtering
        order = str(request.args.get('ord', 0)) # order (sorting)
        name = str(request.args.get('name')) # name
        location = str(request.args.get('loc')) # location
        time_start = str(request.args.get('ts')) # start time
        time_end = str(request.args.get('te')) # end time
        date = str(request.args.get('d')) # start date
        capacity = str(request.args.get('cap')) # capacity
        cap_r = str(request.args.get('capr')) # capacity reached, 1 to limit
        reoccuring = str(request.args.get('re')) # reoccuring
        host = str(request.args.get('host')) #host
        uid = str(request.args.get('uid')) # user_id
        tags_filter = str(request.args.get('tags')) # tags
        ft = str(request.args.get('ft')) # future events only

        """
        # Debug Prints
        print(order)
        print(name)
        print(location)
        print(time_start)
        print(time_end)
        print(date)
        print(capacity)
        print(cap_r)
        print(reoccuring)
        print(host)
        print(uid)
        print(tags_filter)
        """

        # Initialize Query
        query = db.session.query(Event, Host.name.label('owner_name')).join(Host, Event.owner == Host.hid)

        # Filtering
        if name and name != 'None': # Name
            query = query.filter(Event.name.ilike(f"%{name}%"))
        if location and location != 'None': # Location
            query = query.filter(Event.location.ilike(f"%{location}%"))
        if time_start and time_start != 'None': # Start Time
            query = query.filter(Event.start_time >= time_start)
        if time_end and time_end != 'None': # End Time
            query = query.filter(Event.end_time <= time_end)
        if date and date != 'None': # Date
            query = query.filter(Event.date >= date)
        if capacity and capacity != 'None': # Capacity
            cap = int(capacity)
            query = query.filter(Event.capacity>cap)
        if cap_r and cap_r == '1': # Capacity Reached
            query = query.filter(func.cardinality(Event.attendees) < Event.capacity)
        if reoccuring and reoccuring != 'None': # Reoccuring
            reo = int(reoccuring)
            query = query.filter(Event.reoccuring==reo)
        if host and host != 'None': # Host
            #host_id = int(host)
            query = query.filter(Host.name.ilike(f"%{host}%"))
        if uid and uid != 'None': # Uid
            user_id = int(uid)
            query = query.filter(Event.attendees.any(user_id))
        if ft and ft == '1': # future events only
            today = datetime.today().strftime('%Y-%m-%d')
            query = query.filter(Event.date >= today)
            
        # Tags
        if (tags_filter and tags_filter != 'None'):
            tags_filter = [int(tag) for tag in tags_filter.split(',')]
            query = query.filter(cast(Event.tags, ARRAY(Integer)).contains(tags_filter))

        # Order
        if order == '0':
            query = query.order_by(Event.date.asc()) # Date ascending
        elif order == '1':
            query = query.order_by(Event.date.desc()) # Date descending
        elif order == '2':
            query = query.order_by(Event.date_created.asc()) # Creation date ascending (oldest)
        elif order == '3':
            query = query.order_by(Event.date_created.desc()) # Creation date descending (newest)
        elif order == '4':
            query = query.order_by(func.cardinality(Event.attendees).desc(), Event.date.asc()).group_by(Event.eid, Host.name) # Attendees descending
        elif order == '5':
            query = query.order_by(func.cardinality(Event.attendees).asc(), Event.date.asc()).group_by(Event.eid, Host.name) # Attendees ascending
        
        #print(str(query.statement.compile(compile_kwargs={"literal_binds": True})))
        events = query.offset(offset).limit(limit).all()
        return [
            {
                'eid': event.eid,
                'name': event.name,
                'description': event.description,
                'location': event.location,
                'date': event.date.strftime('%Y-%m-%d'),
                'start_time': event.start_time.strftime("%H:%M"),
                'end_time': event.end_time.strftime("%H:%M"),
                'capacity': event.capacity,
                'reoccuring': event.reoccuring,
                'date_created': event.date_created.strftime('%Y-%m-%d'),
                'attendees': event.attendees,
                'owner': event.owner,
                'tags': event.tags,
                'owner_name': owner_name,
                'profile_pic':event.profile_pic,
            }
            for event, owner_name in events
        ], 200


@events_ns.route("/<int:eid>")
class EventById(Resource):
    @events_ns.marshal_with(event_model)
    def get(self, eid):
        event = Event.query.get_or_404(eid)
        return event, 200

    @events_ns.expect(event_model)
    @events_ns.marshal_with(event_model)
    def put(self, eid):
        event = Event.query.get_or_404(eid)
        event.update(**events_ns.payload)
        return event, 200

    def delete(self, eid):
        event = Event.query.get_or_404(eid)
        event.delete()
        return {"message": "event deleted"}, 200
    
@events_ns.route("/tags")
class Event_tags(Resource):
    @events_ns.marshal_list_with(tags_model)
    def get(self):
        return Event_tag.query.all(), 200

    @events_ns.expect(tags_model)
    @events_ns.marshal_with(tags_model)
    def post(self):
        tag = Event_tag(**events_ns.payload)
        tag.save()
        return tag, 201

@events_ns.route("/tags/<int:etid>")
class EventTagId(Resource):
    @events_ns.marshal_with(tags_model)
    def get(self, etid):
        event_tag = Event_tag.query.get_or_404(etid)
        return event_tag, 200

    @events_ns.expect(tags_model)
    @events_ns.marshal_with(tags_model)
    def put(self, etid):
        event_tag = Event.query.get_or_404(etid)
        event_tag.update(**events_ns.payload)
        return event_tag, 200

    def delete(self, etid):
        event_tag = Event_tag.query.get_or_404(etid)
        event_tag.delete()
        return {"message": "event tag deleted"}, 200
