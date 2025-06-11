from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Transaction, Category # Models only
from extensions import db # Extensions here
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('', methods=['GET'])
@jwt_required()
def get_transactions():
    try:
        user_id = get_jwt_identity()
        
        # Get query parameters
        category_id = request.args.get('category')
        transaction_type = request.args.get('type')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        limit = request.args.get('limit', type=int)
        
        # Base query
        query = Transaction.query.filter_by(user_id=user_id)
        
        # Apply filters
        if category_id:
            query = query.filter_by(category_id=category_id)
        if transaction_type:
            query = query.filter_by(type=transaction_type)
        if start_date:
            query = query.filter(Transaction.date >= datetime.strptime(start_date, '%Y-%m-%d').date())
        if end_date:
            query = query.filter(Transaction.date <= datetime.strptime(end_date, '%Y-%m-%d').date())
            
        # Order by date
        query = query.order_by(Transaction.date.desc())
        
        # Apply limit
        if limit:
            query = query.limit(limit)
            
        transactions = query.all()
        return jsonify([transaction.to_dict() for transaction in transactions])
        
    except Exception as e:
        logger.error(f'Error fetching transactions: {str(e)}')
        return jsonify({'error': 'Failed to fetch transactions'}), 500

@transactions_bp.route('', methods=['POST'])
@jwt_required()
def add_transaction():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    amount = data.get('amount')
    category_id = data.get('category_id')
    description = data.get('description')
    date_str = data.get('date') # Expecting YYYY-MM-DD
    transaction_type = data.get('type') # 'income' or 'expense'

    if not all([amount, category_id, date_str, transaction_type]):
        return jsonify({"msg": "Missing required fields"}), 400
    
    if transaction_type not in ['income', 'expense']:
        return jsonify({"msg": "Invalid transaction type"}), 400

    try:
        amount = float(amount)
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"msg": "Invalid amount or date format"}), 400

    category = Category.query.filter_by(id=category_id, user_id=current_user_id).first()
    if not category:
        return jsonify({"msg": "Category not found or does not belong to user"}), 404

    new_transaction = Transaction(
        user_id=current_user_id,
        category_id=category_id,
        amount=amount,
        description=description,
        date=date,
        type=transaction_type
    )
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify(new_transaction.to_dict()), 201

@transactions_bp.route('/<int:transaction_id>', methods=['GET'])
@jwt_required()
def get_transaction(transaction_id):
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=current_user_id).first()
    if not transaction:
        return jsonify({"msg": "Transaction not found"}), 404
    return jsonify(transaction.to_dict())

@transactions_bp.route('/<int:transaction_id>', methods=['PUT'])
@jwt_required()
def update_transaction(transaction_id):
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=current_user_id).first()
    if not transaction:
        return jsonify({"msg": "Transaction not found"}), 404

    data = request.get_json()
    
    if 'amount' in data:
        try:
            transaction.amount = float(data['amount'])
        except ValueError:
             return jsonify({"msg": "Invalid amount format"}), 400
    if 'category_id' in data:
        category = Category.query.filter_by(id=data['category_id'], user_id=current_user_id).first()
        if not category:
             return jsonify({"msg": "Category not found or does not belong to user"}), 404
        transaction.category_id = data['category_id']
    if 'description' in data:
        transaction.description = data['description']
    if 'date' in data:
        try:
            transaction.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"msg": "Invalid date format"}), 400
    if 'type' in data:
        if data['type'] not in ['income', 'expense']:
            return jsonify({"msg": "Invalid transaction type"}), 400
        transaction.type = data['type']

    db.session.commit()
    return jsonify(transaction.to_dict())

@transactions_bp.route('/<int:transaction_id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(transaction_id):
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=current_user_id).first()
    if not transaction:
        return jsonify({"msg": "Transaction not found"}), 404

    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"msg": "Transaction deleted successfully"})