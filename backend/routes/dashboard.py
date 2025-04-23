from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.transaction import Transaction
from models.budget import Budget
from sqlalchemy import func
from extensions import db  # Import the db object

bp = Blueprint("dashboard", __name__)

@bp.route("/summary", methods=["GET"])
@jwt_required()
def get_summary():
    user_id = get_jwt_identity()
    # Fetch total expenses, income, and balance
    total_expenses = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=user_id, type="expense").scalar() or 0
    total_income = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=user_id, type="income").scalar() or 0
    current_balance = total_income - total_expenses
    savings = total_income * 0.1  # Example: 10% of income as savings
    return jsonify({
        "totalExpenses": total_expenses,
        "totalIncome": total_income,
        "currentBalance": current_balance,
        "savings": savings
    })

@bp.route("/budget-status", methods=["GET"])
@jwt_required()
def get_budget_status():
    user_id = get_jwt_identity()
    budgets = Budget.query.filter_by(user_id=user_id).all()
    budget_status = [{"category": b.category_id, "current": b.amount, "total": b.amount * 1.2} for b in budgets]
    return jsonify(budget_status)

@bp.route("/recent-transactions", methods=["GET"])
@jwt_required()
def get_recent_transactions():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.date.desc()).limit(5).all()
    recent = [{"id": t.id, "description": t.description, "date": t.date, "category": t.category_id, "amount": t.amount, "type": t.type} for t in transactions]
    return jsonify(recent)

@bp.route("/category-breakdown", methods=["GET"])
@jwt_required()
def get_category_breakdown():
    user_id = get_jwt_identity()
    # Fetch expenses grouped by category
    breakdown = db.session.query(Transaction.category_id, func.sum(Transaction.amount)).filter_by(user_id=user_id, type="expense").group_by(Transaction.category_id).all()
    result = [{"category": b[0], "amount": b[1]} for b in breakdown]
    return jsonify(result)