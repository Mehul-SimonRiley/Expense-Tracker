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
bp = Blueprint('dashboard', __name__)

@bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    try:
        user_id = get_jwt_identity()
        
        # Get current month's start and end dates
        today = datetime.utcnow()
        start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if today.month == 12:
            end_of_month = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            end_of_month = today.replace(month=today.month + 1, day=1) - timedelta(days=1)
        
        # Get transactions for current month
        transactions = Transaction.query.filter(
            Transaction.user_id == user_id,
            Transaction.date >= start_of_month,
            Transaction.date <= end_of_month
        ).all()
        
        # Calculate totals
        total_income = sum(t.amount for t in transactions if t.type == 'income')
        total_expenses = sum(t.amount for t in transactions if t.type == 'expense')
        current_balance = total_income - total_expenses
        savings = total_income * 0.1  # Assuming 10% savings target
        
        # Get previous month's data for trends
        prev_month_start = (start_of_month - timedelta(days=1)).replace(day=1)
        prev_month_transactions = Transaction.query.filter(
            Transaction.user_id == user_id,
            Transaction.date >= prev_month_start,
            Transaction.date < start_of_month
        ).all()
        
        prev_income = sum(t.amount for t in prev_month_transactions if t.type == 'income')
        prev_expenses = sum(t.amount for t in prev_month_transactions if t.type == 'expense')
        
        # Calculate trends
        income_trend = calculate_trend(total_income, prev_income)
        expense_trend = calculate_trend(total_expenses, prev_expenses)
        balance_trend = calculate_trend(current_balance, prev_income - prev_expenses)
        
        return jsonify({
            'totalIncome': total_income,
            'totalExpenses': total_expenses,
            'currentBalance': current_balance,
            'savings': savings,
            'savingsRate': '10%',
            'incomeTrend': income_trend,
            'expenseTrend': expense_trend,
            'balanceTrend': balance_trend
        })
        
    except Exception as e:
        logger.error(f'Error fetching dashboard summary: {str(e)}')
        return jsonify({'error': 'Failed to fetch dashboard summary'}), 500

@bp.route('/recent-transactions', methods=['GET'])
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

@bp.route('/category-breakdown', methods=['GET'])
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

@bp.route('/budget-status', methods=['GET'])
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