from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Account, Host, Event  


engine = create_engine('postgresql://ece444_event_horizon_user:AGcegfwEsyz4FbVSPd42Zm4ejtIGXnqd@dpg-ckou75s1tcps73f68d10-a.ohio-postgres.render.com/ece444_event_horizon')
Session = sessionmaker(bind=engine)
session = Session()


all_accounts = session.query(Account).all()
for account in all_accounts:
    print(account)