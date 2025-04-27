from flask import Blueprint, jsonify

bp = Blueprint("root", __name__)

@bp.route("/")
def index():
    return jsonify({
        "message": "Welcome to Expense Tracker API",
        "status": "running",
        "version": "1.0.0"
    }) 