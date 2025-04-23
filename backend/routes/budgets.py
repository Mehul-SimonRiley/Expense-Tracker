from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.budget import Budget
from main import db

bp = Blueprint("budgets", __name__)

@bp.route("/", methods=["GET"])
@jwt_required()
def get_budgets():
    user_id = get_jwt_identity()
    budgets = Budget.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": b.id,
        "category_id": b.category_id,
        "amount": b.amount
    } for b in budgets])

@bp.route("/", methods=["POST"])
@jwt_required()
def add_budget():
    user_id = get_jwt_identity()
    data = request.json
    budget = Budget(
        user_id=user_id,
        category_id=data["category_id"],
        amount=data["amount"]
    )
    db.session.add(budget)
    db.session.commit()
    return jsonify({"message": "Budget added successfully"}), 201

@bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_budget(id):
    user_id = get_jwt_identity()
    budget = Budget.query.filter_by(id=id, user_id=user_id).first()
    if not budget:
        return jsonify({"message": "Budget not found"}), 404
    db.session.delete(budget)
    db.session.commit()
    return jsonify({"message": "Budget deleted successfully"}), 200