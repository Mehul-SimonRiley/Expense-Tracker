from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.transaction import Transaction
from sqlalchemy import func
from extensions import db

bp = Blueprint("reports", __name__)

@bp.route("/expense-vs-income", methods=["GET"])
@jwt_required()
def get_expense_vs_income():
    user_id = get_jwt_identity()
    time_range = request.args.get("timeRange", "month")

    # Fetch total expenses and income
    total_expenses = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=user_id, type="expense").scalar() or 0
    total_income = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=user_id, type="income").scalar() or 0

    return jsonify({"expenses": total_expenses, "income": total_income})

@bp.route("/category-breakdown", methods=["GET"])
@jwt_required()
def get_category_breakdown():
    user_id = get_jwt_identity()
    time_range = request.args.get("timeRange", "month")

    # Fetch spending by category
    breakdown = db.session.query(Transaction.category_id, func.sum(Transaction.amount)).filter_by(user_id=user_id, type="expense").group_by(Transaction.category_id).all()

    result = [{"category": b[0], "amount": b[1]} for b in breakdown]
    return jsonify(result)

@bp.route("/spending-trends", methods=["GET"])
@jwt_required()
def get_spending_trends():
    user_id = get_jwt_identity()

    # Fetch monthly spending trends
    trends = db.session.query(
        func.extract("month", Transaction.date).label("month"),
        func.sum(Transaction.amount).label("total")
    ).filter_by(user_id=user_id, type="expense").group_by(func.extract("month", Transaction.date)).all()

    result = [{"month": int(t[0]), "amount": t[1]} for t in trends]
    return jsonify(result)