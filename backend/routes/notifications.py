from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    # For demonstration, return some mock notifications
    notifications = [
        {
            'title': 'Budget Limit Approaching',
            'message': 'You have spent 80% of your Groceries budget.',
            'time': (datetime.now() - timedelta(hours=2)).strftime('%b %d, %I:%M %p')
        },
        {
            'title': 'New Transaction Added',
            'message': 'Electricity Bill of ₹1,500 was added.',
            'time': (datetime.now() - timedelta(days=1)).strftime('%b %d, %I:%M %p')
        },
        {
            'title': 'Monthly Report Ready',
            'message': 'Your April expense report is now available.',
            'time': (datetime.now() - timedelta(days=3)).strftime('%b %d, %I:%M %p')
        }
    ]
    return jsonify(notifications) 