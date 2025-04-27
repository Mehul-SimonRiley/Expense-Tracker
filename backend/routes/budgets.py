from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Budget, Category, Transaction # Models only
from extensions import db # Extensions here
from datetime import datetime
from sqlalchemy import func, extract
import logging

logger = logging.getLogger(__name__)
budgets_bp = Blueprint('budgets', __name__)

@budgets_bp.route('', methods=['POST'])
@jwt_required()
def add_budget():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    category_id = data.get('category_id')
    amount = data.get('amount')
    start_date_str = data.get('start_date') # Expecting YYYY-MM-DD
    end_date_str = data.get('end_date')     # Expecting YYYY-MM-DD

    if not all([category_id, amount, start_date_str, end_date_str]):
        logger.error("Missing required fields: category_id, amount, start_date, end_date")
        return jsonify({"msg": "Missing required fields (category_id, amount, start_date, end_date)"}), 400

    try:
        amount = float(amount)
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        if start_date > end_date:
            raise ValueError("Start date cannot be after end date")
    except ValueError as e:
        logger.error(f"Invalid input format: {e}")
        return jsonify({"msg": f"Invalid input format: {e}"}), 400

    category = Category.query.filter_by(id=category_id, user_id=current_user_id).first()
    if not category:
        logger.warning(f"Category not found or not owned by user {current_user_id}: category_id {category_id}")
        return jsonify({"msg": "Category not found or does not belong to user"}), 404
    
    # Check for overlapping budgets for the same category and user
    # A new budget overlaps if its start is before an existing end AND its end is after an existing start
    overlapping_budget = Budget.query.filter(
        Budget.user_id == current_user_id,
        Budget.category_id == category_id,
        Budget.start_date <= end_date,
        Budget.end_date >= start_date
    ).first()

    if overlapping_budget:
        logger.warning(f"Overlapping budget exists for user {current_user_id}, category {category_id}")
        return jsonify({"msg": "Budget for this category overlaps with an existing budget period"}), 409

    new_budget = Budget(
        user_id=current_user_id,
        category_id=category_id,
        amount=amount,
        start_date=start_date,
        end_date=end_date
        # Keep defaults for spent, alert_threshold, alert_enabled
    )
    try:
        db.session.add(new_budget)
        db.session.commit()
        logger.info(f"Budget created successfully for user {current_user_id}, category {category_id}")
        return jsonify(new_budget.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Database error creating budget: {e}")
        return jsonify({"msg": "Failed to create budget due to database error"}), 500

@budgets_bp.route('', methods=['GET'])
@jwt_required()
def get_budgets():
    current_user_id = get_jwt_identity()
    start_date_str = request.args.get('start_date') # Optional: YYYY-MM-DD
    end_date_str = request.args.get('end_date')     # Optional: YYYY-MM-DD
    category_id = request.args.get('category_id', type=int) # Optional

    query = Budget.query.filter_by(user_id=current_user_id)

    try:
        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            # Find budgets that end on or after the requested start date
            query = query.filter(Budget.end_date >= start_date)
        if end_date_str:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            # Find budgets that start on or before the requested end date
            query = query.filter(Budget.start_date <= end_date)
    except ValueError:
        return jsonify({"msg": "Invalid date format. Use YYYY-MM-DD."}), 400

    if category_id:
        query = query.filter_by(category_id=category_id)

    # Order by start date, most recent first
    budgets = query.order_by(Budget.start_date.desc()).all()

    budgets_data = []
    for budget in budgets:
        budget_dict = budget.to_dict()
        # Calculate current spending within the budget's timeframe and category
        current_spending = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == current_user_id,
            Transaction.category_id == budget.category_id,
            Transaction.type == 'expense',
            Transaction.date >= budget.start_date,
            Transaction.date <= budget.end_date
        ).scalar() or 0.0
        budget_dict['current_spending'] = round(current_spending, 2)
        budget_dict['category_name'] = budget.category.name # Add category name
        budgets_data.append(budget_dict)

    return jsonify(budgets_data)

