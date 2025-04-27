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
    # Default: current month
    year = today.year
    month = today.month
    time_range = request.args.get('timeRange', 'month')
    if time_range == 'year':
        year = today.year
        month = None
    elif time_range == 'quarter':
        # Use last 3 months
        month = today.month - 2 if today.month > 2 else 1
    # Calculate start and end dates
    if month:
        _, num_days = calendar.monthrange(year, month)
        start_date = datetime(year, month, 1).date()
        end_date = datetime(year, month, num_days).date()
    else:
        start_date = datetime(year, 1, 1).date()
        end_date = today
    spending_data = db.session.query(
        Category.name,
        func.sum(Transaction.amount).label('total_spent')
    ).join(Transaction, Category.id == Transaction.category_id).filter(
        Transaction.user_id == current_user_id,
        Transaction.type == 'expense',
        Transaction.date >= start_date,
        Transaction.date <= end_date
    ).group_by(Category.name).order_by(func.sum(Transaction.amount).desc()).all()
    total = sum([amount for _, amount in spending_data])
    topCategories = [
        {"name": name, "amount": float(amount), "percentage": round((amount/total)*100, 2) if total > 0 else 0}
        for name, amount in spending_data
    ]
    return jsonify({"topCategories": topCategories})

@reports_bp.route('/income-vs-expense', methods=['GET'])
@jwt_required()
def get_income_vs_expense():
    current_user_id = get_jwt_identity()
    today = datetime.utcnow().date()
    # Default: last 6 months
    num_months = 6
    # Optionally support timeRange param
    time_range = request.args.get('timeRange', 'month')
    if time_range == 'year':
        num_months = 12
    elif time_range == 'quarter':
        num_months = 3
    # Calculate start and end dates
    end_date = today
    start_month = today.month - num_months + 1
    start_year = today.year
    if start_month <= 0:
        start_year -= 1
        start_month += 12
    start_date = datetime(start_year, start_month, 1).date()

    # Monthly income and expenses
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

    # Build monthly comparison
    months = []
    monthlyComparison = []
    income_dict = {f"{int(y)}-{int(m):02d}": total for y, m, total in income_data}
    expense_dict = {f"{int(y)}-{int(m):02d}": total for y, m, total in expense_data}
    for i in range(num_months):
        month_date = (datetime(today.year, today.month, 1) - timedelta(days=30*i)).replace(day=1)
        key = f"{month_date.year}-{month_date.month:02d}"
        months.append(key)
    months = sorted(set(months))
    for key in months:
        income = income_dict.get(key, 0)
        expenses = expense_dict.get(key, 0)
        savings = income - expenses
        name = datetime.strptime(key, "%Y-%m").strftime("%b %Y")
        monthlyComparison.append({
            "name": name,
            "income": round(income, 2),
            "expenses": round(expenses, 2),
            "savings": round(savings, 2)
        })
    # Summary
    totalIncome = sum([m[2] for m in income_data])
    totalExpenses = sum([m[2] for m in expense_data])
    netSavings = totalIncome - totalExpenses
    savingsRate = round((netSavings / totalIncome * 100) if totalIncome > 0 else 0, 2)
    return jsonify({
        "totalIncome": round(totalIncome, 2),
        "totalExpenses": round(totalExpenses, 2),
        "netSavings": round(netSavings, 2),
        "savingsRate": savingsRate,
        "monthlyComparison": monthlyComparison
    })

@reports_bp.route('/spending-trends', methods=['GET'])
@jwt_required()
def get_spending_trends():
    current_user_id = get_jwt_identity()
    today = datetime.utcnow().date()
    # Default: last 6 months
    num_months = 6
    time_range = request.args.get('timeRange', 'month')
    if time_range == 'year':
        num_months = 12
    elif time_range == 'quarter':
        num_months = 3
    # Calculate start and end dates
    end_date = today
    start_month = today.month - num_months + 1
    start_year = today.year
    if start_month <= 0:
        start_year -= 1
        start_month += 12
    start_date = datetime(start_year, start_month, 1).date()
    # Monthly spending
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
    # Build monthlySpending
    months = []
    monthlySpending = []
    expense_dict = {f"{int(y)}-{int(m):02d}": total for y, m, total in expense_data}
    prev_amount = None
    for i in range(num_months):
        month_date = (datetime(today.year, today.month, 1) - timedelta(days=30*i)).replace(day=1)
        key = f"{month_date.year}-{month_date.month:02d}"
        months.append(key)
    months = sorted(set(months))
    for key in months:
        amount = expense_dict.get(key, 0)
        name = datetime.strptime(key, "%Y-%m").strftime("%b %Y")
        change = ""
        if prev_amount is not None:
            if prev_amount == 0:
                change = "+∞%"
            else:
                change = f"{round(((amount - prev_amount) / prev_amount) * 100, 2)}%"
        monthlySpending.append({
            "name": name,
            "amount": round(amount, 2),
            "change": change
        })
        prev_amount = amount
    # Category trends (this month vs last month)
    this_month = today.month
    last_month = this_month - 1 if this_month > 1 else 12
    this_year = today.year
    last_year = this_year if this_month > 1 else this_year - 1
    cat_this = db.session.query(
        Category.name,
        func.sum(Transaction.amount).label('total')
    ).join(Transaction, Category.id == Transaction.category_id).filter(
        Transaction.user_id == current_user_id,
        Transaction.type == 'expense',
        extract('year', Transaction.date) == this_year,
        extract('month', Transaction.date) == this_month
    ).group_by(Category.name).all()
    cat_last = db.session.query(
        Category.name,
        func.sum(Transaction.amount).label('total')
    ).join(Transaction, Category.id == Transaction.category_id).filter(
        Transaction.user_id == current_user_id,
        Transaction.type == 'expense',
        extract('year', Transaction.date) == last_year,
        extract('month', Transaction.date) == last_month
    ).group_by(Category.name).all()
    cat_this_dict = {name: total for name, total in cat_this}
    cat_last_dict = {name: total for name, total in cat_last}
    all_cats = set(cat_this_dict.keys()) | set(cat_last_dict.keys())
    categoryTrends = []
    for cat in all_cats:
        this_amt = cat_this_dict.get(cat, 0)
        last_amt = cat_last_dict.get(cat, 0)
        if last_amt == 0:
            change = "+∞%" if this_amt > 0 else "0%"
        else:
            change = f"{round(((this_amt - last_amt) / last_amt) * 100, 2)}%"
        categoryTrends.append({
            "category": cat,
            "thisMonth": round(this_amt, 2),
            "lastMonth": round(last_amt, 2),
            "change": change
        })
    return jsonify({
        "monthlySpending": monthlySpending,
        "categoryTrends": categoryTrends
    })

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