from app import webapp
from app.models import *
from flask import request, jsonify
from app.models import Notifications
from app.decorators import is_user
import json

'''
    Make order call
    @params
        item_id,
        user_id,
        address_id

        optional:
        payment_mode: {cash, wallet} (for now)
        order_return: Y-m-d

    @response
        status
        message: on error
        order_id: on success

'''
@webapp.route('/order', methods=['POST'])
@is_user
def orderItem():
  
    temp_response = {'status':'Order Failed', 'message': 'Sorry, we are currently offline. We\'ll resume our services shortly.'}
    #return Utils.errorResponse(temp_response)

    order_data = {}
    for key in request.form:
        order_data[key] = request.form[key]

    order_placed = Order.placeOrder(order_data)
    if 'order_id' in order_placed and order_placed['order_id']:
        if 'App-Version' in request.headers:
            Admin.updateOrderComment({'order_id': order_placed['order_id'], 
                'comment': 'App Version: '+request.headers.get('App-Version')+'\n',
                'order_type': 'borrow',
                'edited': 0})
        order_placed['status'] = 'True'
        return jsonify(order_placed)
    else:
        if isinstance(order_placed, dict):
            return Utils.errorResponse(order_placed)
        else:
            # VERSION SPECIFIC
            if order_placed[1] =='HTTP_STATUS_CODE_ORDER_LIMIT_EXCEEDED':
                if 'App-Version' in request.headers:
                    if int(request.headers.get('App-Version')) >= 6030000:
                        order_placed = (order_placed[0], 'HTTP_STATUS_CODE_CLIENT_ERROR') 
                    else:
                        order_placed = (order_placed[0], 'HTTP_STATUS_CODE_ERROR')
                else:
                    order_placed = (order_placed[0], 'HTTP_STATUS_CODE_CLIENT_ERROR') 

            return Utils.errorResponse(order_placed[0], order_placed[1])
            

'''
    Put an item on rent
    @params
        user_id: The current user's id
        item_id: The item's id (correspoding to the DB)
        pickup_date: Y-m-d H:i:s 
        pickup_slot: slot id for picking up from user
        delivery_date: Date of delivery back
        delivery_slot: time slot id for delivring back the object
        item_condition: Description condition of item

    @response
        inventory_id(optional)
        message(optional)
'''
@webapp.route('/lend', methods=['POST'])
def lendItem():
    lend_data = {}
    for key in request.form:
        lend_data[key] = request.form[key]
    lend_info = Lend.lendItem(lend_data)

    if 'inventory_id' in lend_info and lend_info['inventory_id']:
        if 'App-Version' in request.headers:
            Admin.updateOrderComment({'order_id': lend_info['lender_id'], 
                'comment': 'App Version: '+request.headers.get('App-Version')+'\n',
                'order_type': 'lend',
                'edited': 0})
        return jsonify(lend_info)
    else:
        if isinstance(lend_info, dict):
            return Utils.errorResponse(lend_info)
        else:
            return Utils.errorResponse(lend_info[0], lend_info[1])

@webapp.route('/fetchOrder')
def fetchOrder():
    response = {"status": "False"}

    order_id = Utils.getParam(request.args, 'order_id', 'int')
    if not order_id:
        return Utils.errorResponse(response, 'HTTP_STATUS_CODE_DATA_MISSING')

    order_info = Order(order_id).getOrderInfo(formatted=True)
    if order_info:
        order_info['address'] = User.getAddressInfo(order_info['address_id']) 
        return jsonify(order_info)
    else:
        return Utils.errorResponse(response)

@webapp.route('/buy', methods=['POST'])
def buyBook():
    Order.purchaseItem(request.form)
    return jsonify({'status': "True"})

'''
    Get the status of a current order
    @params
        user_id: The current user's id
        order_id: The order id received on placing the order

    @response
      on success:
      item: item snippet
      status_details : {Status, Description}

      on error:
      status
'''
@webapp.route('/orderStatus', methods=['POST'])
def orderStatus():
    response = {"status": "False"}

    user_id = Utils.getParam(request.form, 'user_id', 'int')
    order_id = Utils.getParam(request.form, 'order_id', 'int')

    # Asking for user_id to double check
    if not(user_id and order_id):
        return Utils.errorResponse(response, 'HTTP_STATUS_CODE_DATA_MISSING')

    order = Order(order_id)
    order_status = order.getOrderStatusForUser(user_id)
   
    if order_status:
        response = order_status
        return jsonify(response)
    else:
        return Utils.errorResponse(response)

@webapp.route('/editOrderDetails', methods=['POST'])
def editOrderDetails():
    response = {'status': 'False'}
    order_id = Utils.getParam(request.form, 'order_id', 'int')
    if not order_id:
        return Utils.errorResponse(response, 'HTTP_STATUS_CODE_DATA_MISSING')

    order_data = {}
    for key in request.form:
        order_data[key] = request.form[key]

    order = Order(order_id)
    status = order.editOrderDetails(order_data)
    if status:
        return jsonify(order.getOrderInfo(formatted=True))
    else:
        return Utils.errorResponse(response)


'''
    Request an item to be added to inventory if it's being put on rent
    @params
    item_type: books(for now)
    item_id: Item's unique ID in physical world
             eg. ISBN for books
    item_name

    @response
        status
'''
@webapp.route('/requestItem', methods=['POST'])
def requestItem():
    Item.storeItemRequest(request.form)
    return jsonify(status='True')


'''
    Returns time slots for delivery
    @response
        list of time slot objects: [{
                                   'slot_id',
                                   'start_time',
                                   'end_time'
                                   }]
'''
@webapp.route('/getTimeSlot')
def getTimeSlot():
    return jsonify(time_slots=Order.getTimeSlotsForOrder())


