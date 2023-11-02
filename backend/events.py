import time
from datetime import datetime
from sqlalchemy import text
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
        "date": fields.String,
        "time": fields.String,
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


    """@events_ns.expect(event_model)
    @events_ns.marshal_with(event_model)
    def post(self):
        event = Event(**events_ns.payload)
        event.save()
        return event, 201"""
    
@events_ns.route("/")
class Events(Resource):
    @events_ns.marshal_list_with(event_model)
    def get(self):
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        offset = (page - 1) * limit
        events = Event.query.offset(offset).limit(limit).all()
        return events, 200


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

    """@events_ns.expect(tags_model)
    @events_ns.marshal_with(tags_model)
    def post(self):
        tag = Event_tag(**events_ns.payload)
        tag.save()
        return tag, 201"""

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
