from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Transaction, Category # Models only
from extensions import db # Extensions here
from datetime import datetime, timedelta
from sqlalchemy import func, extract
import pandas as pd
import io
import logging
import calendar

logger = logging.getLogger(__name__)
reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    current_user_id = get_jwt_identity()
    
    # Get month and year from query params, default to current month/year
    today = datetime.utcnow().date()
    year = request.args.get('year', default=today.year, type=int)
    month = request.args.get('month', default=today.month, type=int)
    
    # Calculate start and end dates for the month
    _, num_days = calendar.monthrange(year, month)
    start_date = datetime(year, month, 1).date()
    end_date = datetime(year, month, num_days).date()
    
    # Total Income for the month
    total_income = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user_id,
        Transaction.type == 'income',
        Transaction.date >= start_date,
        Transaction.date <= end_date
    ).scalar() or 0.0

    # Total Expense for the month
    total_expense = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user_id,
        Transaction.type == 'expense',
        Transaction.date >= start_date,
        Transaction.date <= end_date
    ).scalar() or 0.0

    # Net Savings/Loss
    net_savings = total_income - total_expense

    # Top spending categories for the month
    top_spending_categories = db.session.query(
        Category.name,
        func.sum(Transaction.amount).label('total_spent')
    ).join(Transaction, Category.id == Transaction.category_id).filter(
        Transaction.user_id == current_user_id,
        Transaction.type == 'expense',
        Transaction.date >= start_date,
        Transaction.date <= end_date
    ).group_by(Category.name).order_by(func.sum(Transaction.amount).desc()).limit(5).all()

    summary = {
        'year': year,
        'month': month,
        'total_income': total_income,
        'total_expense': total_expense,
        'net_savings': net_savings,
        'top_spending_categories': [
            {'category': name, 'amount': amount} for name, amount in top_spending_categories
        ]
    }
    return jsonify(summary)

@reports_bp.route('/spending-by-category', methods=['GET'])
@jwt_required()
def get_spending_by_category():
    current_user_id = get_jwt_identity()
    
    today = datetime.utcnow().date()
    year = request.args.get('year', default=today.year, type=int)
    month = request.args.get('month', default=today.month, type=int)
    
    _, num_days = calendar.monthrange(year, month)
    start_date = datetime(year, month, 1).date()
    end_date = datetime(year, month, num_days).date()

    spending_data = db.session.query(
        Category.name,
        Category.color,
        func.sum(Transaction.amount).label('total_spent')
    ).join(Transaction, Category.id == Transaction.category_id).filter(
        Transaction.user_id == current_user_id,
        Transaction.type == 'expense',
        Transaction.date >= start_date,
        Transaction.date <= end_date
    ).group_by(Category.name, Category.color).order_by(func.sum(Transaction.amount).desc()).all()

    report = [
        {'category': name, 'color': color, 'amount': amount} for name, color, amount in spending_data
    ]
    return jsonify(report)

@reports_bp.route('/income-vs-expense', methods=['GET'])
@jwt_required()
def get_income_vs_expense_trend():
    current_user_id = get_jwt_identity()
    
    # Get data for the last N months (e.g., 6 months)
    num_months = request.args.get('months', default=6, type=int)
    today = datetime.utcnow().date()
    end_date = today
    start_date = today - timedelta(days=(num_months * 30)) # Approximate

    # More accurate start date calculation:
    current_month = today.month
    current_year = today.year
    start_month = current_month - num_months + 1
    start_year = current_year
    if start_month <= 0:
        start_year -= 1
        start_month += 12
    start_date = datetime(start_year, start_month, 1).date()


    income_data = db.session.query(
        extract('year', Transaction.date).label('year'),
        extract('month', Transaction.date).label('month'),
        func.sum(Transaction.amount).label('total_income')
    ).filter(
        Transaction.user_id == current_user_id,
        Transaction.type == 'income',
        Transaction.date >= start_date,
        Transaction.date <= end_date
    ).group_by('year', 'month').order_by('year', 'month').all()

    expense_data = db.session.query(
        extract('year', Transaction.date).label('year'),
        extract('month', Transaction.date).label('month'),
        func.sum(Transaction.amount).label('total_expense')
    ).filter(
        Transaction.user_id == current_user_id,
        Transaction.type == 'expense',
        Transaction.date >= start_date,
        Transaction.date <= end_date
    ).group_by('year', 'month').order_by('year', 'month').all()

    # Combine data by month/year
    trend_data = {}
    for year, month, total_income in income_data:
        key = f"{year}-{month:02d}"
        if key not in trend_data:
            trend_data[key] = {'month': key, 'income': 0, 'expense': 0}
        trend_data[key]['income'] = total_income
    
    for year, month, total_expense in expense_data:
        key = f"{year}-{month:02d}"
        if key not in trend_data:
            trend_data[key] = {'month': key, 'income': 0, 'expense': 0}
        trend_data[key]['expense'] = total_expense

    # Ensure all months in the range are present, even if no data
    report = []
    current_date = start_date
    while current_date <= end_date:
        key = f"{current_date.year}-{current_date.month:02d}"
        if key in trend_data:
            report.append(trend_data[key])
        else:
            report.append({'month': key, 'income': 0, 'expense': 0})
        # Move to the next month
        next_month = current_date.month + 1
        next_year = current_date.year
        if next_month > 12:
            next_month = 1
            next_year += 1
        # Find the first day of the next month safely
        try:
            current_date = datetime(next_year, next_month, 1).date()
        except ValueError: # Handle potential day out of range (e.g. Feb 31)
             # This shouldn't happen when setting day=1, but safety first
             if next_month == 2:
                 current_date = datetime(next_year, next_month, 28).date() 
             else: # Should handle 30/31 day months correctly
                 current_date = datetime(next_year, next_month, 1).date() - timedelta(days=1) # Last day of prev month
                 current_date = current_date + timedelta(days=1) # First day of next month
    
    # Sort the final report just in case
    report.sort(key=lambda x: x['month'])

    return jsonify(report)

# Remove or update old routes if they are no longer needed or clash
# For example, remove the old '/expense-income' if '/income-vs-expense' replaces it

# @bp.route('/expense-income', methods=['GET'])
# @jwt_required()
# def get_expense_income_report():
#    ...

# @bp.route('/category-breakdown', methods=['GET'])
# @jwt_required()
# def get_category_breakdown():
#     ...

# @bp.route('/spending-trends', methods=['GET'])
# @jwt_required()
# def get_spending_trends():
#     ...

# @bp.route('/export', methods=['GET'])
# @jwt_required()
# def export_report():
#     ...