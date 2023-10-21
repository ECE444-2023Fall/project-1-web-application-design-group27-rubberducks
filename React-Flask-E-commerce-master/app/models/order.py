from app import mysql
from app import webapp
from app.models import *
from app.scripts import Indexer
import datetime
from app.decorators import async
import json
import pytz

class Order():
    def __init__(self, order_id):
        self.order_id = order_id

    def getOrderInfo(self, **kwargs):
        obj_cursor = mysql.connect().cursor()
        obj_cursor.execute("""SELECT o.*,
                (select group_concat(concat(oh.item_id, ':', oh.inventory_id) separator ',') from order_history oh where oh.order_id = o.order_id) as item_ids, 
                IF((select count(*) from orders where parent_id=%s)>0, 1, 0) as is_parent
                FROM orders o 
                WHERE o.order_id = %s""", (self.order_id, self.order_id))
        order_info = Utils.fetchOneAssoc(obj_cursor)
        obj_cursor.close()

        if order_info:
            order_info['items'] = [Item(int(item_id.split(':')[0])).getObj() for item_id in order_info['item_ids'].split(',')]
            order_info['item_id'] = order_info['items'][0]['item_id'] 
            order_info['all_charges'] = [{
                                'charge': Order.getCharge(order_info['charge']), 
                                'payment_mode': order_info['payment_mode']}]

            #NOTE charge denotes charge to be collected in cash
            order_info['charge'] = order_info['charge'] if (order_info['payment_mode'] == 'cash') else 0

            if order_info['from_collection']:
                order_info['collection'] = Collection(order_info['from_collection']).getObj()

            order_info['reviews'] = [Review(user_id=order_info['user_id'], item_id=item_id.split(':')[0]).getObj() for item_id in order_info['item_ids'].split(',')] 
            if len(order_info['items']) == 1:
                order_info['review'] = order_info['reviews'][0]
            order_info['inventory_ids'] = [_.split(':')[1] for _ in order_info['item_ids'].split(',')]

            if 'formatted' in kwargs:
                order_info['pickup_time'] = Utils.cleanTimeSlot(Order.getTimeSlot(order_info['pickup_slot']))
        
            if Item.checkLocalStock(order_info['items'][0]['item_id']):
                order_info['selling_price'] = int(sum([0.8 * _['price'] for _ in order_info['items'] if _['price']])) 
                order_info['selling_percentage'] = 80
            order_info['order_type'] = 64 if order_info['bought'] else 16

            if order_info['parent_id'] or order_info['is_parent']:
                if 'fetch_all' in kwargs:
                    fetch_all = kwargs['fetch_all']
                else:
                    fetch_all = False
                order_info = Order.clubOrders(order_info, fetch_all)
            
        return order_info

    @staticmethod
    def clubOrders(order_info, fetch_all=False):
        parents, children = [], []
        charge = 0
        if order_info['parent_id']:
            parents = Order.getAllParents(order_info, parents)
        if order_info['is_parent']:
            children = Order.getAllChildren(order_info, children)

        if fetch_all:
            return {'parents':parents, 'order': order_info, 'children': children}

        if parents:
            order_info['order_placed'] = parents[-1]['order_placed']
        if children:
            order_info['order_return'] = children[-1]['order_return']
            order_info['pickup_slot'] = children[-1]['pickup_slot']
            order_info['order_id'] = children[-1]['order_id']

        all_orders = parents + children
        for i, order in enumerate(all_orders):
            if i < len(all_orders) - 1 and order['parent_id']:
                charge += order['charge']
            order_info['all_charges'].append({
                    'charge': Order.getCharge(order['charge']),
                    'payment_mode': order['payment_mode']
                    })

        # Ignoring orders extended before extend_order major change on 16th Feb
        if order['payment_mode'] == 'cash' and order['order_id'] not in [20,41,51,66,67,73,78,121]:
            order_info['charge'] += charge 

        return order_info

    @staticmethod
    def getAllParents(order_info, parents):
        cursor = mysql.connect().cursor()
        cursor.execute("""SELECT * FROM orders WHERE order_id = %s""",(order_info['parent_id'],))
        parent_data = Utils.fetchOneAssoc(cursor)
        cursor.close()
        parents.append(parent_data)
        if parent_data['parent_id']:
            return Order.getAllParents(parent_data, parents)
        return parents
        
    
    @staticmethod
    def getAllChildren(order_info, children):
        cursor = mysql.connect().cursor()
        cursor.execute("""SELECT o.*,
                IF((select count(*) from orders co where co.parent_id=o.order_id)>0, 1, 0) as is_parent
                FROM orders o WHERE o.parent_id = %s""",(order_info['order_id'],))
        child_data = Utils.fetchOneAssoc(cursor)
        cursor.close()
        children.append(child_data)

        if child_data['is_parent']:
            return Order.getAllChildren(child_data, children)
        return children

    @staticmethod
    def getCharge(order_charge):
        if not order_charge:
            return int(webapp.config['DEFAULT_RETURN_DAYS'] * webapp.config['NEW_READING_RATE'])
        else:
            return order_charge


    @staticmethod
    def placeOrder(order_data):
        order_data['collection_id'] = Utils.getParam(order_data, 'collection_id', 'int', None)
        if order_data['collection_id']:
            collection = Collection(order_data['collection_id']).getObj()
            order_data['item_id'] = collection['item_ids']
        else:
            order_data['item_id'] = order_data['item_id']
        order_data['item_id'] = [int(_) for _ in order_data['item_id'].split(',')]
        order_data['user_id'] = int(order_data['user_id'])

        if 'address_id' in order_data:
            order_data['address'] = {}
            order_data['address']['address_id'] = int(order_data['address_id'])
        else:
            order_data['address'] = json.loads(order_data['address'])
        if 'delivery_charge' not in order_data['address']:
            order_data['address'] = User.getAddressInfo(order_data['address']['address_id']) 

        order_data['payment_mode'] = Utils.getParam(order_data, 'payment_mode',
                default = 'cash')
        order_data['order_placed'] = Utils.getCurrentTimestamp()
        order_data['delivery_slot'] = Utils.getParam(order_data, 'delivery_slot', 
                'int', Utils.getDefaultTimeSlot())
        order_data['delivery_date'] = Utils.getParam(order_data, 'delivery_date', default = order_data['order_placed'])

        custom_data = Item.getCustomProperties(order_data['item_id'], collection if order_data['collection_id'] else None)
        order_data['order_return'] = Utils.getParam(order_data, 'order_return', default = Utils.getDefaultReturnTimestamp(order_data['delivery_date'], custom_data['custom_return_days'])) 
        order_data['bought'] = 1 if Utils.getParam(order_data, 'buy', default='false') == 'true' else 0
        if order_data['bought']:
            order_data['order_amount'] = custom_data['selling_price']
        else:
            order_data['order_amount'] = custom_data['custom_price'] + order_data['address']['delivery_charge']#Utils.getParam(order_data, 'price', 'float', default=custom_data['price'] + order_data['address']['delivery_charge'])
        order_data['source'] = Utils.getParam(order_data, 'ref', default='android')

        #check order validity
        # TODO check if item exists
        # TODO check for timeslot (exists or not)

        # User validity
        user = User(order_data['user_id'], 'user_id')
        user_not_valid = Order.isUserValidForOrder(user, order_data)
        if user_not_valid:
            return user_not_valid

        if order_data['source'] == 'web':
            if not user.phone:
                phone = Utils.getParam(order_data, 'phone')
                if not phone:
                    return {'message': 'Phone number missing'}
                else:
                    user.editDetails({'phone': phone})

        connect = mysql.connect() 
        insert_data_cursor = connect.cursor()
        insert_data_cursor.execute("""INSERT INTO orders (user_id, 
                address_id, 
                order_placed, 
                order_return,
                delivery_date,
                delivery_slot, 
                pickup_slot, 
                payment_mode,
                from_collection, 
                charge,
                source, 
                bought) 
                VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""  
                ,(order_data['user_id'], 
                    order_data['address']['address_id'], 
                    order_data['order_placed'], 
                    order_data['order_return'], 
                    order_data['delivery_date'], 
                    order_data['delivery_slot'], 
                    order_data['delivery_slot'], 
                    order_data['payment_mode'],
                    order_data['collection_id'],
                    order_data['order_amount'],
                    order_data['source'],
                    order_data['bought']))
        connect.commit()
        order_id = insert_data_cursor.lastrowid
        insert_data_cursor.close()
        response = {'order_id': order_id}

        order = Order(order_id)
        order.updateInventoryPostOrder(order_data['item_id'], order_data['user_id'])

        if order_data['payment_mode'] == 'wallet':
            Wallet.debitTransaction(user.wallet_id, user.user_id, 'order', order_id, order_data['order_amount']) 

        order.sendOrderNotification(1, user)
        Utils.notifyAdmin(user.user_id, 'Order')
        
        if Utils.getParam(order_data, 'phone', default=user.phone) != user.phone: 
            user.editDetails({'phone': order_data['phone']})
        return response 

    @async
    def sendOrderNotification(self, status_id, user=None):
        order_info = self.getOrderInfo()
        status_info = self.getOrderStatusDetails(order_info['order_status']) 
        
        notification_id = 3
        if status_id == 6:
            notification_id = 4
        if status_id == 1:
            if 'collection' not in order_info:
                # Notification message formatting
                order_item = order_info['items'][0]
                if len(order_item['item_name']) > 35:
                    item_name_ellipse = order_item['item_name'][:35] + '..'
                elif len(order_item['item_name']) + len(order_item['author']) <= 32:
                    item_name_ellipse = order_item['item_name'] +' by '+ order_item['author']
                else:
                    item_name_ellipse = order_item['item_name']
                entity_name = order_item['item_name']
            else:
                if len(order_info['collection']['name']) > 35:
                    item_name_ellipse = order_info['collection']['name'][:35] + '..'
                else:
                    item_name_ellipse = order_info['collection']['name']
                entity_name = order_info['collection']['name']

            status_info["Description"] = status_info["Description"]%item_name_ellipse

            day_today = datetime.datetime.now(pytz.timezone('Asia/Calcutta')).day
            delivery_day = datetime.datetime.strptime(order_info['delivery_date'],"%Y-%m-%d %H:%M:%S")
            if day_today == delivery_day.day:
                day = "Today"
            else:
                day_tomorrow = (datetime.datetime.now(pytz.timezone('Asia/Calcutta'))+datetime.timedelta(days=1)).day
                if day_tomorrow == delivery_day.day:
                    day = "Tomorrow"
                else:
                    day = "on " + delivery_day.strftime("%A")
            status_info["expanded_text"] = status_info["expanded_text"]%(entity_name, day)

        if 'collection' in order_info:
            status_info['Status'] = status_info['Status'].replace('Book', 'Book set')
            status_info['Description'] = status_info['Description'].replace('book', 'book set')
            if 'expanded_text' in status_info:
                status_info['expanded_text'] = status_info['expanded_text'].replace('book', 'book set')
        notification_data = {
                    "notification_id": notification_id,
                    "entity_id": order_info['order_id'],
                    "title": status_info["Status"],
                    "message": status_info["Description"],
                    "expanded_text": status_info["Description"] if "expanded_text" not in status_info else status_info["expanded_text"],
                    "order_type": "borrow"
                }

        if user is None:
            user = User(order_info['user_id'], 'user_id')
        Notifications(user.gcm_id).sendNotification(notification_data)


    def updateInventoryPostOrder(self, item_ids, user_id):
        inventory_ids = self.getInventoryIds(item_ids) 

        #update order_history and clear stock in inventory
        connect = mysql.connect()
        for inventory_item in inventory_ids:
            order_history_cursor = connect.cursor()
            order_history_cursor.execute("INSERT INTO order_history (inventory_id, \
                    item_id, order_id) VALUES (%d, %d, %d)" %(inventory_item['inventory_id'], \
                    inventory_item['item_id'], self.order_id))
            connect.commit()
            order_history_cursor.close()

            # NOTE preventing inventory count messup from admins
            if user_id not in Utils.getAdmins(): 
                update_stock_cursor = connect.cursor()
                update_stock_cursor.execute("UPDATE inventory SET in_stock = 0 WHERE \
                        inventory_id = %d" % (inventory_item['inventory_id']))
                connect.commit()
                Indexer().indexItems(query_condition=' AND i.item_id='+str(inventory_item['item_id']))
                update_stock_cursor.close()

    def getInventoryIds(self, item_ids):
        # Incremental Inventory Logic
        #   in_stock: Item is in inventory (not with a user)
        #   fetched: Item has been acquired
        #     
        #   During order, check if acuquired item is in inventory
        #   If not, insert a new item (to be purchased now), which is not yet
        #   bought(thus, fetched=0). 
        #   fetched=1 happens when 
        #   1.status is changed from the dashboard while entering other 
        #     inventory info (price, isbn)
        #   2. Order status changes to 2(en route).(In case the change was not
        #     made form dashboard.

        inventory_ids = []
        for item_id in item_ids:
            item_check_cursor = mysql.connect().cursor()
            item_check_cursor.execute("""SELECT inventory_id FROM
                    inventory WHERE item_id = %d AND in_stock = 1 
                    AND fetched = 1""" % (item_id))
            inv_items = item_check_cursor.fetchall()
            item_check_cursor.close()

            if inv_items: 
                inventory_ids.append({
                    'inventory_id': inv_items[0][0],
                    'item_id': item_id
                    })
            else:
                connect = mysql.connect()
                insert_inv_item = connect.cursor()
                insert_inv_item.execute("INSERT INTO inventory (item_id) VALUES ('%s')" %(item_id))
                connect.commit()
                new_inv_id = insert_inv_item.lastrowid
                insert_inv_item.close()

                inventory_ids.append({
                    'inventory_id': new_inv_id,
                    'item_id': item_id
                    })
    
        return inventory_ids

    @staticmethod
    def isUserValidForOrder(user, order_data):
        if user.getObj() is None:
            return {'message': 'User does not exist'}
      
        if webapp.config['APP_ENV'] != 'dev': 
            # IF the user is already possessing the book
            cursor = mysql.connect().cursor()
            cursor.execute("""SELECT COUNT(*) FROM orders o
                INNER JOIN order_history oh ON oh.order_id=o.order_id
                WHERE o.user_id = %s AND  oh.item_id IN (%s) AND o.order_status < 5""",
                (user.user_id, ','.join([str(_) for _ in order_data['item_id']])))
            if cursor.fetchone()[0]:
                return ({
                    'title': 'Book Already Ordered',
                    'message': 'It seems you have already ordered this book from Ostrich. Please check the "My Orders" section.'}, 
                    'HTTP_STATUS_CODE_CLIENT_ERROR')

        # User can only own 2 book @ a time
        if webapp.config['USER_BOOKS_LIMIT']:
            user_orders = user.getAllOrders()
            if (len(user_orders['ordered']) + len(user_orders['reading'])) >= 2:
                #TODO enable this
                #Mailer.excessOrder(user.user_id, order_data['item_id'])
                return ({
                    'title': 'Order Limit Reached',
                    'message': 'You can keep a maximum of 2 books at a time. Please return a book that you are not reading from the "My Orders" section and try ordering again.'}, 
                    'HTTP_STATUS_CODE_ORDER_LIMIT_EXCEEDED')

        # Wallet validity 
        if order_data['payment_mode'] == 'wallet' and user.wallet_balance < order_data['order_amount']:
            current_balance = str(user.wallet_balance) if user.wallet_balance is not None else "0.0"
            return ({
                'title': 'Not Enough Credits',
                'message': 'Your current balance '+current_balance+' is not enough for this order. Choose the Cash option and please order again.'}, 
                'HTTP_STATUS_CODE_CLIENT_ERROR')

        # Since Address is editable before placing order
        if not user.validateUserAddress(order_data['address']):
            return {'message': 'Address not associated'}

        return None


    def getOrderStatusForUser(self, user_id):
        get_status_cursor = mysql.connect().cursor()
        get_status_cursor.execute("SELECT o.order_status, i.item_id FROM orders o \
                INNER JOIN order_history i \
                ON o.order_id = i.order_id \
                WHERE o.order_id = %d \
                AND o.user_id = %d" 
                % (self.order_id, user_id))

        status = get_status_cursor.fetchone()
        if status:
            status_id = int(status[0])
        else:
            return False

        order_info = {}
        if status_id:
            order_info['status_details'] = Order.getOrderStatusDetails(status_id)
            order_info['item'] = Item(int(status[1])).getObj()

        return order_info

    @staticmethod
    def purchaseItem(data):
        conn = mysql.connect()
        cursor = conn.cursor()
        cursor.execute("""UPDATE orders SET bought = 1, charge = charge + %s, 
                bought_on = CURRENT_TIMESTAMP 
                WHERE order_id = %s""", (int(data['price']), data['order_id']))
        conn.commit()
        return True

    @staticmethod    
    def getTimeSlot(slot_id=None, active=0):
        query_cond = " WHERE active = 1" if active else ""

        time_slot_cursor = mysql.connect().cursor()
        time_slot_cursor.execute("SELECT * FROM time_slots" + query_cond)
        num_slots = time_slot_cursor.rowcount

        time_slots = []
        for slot in range(num_slots):
            time_slots.append(Utils.fetchOneAssoc(time_slot_cursor))

        time_slot_cursor.close()
        if slot_id:
            time_slots = [_ for _ in time_slots if _['slot_id'] == slot_id][0]
        return time_slots


    def updateOrderStatus(self, status_id):
        conn = mysql.connect()
        update_cursor = conn.cursor()
      
        all_orders = self.getOrderInfo(fetch_all=True)
        if 'order' in all_orders:
            all_order_ids = Order.fetchAllOrderIds(all_orders)
            order_info = all_orders['order']
        else:
            all_order_ids = str(all_orders['order_id'])
            order_info = all_orders

        update_cursor.execute("UPDATE orders SET order_status = %s WHERE order_id IN ("+all_order_ids+")"
                ,(status_id, ))
        conn.commit()

        # Update inventory and respective dates
        current_ts = datetime.datetime.now(pytz.timezone('Asia/Calcutta'))

        if status_id == 7:
            update_cursor.execute("""UPDATE inventory SET in_stock = 1 WHERE 
                    inventory_id IN (SELECT inventory_id FROM order_history WHERE
                    order_id = %s)""", (self.order_id,))
            conn.commit()

            update_cursor.execute("UPDATE orders SET order_return = %s WHERE order_id = %s",
                    (current_ts, self.order_id,)) 
            conn.commit()
            self.logEditOrderDetails(
                    {'order_return': current_ts}, 
                    {'order_return': order_info['order_return']}, 
                    ['order_return'])

        elif status_id == 2:
            update_cursor.execute("""UPDATE inventory SET fetched = 1 WHERE
                    inventory_id IN (SELECT inventory_id FROM order_history WHERE
                    order_id = %s)""", (self.order_id,))
            conn.commit()

        elif status_id == 4:
            item_return_days = Item.getCustomProperties(order_info['items'], order_info['collection'] if order_info['from_collection'] else None)['custom_return_days']
            new_order_return = Utils.getDefaultReturnTimestamp(current_ts, item_return_days)
            update_cursor.execute("""UPDATE orders SET delivery_date = %s, 
                    order_return = %s WHERE order_id = %s""",
            (current_ts, new_order_return, self.order_id)) 
            conn.commit()
            self.logEditOrderDetails(
                    {'delivery_date': current_ts, 'order_return': new_order_return}, 
                    {'delivery_date': order_info['delivery_date'], 'order_return': order_info['order_return']}, 
                    ['delivery_date', 'order_return'])

        update_cursor.close()
        if status_id in [3, 4, 5, 6]:
            self.sendOrderNotification(status_id) 
        elif status_id == 7:
            Indexer().indexItems(query_condition=' AND i.item_id IN ('+",".join([str(_['item_id']) for _ in self.getOrderInfo()['items']]) +")")
        return self.getOrderInfo() 

    def editOrderDetails(self, order_data):
        conn = mysql.connect()
        update_cursor = conn.cursor()

        all_orders = self.getOrderInfo(fetch_all=True)
        if 'order' in all_orders:
            all_order_ids = Order.fetchAllOrderIds(all_orders)
            order_info = all_orders['order']
        else:
            order_info = all_orders
            all_order_ids = str(order_info['order_id'])

        if 'pickup_slot' in order_data:
            if not order_data['pickup_slot'].isdigit():
                return False
            else:
                order_data['pickup_slot'] = int(order_data['pickup_slot'])
                slot_exists = False
                for slot in Order.getTimeSlot():
                    if slot['slot_id'] == order_data['pickup_slot']:
                        slot_exists = True
                        break
                if not slot_exists:
                    return False
                update_cursor.execute("""UPDATE orders SET pickup_slot = %s 
                        WHERE order_id IN ("""+all_order_ids+""")""",(order_data['pickup_slot'],))
                conn.commit()
                status = True if update_cursor.rowcount else False

        if 'order_return' in order_data:
            # Wallet validity 
            if 'extend_payment_mode' in order_data and order_data['extend_payment_mode'] == 'wallet':
                user = User(order_info['user_id'])
                if 'extend_charges' in order_data and int(order_data['extend_charges']) > user.wallet_balance:
                    return False

            old_order_return = datetime.datetime.strptime(order_info['order_return'], "%Y-%m-%d %H:%M:%S")
            new_order_return = datetime.datetime.strptime(order_data['order_return'], "%Y-%m-%d %H:%M:%S")
            diff = new_order_return - old_order_return
            if diff.days <= 0:
                update_cursor.execute("""UPDATE orders SET order_return = %s
                        WHERE order_id IN ("""+all_order_ids+""")""",(order_data['order_return'],))
                conn.commit()
                status = True if update_cursor.rowcount else False
            else:
                # NOTE Order Extend is a new order
                update_cursor.execute("""INSERT INTO orders 
                    (user_id, 
                    address_id, 
                    order_status,
                    order_return,
                    pickup_slot, 
                    delivery_date,
                    delivery_slot,
                    charge,
                    payment_mode,
                    from_collection,
                    parent_id) 
                    VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""  
                    ,(order_info['user_id'], 
                    order_info['address_id'], 
                    order_info['order_status'],
                    order_data['order_return'], 
                    order_info['pickup_slot'],
                    order_info['delivery_date'],
                    order_info['delivery_slot'],
                    order_data['extend_charges'] if 'extend_charges' in order_data else order_info['charge'],
                    order_data['extend_payment_mode'] if 'extend_payment_mode' in order_data else 'cash',
                    order_info['from_collection'],
                    self.order_id))
                conn.commit()
                child_order_id = update_cursor.lastrowid
                status = True if update_cursor.rowcount else False
                
                for i, item in enumerate(order_info['items']):
                    update_cursor.execute("""INSERT INTO order_history 
                        (inventory_id, item_id, order_id) VALUES (%s, %s, %s)""",
                        (order_info['inventory_ids'][i], item['item_id'], child_order_id))
                    conn.commit()
                if 'extend_payment_mode' in order_data and order_data['extend_payment_mode'] == 'wallet':
                    debit_amount = order_data['extend_charges'] if 'extend_charges' in order_data else order_info['charge'] 
                    Wallet.debitTransaction(user.wallet_id, user.user_id, 'order', child_order_id, debit_amount) 

        self.logEditOrderDetails(order_data, order_info, ['order_return', 'pickup_slot', 'charge'])
        return status

    @async
    def logEditOrderDetails(self, order_data, order_info, fields):
        conn = mysql.connect()
        update_cursor = conn.cursor()
        for key in fields:
            if key in order_data and order_data[key] != order_info[key]:
                update_cursor.execute("""INSERT INTO edit_order_log (order_id, 
                `key`, old_value, new_value) VALUES (%s, %s, %s, %s)""",
                (self.order_id, key, str(order_info[key]), str(order_data[key])))
                conn.commit()


    @staticmethod
    def fetchAllOrderIds(all_orders):
        all_order_ids = []
        for key in all_orders.keys():
            value = all_orders[key]
            if isinstance(value, list):
                all_order_ids.extend([_['order_id'] for _ in value])
            else:
                all_order_ids.append(value['order_id'])
        return ",".join([str(_) for _ in all_order_ids])

    @staticmethod
    def getAreasForOrder():
        from app import cache
        cache_key = 'areas'
        areas = cache.get(cache_key)
        if areas:
            return areas
        cursor = mysql.connect().cursor()
        cursor.execute("""SELECT * FROM areas WHERE active=1""")
        num_areas = cursor.rowcount
        
        areas = {}
        for area in range(num_areas):
            area_data = Utils.fetchOneAssoc(cursor)
            areas[area_data['name']] = area_data
        cache.set(cache_key, areas)
        return areas

    @staticmethod
    def getTimeSlotsForOrder(interval=6):
        next_timeslotid = Utils.getDefaultTimeSlot(interval)
        all_timeslots = Order.getTimeSlot(active=1)
        for ts in all_timeslots:
            if ts['slot_id'] == next_timeslotid:
                next_timeslot = ts
                break
        order_timeslots = [next_timeslot] + Utils.getNextTimeslots(next_timeslot['start_time'], all_timeslots, 2)
        return Utils.formatTimeSlots(order_timeslots)

    @staticmethod
    def deleteOrder(order_id):
        #TODO support multiple items
        conn = mysql.connect()
        delete_cursor = conn.cursor()
        
        all_orders = Order(order_id).getOrderInfo(fetch_all=True)
        if 'order' in all_orders:
            all_order_ids = Order.fetchAllOrderIds(all_orders)
            order_info = all_orders['order']
        else:
            order_info = all_orders
            all_order_ids = str(order_info['order_id'])

        if order_info is None:
            return {'status':'false'}


        delete_cursor.execute("""SELECT inventory_id FROM order_history WHERE
        order_id = %d""" %(order_id))
        inventory_id = delete_cursor.fetchone()[0]

        q_cond = """ AND fetched = 1"""

        delete_cursor.execute("""DELETE FROM inventory WHERE inventory_id =
        """+ str(inventory_id) + q_cond) 
        conn.commit()
        
        delete_cursor.execute("DELETE orders, order_history FROM orders INNER JOIN \
        order_history WHERE orders.order_id = order_history.order_id AND orders.order_id IN ("+all_order_ids+")")
        conn.commit()
        delete_cursor.close()
        return {'status':'true'}


    @staticmethod
    def getOrderStatusDetails(status_id):
        status_info = {
                1: {
                    "Status": "Order Placed",
                    "Description": "%s",
                    "expanded_text" : "Your order for the book \"%s\" has been placed successfully. The book will be delivered %s."
                    },
                2: {
                    "Status": "Picked Up",
                    "Description": "Your order has been picked up for delivery."
                    },
                3: {
                    "Status": "Out for Delivery",
                    "Description": "Your book is on its way."
                    },
                4: {
                    "Status": "Book Delivered",
                    "Description": "Enjoy reading your book and don't forget to rate it."
                    },
                5: {
                    "Status": "Out for Pickup",
                    "Description": "We're on our way to pick up the book."
                    },
                6: {
                    "Status": "Book Picked Up",
                    "Description": "Thank you for using Ostrich. We hope you enjoyed your book.",
                    "expanded_text" : "Thank you for using Ostrich. We hope you enjoyed your book. Would you like to order another?"
                    },
                7: {
                    "Status": "Returned",
                    "Description": "Order has been retured to the inventory."
                    },
                8: {
                    "Status": "Book Purchased",
                    "Description": "Enjoy reading your book and don't forget to rate it."
                    }
                }
        
        if status_id in status_info:
            return status_info[status_id]
        else:
            return False
