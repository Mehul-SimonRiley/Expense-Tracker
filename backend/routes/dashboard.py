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
    month_end = (next_month - timedelta(days=next_month.day)).date()
    
    # Calculate total income and expenses for current month
    monthly_totals = db.session.query(
        Transaction.type,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == current_user_id,
        Transaction.date >= month_start,
        Transaction.date <= month_end
    ).group_by(Transaction.type).all()
    
    # Calculate budget status
    budgets = Budget.query.filter(
        Budget.user_id == current_user_id,
        Budget.start_date <= month_end,
        Budget.end_date >= month_start
    ).all()
    
    budget_status = []
    for budget in budgets:
        spent = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == current_user_id,
            Transaction.category_id == budget.category_id,
            Transaction.type == 'expense',
            Transaction.date >= budget.start_date,
            Transaction.date <= budget.end_date
        ).scalar() or 0.0
        
        budget_status.append({
            'category_id': budget.category_id,
            'category_name': budget.category.name,
            'budget_amount': budget.amount,
            'spent': round(spent, 2),
            'remaining': round(budget.amount - spent, 2),
            'percentage': round((spent / budget.amount) * 100, 2) if budget.amount > 0 else 0
        })
    
    # Calculate category breakdown
    category_breakdown = db.session.query(
        Category.name,
        func.sum(Transaction.amount).label('total')
    ).join(
        Transaction,
        Category.id == Transaction.category_id
    ).filter(
        Transaction.user_id == current_user_id,
        Transaction.type == 'expense',
        Transaction.date >= month_start,
        Transaction.date <= month_end
    ).group_by(Category.name).all()
    
    # Format the response
    summary = {
        'monthly_totals': {
            'income': 0.0,
            'expense': 0.0
        },
        'budget_status': budget_status,
        'category_breakdown': [
            {'name': name, 'total': round(total, 2)}
            for name, total in category_breakdown
        ]
    }
    
    # Update monthly totals
    for type_, total in monthly_totals:
        summary['monthly_totals'][type_] = round(total, 2)
    
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