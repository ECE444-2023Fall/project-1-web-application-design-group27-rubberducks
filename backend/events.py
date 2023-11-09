import time
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql.expression import cast
from sqlalchemy import Integer
from flask import request
from flask_restx import Namespace, Resource, fields
from models import Event, Event_tag
from flask_jwt_extended import jwt_required

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

filters_model = events_ns.model(
    "Filters",
    {
        "filters": fields.List(fields.String)
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
    
# @events_ns.route("/")
# class Events(Resource):
#     @events_ns.marshal_list_with(event_model)
#     def get(self):
#         # Infinite scroll
#         page = int(request.args.get('page', 1))
#         limit = int(request.args.get('limit', 20))
#         offset = (page - 1) * limit

#         """
#         # Search filtering
#         order = str(request.args.get('ord', 0)) # order
#         name = str(request.args.get('name')) # name
#         location = str(request.args.get('loc')) # location
#         time_start = str(request.args.get('ts')) # start time
#         time_end = str(request.args.get('te')) # end time
#         date_start = str(request.args.get('ds')) # start date
#         date_end = str(request.args.get('de')) # end date
#         capacity = str(request.args.get('cap')) # capacity
#         cap_r = str(request.args.get('cap_r')) # capacity reached, 1 to limit
#         reoccuring = str(request.args.get('re')) # reoccuring
#         uid = str(request.args.get('uid')) # user_id, TODO: implement auth checks for this
#         """
#         tags_filter = str(request.args.get('tags')) # tags
        
        
#         #Query config
#         query = Event.query

#         """
#         #name
#         if name:
#             query = query.filter(Event.name.ilike(f"%{name}%"))
        
#         #location
#         if location:
#             query = query.filter(Event.location.ilike(f"%{location}"))
        
#         """

#         """
#         if time_start: # compare time_start < Event.time
#             #TODO
#             if time_end: # compare time_end > Event.end
#                 #TODO
#         if date_start: # compare date_start < Event.date

#         if date_end: # compare date_end > Event.date

#         if capacity: # compare capacity > Event.capacity

#         if cap_r: # compare Event.attendees.length < Event.capacity

#         if reoccuring: #compare Event.reoccuring == reoccuring
#             """ 


#         #tags
#         if tags_filter:
#             print(tags_filter)
#             tags_filter = [int(tag) for tag in tags_filter.split(',')]
#             query = query.filter(cast(Event.tags, ARRAY(Integer)).contains(tags_filter))

#         """
#         # order
#         if order == 0:
#             query = query.order_by(Event.date.asc()) # Date ascending
#         elif order == 1:
#             query = query.order_by(Event.date.dsc()) # Date descending
#         elif order == 2:
#             query = query.order_by(Event.date_created.dsc()) # Creation date ascending
#         elif order == 3:
#             query = query.order_by(Event.date_created.dsc()) # Creation date descending
#         elif order == 4:
#             query = query.order_by(Event.date.dsc()) # Attendees ascending
#         elif order == 5:
#             query = query.order_by(Event.date.dsc()) # Attendees descending
#         """

#         events = query.order_by(Event.date.asc()).offset(offset).limit(limit).all()
#         return events, 200


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

"""@events_ns.route("/filtered")
class FilteredEvents(Resource):
    @events_ns.expect(filters_model)
    @events_ns.marshal_list_with(event_model)
    def post(self):
        filters_list = request.json.get('filters')
        if not filters_list:
            return Event.query.all(), 200

        all_events = Event.query.all()

        filtered_events = [event for event in all_events if event.tags and all(tag in event.tags for tag in filters_list)]

        return filtered_events, 200"""
