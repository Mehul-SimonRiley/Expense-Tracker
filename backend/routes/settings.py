from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from extensions import db

bp = Blueprint("settings", __name__)

@bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.json
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    user.phone = data.get("phone", user.phone)
    db.session.commit()

    return jsonify({"message": "Profile updated successfully"})

@bp.route("/account", methods=["PUT"])
@jwt_required()
def update_account():
    user_id = get_jwt_identity()
    data = request.json
    # Update account settings (e.g., password)
    return jsonify({"message": "Account updated successfully"})

@bp.route("/preferences", methods=["PUT"])
@jwt_required()
def update_preferences():
    user_id = get_jwt_identity()
    data = request.json
    # Update user preferences
    return jsonify({"message": "Preferences updated successfully"})

@bp.route("/notifications", methods=["PUT"])
@jwt_required()
def update_notifications():
    user_id = get_jwt_identity()
    data = request.json
    # Update notification settings
    return jsonify({"message": "Notifications updated successfully"})

@bp.route("/backup", methods=["POST"])
@jwt_required()
def create_backup():
    user_id = get_jwt_identity()
    # Create a backup of user data
    return jsonify({"message": "Backup created successfully"})

@bp.route("/restore", methods=["POST"])
@jwt_required()
def restore_backup():
    user_id = get_jwt_identity()
    # Restore user data from a backup
    return jsonify({"message": "Backup restored successfully"})

@bp.route("/account", methods=["DELETE"])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Account deleted successfully"})