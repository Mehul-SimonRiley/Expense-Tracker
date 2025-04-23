from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.transaction import Transaction
from extensions import db
from datetime import datetime

bp = Blueprint("transactions", __name__)

@bp.route("/", methods=["GET"])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": t.id,
        "description": t.description,
        "category_id": t.category_id,
        "amount": t.amount,
        "type": t.type,
        "date": t.date
    } for t in transactions])

@bp.route("/", methods=["POST"])
@jwt_required()
def add_transaction():
    user_id = get_jwt_identity()
    data = request.json

    # Convert the date string to a Python date object
    transaction_date = datetime.strptime(data["date"], "%Y-%m-%d").date()

    transaction = Transaction(
        user_id=user_id,
        description=data["description"],
        category_id=data["category_id"],
        amount=data["amount"],
        type=data["type"],
        date=transaction_date  # Use the converted date object
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction added successfully"}), 201

@bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_transaction(id):
    user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=id, user_id=user_id).first()
    if not transaction:
        return jsonify({"message": "Transaction not found"}), 404
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction deleted successfully"}), 200