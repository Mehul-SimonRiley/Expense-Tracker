from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from extensions import db

bp = Blueprint("settings", __name__)

# Update Profile
@bp.route("/profile", methods=["PUT"])
@bp.route("/profile/", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
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
    except Exception as e:
        return jsonify({"error": "An error occurred while updating the profile.", "details": str(e)}), 500

# Update Preferences
@bp.route("/preferences", methods=["PUT"])
@bp.route("/preferences/", methods=["PUT"])
@jwt_required()
def update_preferences():
    try:
        user_id = get_jwt_identity()
        data = request.json
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Update user preferences
        user.theme = data.get("theme", user.theme)
        user.language = data.get("language", user.language)
        user.date_format = data.get("date_format", user.date_format)
        user.start_of_week = data.get("start_of_week", user.start_of_week)
        db.session.commit()
        return jsonify({"message": "Preferences updated successfully"})
    except Exception as e:
        return jsonify({"error": "An error occurred while updating preferences.", "details": str(e)}), 500

# Update Notifications
@bp.route("/notifications", methods=["PUT"])
@bp.route("/notifications/", methods=["PUT"])
@jwt_required()
def update_notifications():
    try:
        user_id = get_jwt_identity()
        data = request.json
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Update notification settings
        user.email_notifications = data.get("email_notifications", user.email_notifications)
        user.push_notifications = data.get("push_notifications", user.push_notifications)
        db.session.commit()
        return jsonify({"message": "Notification settings updated successfully"})
    except Exception as e:
        return jsonify({"error": "An error occurred while updating notifications.", "details": str(e)}), 500

# Data Backup
@bp.route("/backup", methods=["POST"])
@bp.route("/backup/", methods=["POST"])
@jwt_required()
def create_backup():
    try:
        user_id = get_jwt_identity()
        # Simulate backup creation (replace with actual logic if needed)
        return jsonify({"message": "Backup created successfully"}), 201
    except Exception as e:
        return jsonify({"error": "An error occurred while creating the backup.", "details": str(e)}), 500

# Data Restore
@bp.route("/restore", methods=["POST"])
@bp.route("/restore/", methods=["POST"])
@jwt_required()
def restore_backup():
    try:
        user_id = get_jwt_identity()
        # Simulate backup restoration (replace with actual logic if needed)
        return jsonify({"message": "Backup restored successfully"}), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while restoring the backup.", "details": str(e)}), 500

# Delete Account
@bp.route("/account", methods=["DELETE"])
@bp.route("/account/", methods=["DELETE"])
@jwt_required()
def delete_account():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Delete user account
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Account deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while deleting the account.", "details": str(e)}), 500