from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.settings import Settings
from extensions import db
import logging
import os
from werkzeug.utils import secure_filename

logger = logging.getLogger(__name__)
settings_bp = Blueprint("settings", __name__)

# Configure upload folder
UPLOAD_FOLDER = 'profile_pics'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Profile Picture Upload
@settings_bp.route("/profile/picture", methods=["POST"])
@jwt_required()
def upload_profile_picture():
    try:
        if 'profile_picture' not in request.files:
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['profile_picture']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        if file and allowed_file(file.filename):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({"error": "User not found"}), 404
                
            filename = secure_filename(f"{user_id}_{file.filename}")
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            
            # Create upload folder if it doesn't exist
            if not os.path.exists(UPLOAD_FOLDER):
                os.makedirs(UPLOAD_FOLDER)
                
            file.save(file_path)
            
            # Update user's profile picture path
            user.profile_picture = file_path
            db.session.commit()
            
            return jsonify({
                "message": "Profile picture uploaded successfully",
                "profile_picture": file_path
            })
            
        return jsonify({"error": "Invalid file type"}), 400
        
    except Exception as e:
        logger.error(f"Error uploading profile picture: {str(e)}")
        return jsonify({"error": "Failed to upload profile picture"}), 500

# Update Profile
@settings_bp.route("/profile", methods=["PUT"])
@settings_bp.route("/profile/", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        logger.info(f"Updating profile for user {user_id}")
        
        data = request.json
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                "status": "error",
                "message": "User not found"
            }), 404
        
        # Update only provided fields
        if 'name' in data and data['name']:
            user.name = data['name']
        if 'email' in data and data['email']:
            user.email = data['email']
        if 'phone' in data and data['phone']:
            user.phone = data['phone']
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Profile updated successfully",
            "data": {
                "user": user.to_dict()
            }
        })
    except Exception as e:
        logger.error(f"Error in update_profile: {str(e)}")
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Failed to update profile"
        }), 500

# Update Preferences
@settings_bp.route("/preferences", methods=["PUT"])
@settings_bp.route("/preferences/", methods=["PUT"])
@jwt_required()
def update_preferences():
    try:
        user_id = get_jwt_identity()
        logger.info(f"Updating preferences for user {user_id}")
        
        data = request.json
        settings = Settings.query.filter_by(user_id=user_id).first()
        
        if not settings:
            settings = Settings(user_id=user_id)
            db.session.add(settings)
        
        # Update only provided fields
        if 'theme' in data:
            settings.theme = data['theme']
        if 'language' in data:
            settings.language = data['language']
        if 'date_format' in data:
            settings.date_format = data['date_format']
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Preferences updated successfully",
            "data": {
                "settings": settings.to_dict()
            }
        })
    except Exception as e:
        logger.error(f"Error in update_preferences: {str(e)}")
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Failed to update preferences"
        }), 500

# Update Notifications
@settings_bp.route("/notifications", methods=["PUT"])
@settings_bp.route("/notifications/", methods=["PUT"])
@jwt_required()
def update_notifications():
    try:
        user_id = get_jwt_identity()
        logger.info(f"Updating notifications for user {user_id}")
        
        data = request.json
        settings = Settings.query.filter_by(user_id=user_id).first()
        
        if not settings:
            settings = Settings(user_id=user_id)
            db.session.add(settings)
        
        # Update notification settings
        if 'email_notifications' in data:
            settings.email_notifications = data['email_notifications']
        if 'push_notifications' in data:
            settings.push_notifications = data['push_notifications']
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Notification settings updated successfully",
            "data": {
                "settings": settings.to_dict()
            }
        })
    except Exception as e:
        logger.error(f"Error in update_notifications: {str(e)}")
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Failed to update notification settings"
        }), 500

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
        logger.info(f"Fetching settings for user {user_id}")
        
        # Get or create settings
        settings = Settings.query.filter_by(user_id=user_id).first()
        if not settings:
            logger.info(f"Creating default settings for user {user_id}")
            settings = Settings(user_id=user_id)
            db.session.add(settings)
            db.session.commit()
        
        return jsonify({
            "status": "success",
            "data": settings.to_dict()
        })
    except Exception as e:
        logger.error(f"Error in get_settings: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch settings"
        }), 500

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