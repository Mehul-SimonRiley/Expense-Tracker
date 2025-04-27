from functools import wraps
from flask import request, jsonify
from datetime import datetime
import re

def validate_date(date_str):
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return None

def validate_amount(amount):
    try:
        return float(amount) > 0
    except (ValueError, TypeError):
        return False

def validate_color(color):
    return bool(re.match(r'^#(?:[0-9a-fA-F]{3}){1,2}$', color))

def validate_transaction(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.get_json()
        
        # Required fields
        required_fields = ['description', 'amount', 'category_id', 'type', 'date']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
            
        # Validate amount
        if not validate_amount(data['amount']):
            return jsonify({'error': 'Invalid amount'}), 400
            
        # Validate date
        if not validate_date(data['date']):
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
            
        # Validate type
        if data['type'] not in ['income', 'expense']:
            return jsonify({'error': 'Invalid transaction type'}), 400
            
        return f(*args, **kwargs)
    return decorated_function

def validate_category(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.get_json()
        
        # Required fields
        if 'name' not in data:
            return jsonify({'error': 'Category name is required'}), 400
            
        # Validate color if provided
        if 'color' in data and not validate_color(data['color']):
            return jsonify({'error': 'Invalid color format. Use hex color code'}), 400
            
        return f(*args, **kwargs)
    return decorated_function

def validate_budget(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.get_json()
        
        # Required fields
        required_fields = ['category_id', 'amount', 'start_date', 'end_date']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
            
        # Validate amount
        if not validate_amount(data['amount']):
            return jsonify({'error': 'Invalid amount'}), 400
            
        # Validate dates
        if not all(validate_date(date) for date in [data['start_date'], data['end_date']]):
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
            
        # Validate date range
        start_date = validate_date(data['start_date'])
        end_date = validate_date(data['end_date'])
        if start_date and end_date and start_date > end_date:
            return jsonify({'error': 'Start date must be before end date'}), 400
            
        return f(*args, **kwargs)
    return decorated_function 