@budgets_bp.route('/<int:budget_id>', methods=['GET'])
@jwt_required()
def get_budget(budget_id):
    current_user_id = get_jwt_identity()
    budget = Budget.query.filter_by(id=budget_id, user_id=current_user_id).first()
    if not budget:
        logger.warning(f"Budget {budget_id} not found for user {current_user_id}")
        return jsonify({"msg": "Budget not found"}), 404

    budget_dict = budget.to_dict()
    # Calculate current spending within the budget's timeframe and category
    current_spending = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user_id,
        Transaction.category_id == budget.category_id,
        Transaction.type == 'expense',
        Transaction.date >= budget.start_date,
        Transaction.date <= budget.end_date
    ).scalar() or 0.0
    budget_dict['current_spending'] = round(current_spending, 2)
    budget_dict['category_name'] = budget.category.name

    return jsonify(budget_dict)

@budgets_bp.route('/<int:budget_id>', methods=['PUT'])
@jwt_required()
def update_budget(budget_id):
    current_user_id = get_jwt_identity()
    budget = Budget.query.filter_by(id=budget_id, user_id=current_user_id).first()
    if not budget:
        logger.warning(f"Update failed: Budget {budget_id} not found for user {current_user_id}")
        return jsonify({"msg": "Budget not found"}), 404

    data = request.get_json()
    updated_fields = []

    try:
        if 'amount' in data:
            budget.amount = float(data['amount'])
            updated_fields.append('amount')

        new_start_date = budget.start_date
        new_end_date = budget.end_date
        dates_changed = False

        if 'start_date' in data:
            new_start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
            dates_changed = True
            updated_fields.append('start_date')
        
        if 'end_date' in data:
            new_end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
            dates_changed = True
            updated_fields.append('end_date')

        if dates_changed:
            if new_start_date > new_end_date:
                raise ValueError("Start date cannot be after end date")
            
            # Check for overlaps with OTHER budgets if dates are changed
            overlapping_budget = Budget.query.filter(
                Budget.id != budget_id, # Exclude the current budget
                Budget.user_id == current_user_id,
                Budget.category_id == budget.category_id,
                Budget.start_date <= new_end_date,
                Budget.end_date >= new_start_date
            ).first()

            if overlapping_budget:
                logger.warning(f"Update conflict for budget {budget_id}: Overlaps with budget {overlapping_budget.id}")
                return jsonify({"msg": "Proposed date range overlaps with another budget for this category"}), 409
            
            budget.start_date = new_start_date
            budget.end_date = new_end_date
            
        if 'alert_threshold' in data:
            budget.alert_threshold = float(data['alert_threshold'])
            updated_fields.append('alert_threshold')
        
        if 'alert_enabled' in data:
            budget.alert_enabled = bool(data['alert_enabled'])
            updated_fields.append('alert_enabled')
            
    except ValueError as e:
        logger.error(f"Invalid format during budget update: {e}")
        return jsonify({"msg": f"Invalid format: {e}"}), 400
    except Exception as e:
        logger.error(f"Unexpected error during budget update parsing: {e}")
        return jsonify({"msg": "An unexpected error occurred processing the update"}), 500

    if updated_fields:
        try:
            db.session.commit()
            logger.info(f"Budget {budget_id} updated fields: {', '.join(updated_fields)} for user {current_user_id}")
        except Exception as e:
            db.session.rollback()
            logger.error(f"Database error updating budget {budget_id}: {e}")
            return jsonify({"msg": "Failed to update budget due to database error"}), 500

    # Return the updated budget with potentially recalculated spending
    budget_dict = budget.to_dict()
    current_spending = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user_id,
        Transaction.category_id == budget.category_id,
        Transaction.type == 'expense',
        Transaction.date >= budget.start_date,
        Transaction.date <= budget.end_date
    ).scalar() or 0.0
    budget_dict['current_spending'] = round(current_spending, 2)
    budget_dict['category_name'] = budget.category.name

    return jsonify(budget_dict)

@budgets_bp.route('/<int:budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    current_user_id = get_jwt_identity()
    budget = Budget.query.filter_by(id=budget_id, user_id=current_user_id).first()
    if not budget:
        return jsonify({"msg": "Budget not found"}), 404

    db.session.delete(budget)
    db.session.commit()
    return jsonify({"msg": "Budget deleted successfully"})