from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.transaction import Transaction
from sqlalchemy import func

calendar_bp = Blueprint("calendar", __name__)

@calendar_bp.route("/transactions", methods=["GET"])
@jwt_required()
def get_calendar_transactions():
    try:
        user_id = get_jwt_identity()
        year = request.args.get("year", type=int)
        month = request.args.get("month", type=int)

        if not year or not month:
            return jsonify({"message": "Year and month are required"}), 400

        # Fetch transactions for the specified month
        transactions = Transaction.query.filter(
            Transaction.user_id == user_id,
            func.extract("year", Transaction.date) == year,
            func.extract("month", Transaction.date) == month
        ).all()

        result = [
            {
                "id": t.id,
                "date": t.date,
                "description": t.description,
                "amount": t.amount,
                "type": t.type,
                "category": t.category_id
            }
            for t in transactions
        ]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching calendar transactions.", "details": str(e)}), 500