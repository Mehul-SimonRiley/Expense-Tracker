from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.transaction import Transaction
from sqlalchemy import func
from extensions import db

bp = Blueprint("reports", __name__)

@bp.route("/expense-vs-income", methods=["GET"])
@jwt_required()
def get_expense_vs_income():
    try:
        user_id = get_jwt_identity()
        total_expenses = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=user_id, type="expense").scalar() or 0
        total_income = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=user_id, type="income").scalar() or 0
        return jsonify({"expenses": total_expenses, "income": total_income})
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching expense vs. income.", "details": str(e)}), 500

@bp.route("/category-breakdown", methods=["GET"])
@jwt_required()
def get_category_breakdown():
    try:
        user_id = get_jwt_identity()
        breakdown = db.session.query(Transaction.category_id, func.sum(Transaction.amount)).filter_by(user_id=user_id, type="expense").group_by(Transaction.category_id).all()
        result = [{"category": b[0], "amount": b[1]} for b in breakdown]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching the category breakdown.", "details": str(e)}), 500

@bp.route("/spending-trends", methods=["GET"])
@jwt_required()
def get_spending_trends():
    try:
        user_id = get_jwt_identity()
        trends = db.session.query(
            func.extract("month", Transaction.date).label("month"),
            func.sum(Transaction.amount).label("total")
        ).filter_by(user_id=user_id, type="expense").group_by(func.extract("month", Transaction.date)).all()
        result = [{"month": int(t[0]), "amount": t[1]} for t in trends]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching spending trends.", "details": str(e)}), 500