from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.transaction import Transaction
from models.category import Category
from models.budget import Budget
from extensions import db
from datetime import datetime, timedelta
from sqlalchemy import func
import logging

logger = logging.getLogger(__name__)
dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    current_user_id = get_jwt_identity()
    
    # Get current month's start and end dates
    today = datetime.now().date()
    month_start = today.replace(day=1)
    next_month = month_start.replace(day=28) + timedelta(days=4)
    month_end = next_month - timedelta(days=next_month.day)
    
    # Get previous month's dates for trend calculation
    prev_month_end = month_start - timedelta(days=1)
    prev_month_start = prev_month_end.replace(day=1)
    
    # Calculate total income and expenses (all time)
    all_time_totals = db.session.query(
        Transaction.type,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == current_user_id
    ).group_by(Transaction.type).all()
    
    total_income = 0.0
    total_expenses = 0.0
    for type_, total in all_time_totals:
        if type_ == 'income':
            total_income = round(total, 2)
        elif type_ == 'expense':
            total_expenses = round(total, 2)
    
    # Calculate current month's totals
    current_month_totals = db.session.query(
        Transaction.type,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == current_user_id,
        Transaction.date >= month_start,
        Transaction.date <= month_end
    ).group_by(Transaction.type).all()
    
    current_month_income = 0.0
    current_month_expenses = 0.0
    for type_, total in current_month_totals:
        if type_ == 'income':
            current_month_income = round(total, 2)
        elif type_ == 'expense':
            current_month_expenses = round(total, 2)
    
    # Calculate previous month's totals for trend
    prev_month_totals = db.session.query(
        Transaction.type,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == current_user_id,
        Transaction.date >= prev_month_start,
        Transaction.date <= prev_month_end
    ).group_by(Transaction.type).all()
    
    prev_month_income = 0.0
    prev_month_expenses = 0.0
    for type_, total in prev_month_totals:
        if type_ == 'income':
            prev_month_income = round(total, 2)
        elif type_ == 'expense':
            prev_month_expenses = round(total, 2)
    
    # Calculate trends (percentage change from previous month)
    expense_trend = round(((current_month_expenses - prev_month_expenses) / prev_month_expenses * 100) if prev_month_expenses > 0 else 0, 2)
    income_trend = round(((current_month_income - prev_month_income) / prev_month_income * 100) if prev_month_income > 0 else 0, 2)
    
    # Calculate current balance and savings
    current_balance = round(total_income - total_expenses, 2)
    savings = current_balance
    savings_rate = round((savings / total_income * 100) if total_income > 0 else 0, 2)
    balance_trend = round(((current_month_income - current_month_expenses) - (prev_month_income - prev_month_expenses)) / abs(prev_month_income - prev_month_expenses) * 100 if (prev_month_income - prev_month_expenses) != 0 else 0, 2)
    
    summary = {
        'total_expenses': total_expenses,
        'total_income': total_income,
        'current_balance': current_balance,
        'savings': savings,
        'expense_trend': expense_trend,
        'income_trend': income_trend,
        'balance_trend': balance_trend,
        'savings_rate': savings_rate
    }
    
    return jsonify(summary)

@dashboard_bp.route('/recent-transactions', methods=['GET'])
@jwt_required()
def get_recent_transactions():
    try:
        user_id = get_jwt_identity()
        limit = request.args.get('limit', 5, type=int)
        
        transactions = Transaction.query.filter_by(user_id=user_id)\
            .order_by(Transaction.date.desc())\
            .limit(limit)\
            .all()
            
        return jsonify([t.to_dict() for t in transactions])
        
    except Exception as e:
        logger.error(f'Error fetching recent transactions: {str(e)}')
        return jsonify({'error': 'Failed to fetch recent transactions'}), 500

@dashboard_bp.route('/category-breakdown', methods=['GET'])
@jwt_required()
def get_category_breakdown():
    try:
        user_id = get_jwt_identity()
        
        # Get current month's transactions grouped by category
        today = datetime.utcnow()
        start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        breakdown = db.session.query(
            Category.name,
            Category.color,
            func.sum(Transaction.amount).label('total')
        ).join(
            Transaction,
            Transaction.category_id == Category.id
        ).filter(
            Transaction.user_id == user_id,
            Transaction.type == 'expense',
            Transaction.date >= start_of_month
        ).group_by(
            Category.name,
            Category.color
        ).all()
        
        total_expenses = sum(item.total for item in breakdown)
        
        result = [{
            'name': item.name,
            'color': item.color,
            'amount': item.total,
            'percentage': round((item.total / total_expenses * 100) if total_expenses > 0 else 0, 2)
        } for item in breakdown]
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f'Error fetching category breakdown: {str(e)}')
        return jsonify({'error': 'Failed to fetch category breakdown'}), 500

@dashboard_bp.route('/budget-status', methods=['GET'])
@jwt_required()
def get_budget_status():
    try:
        user_id = get_jwt_identity()
        
        # Get current month's start and end dates
        today = datetime.utcnow()
        start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Get active budgets and their spending
        budgets = db.session.query(
            Budget,
            Category.name.label('category_name'),
            func.coalesce(func.sum(Transaction.amount), 0).label('spent')
        ).join(
            Category,
            Budget.category_id == Category.id
        ).outerjoin(
            Transaction,
            db.and_(
                Transaction.category_id == Budget.category_id,
                Transaction.date >= start_of_month,
                Transaction.type == 'expense'
            )
        ).filter(
            Budget.user_id == user_id,
            Budget.start_date <= today,
            Budget.end_date >= today
        ).group_by(
            Budget.id,
            Category.name
        ).all()
        
        result = [{
            'category': budget.category_name,
            'limit': budget.Budget.amount,
            'spent': float(budget.spent),
            'percentage': round((float(budget.spent) / budget.Budget.amount * 100) if budget.Budget.amount > 0 else 0, 2)
        } for budget in budgets]
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f'Error fetching budget status: {str(e)}')
        return jsonify({'error': 'Failed to fetch budget status'}), 500

def calculate_trend(current, previous):
    """Calculate trend percentage and return formatted string."""
    if previous == 0:
        return 'No previous data'
    
    change = ((current - previous) / previous) * 100
    if change > 0:
        return f'+{change:.1f}% from last month'
    elif change < 0:
        return f'{change:.1f}% from last month'
    else:
        return 'Same as last month'