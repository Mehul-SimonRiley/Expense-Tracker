from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.settings import Settings
from extensions import db
import logging

logger = logging.getLogger(__name__)
settings_bp = Blueprint("settings", __name__)

# Update Profile
@settings_bp.route("/profile", methods=["PUT"])
@settings_bp.route("/profile/", methods=["PUT"])
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
@settings_bp.route("/preferences", methods=["PUT"])
@settings_bp.route("/preferences/", methods=["PUT"])
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
@settings_bp.route("/notifications", methods=["PUT"])
@settings_bp.route("/notifications/", methods=["PUT"])
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
@settings_bp.route("/backup", methods=["POST"])
@settings_bp.route("/backup/", methods=["POST"])
@jwt_required()
def create_backup():
    try:
        user_id = get_jwt_identity()
        # Simulate backup creation (replace with actual logic if needed)
        return jsonify({"message": "Backup created successfully"}), 201
    except Exception as e:
        return jsonify({"error": "An error occurred while creating the backup.", "details": str(e)}), 500

# Data Restore
@settings_bp.route("/restore", methods=["POST"])
@settings_bp.route("/restore/", methods=["POST"])
@jwt_required()
def restore_backup():
    try:
        user_id = get_jwt_identity()
        # Simulate backup restoration (replace with actual logic if needed)
        return jsonify({"message": "Backup restored successfully"}), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while restoring the backup.", "details": str(e)}), 500

# Delete Account
@settings_bp.route("/account", methods=["DELETE"])
@settings_bp.route("/account/", methods=["DELETE"])
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

@settings_bp.route('/', methods=['GET'])
@jwt_required()
def get_settings():
    try:
        user_id = get_jwt_identity()
        settings = Settings.query.filter_by(user_id=user_id).first()
        
        if not settings:
            # Create default settings if none exist
            settings = Settings(user_id=user_id)
            db.session.add(settings)
            db.session.commit()
            
        return jsonify(settings.to_dict())
        
    except Exception as e:
        logger.error(f'Error fetching settings: {str(e)}')
        return jsonify({'error': 'Failed to fetch settings'}), 500

@settings_bp.route('/', methods=['PUT'])
@jwt_required()
def update_settings():
    try:
        user_id = get_jwt_identity()
        settings = Settings.query.filter_by(user_id=user_id).first()
        
        if not settings:
            settings = Settings(user_id=user_id)
            db.session.add(settings)
            
        data = request.get_json()
        
        # Update fields
        if 'theme' in data:
            settings.theme = data['theme']
        if 'language' in data:
            settings.language = data['language']
        if 'date_format' in data:
            settings.date_format = data['date_format']
        if 'start_of_week' in data:
            settings.start_of_week = data['start_of_week']
        if 'email_notifications' in data:
            settings.email_notifications = data['email_notifications']
        if 'push_notifications' in data:
            settings.push_notifications = data['push_notifications']
        if 'currency' in data:
            settings.currency = data['currency']
            
        db.session.commit()
        
        return jsonify({
            'message': 'Settings updated successfully',
            'settings': settings.to_dict()
        })
        
    except Exception as e:
        logger.error(f'Error updating settings: {str(e)}')
        db.session.rollback()
        return jsonify({'error': 'Failed to update settings'}), 500