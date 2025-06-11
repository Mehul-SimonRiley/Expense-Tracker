from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.settings import Settings
from extensions import db
import logging
import os
from werkzeug.utils import secure_filename
from datetime import datetime

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

# Update Profile Settings
@settings_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        logger.info(f"Updating profile for user {user_id}")
        
        data = request.json
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Update profile fields
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
        if 'phone' in data:
            user.phone = data['phone']
        if 'bio' in data:
            user.bio = data['bio']
        if 'date_of_birth' in data:
            user.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
        if 'occupation' in data:
            user.occupation = data['occupation']
        if 'location' in data:
            user.location = data['location']
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Profile updated successfully",
            "data": user.to_dict()
        })
    except Exception as e:
        logger.error(f"Error in update_profile: {str(e)}")
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Failed to update profile"
        }), 500

# Update Security Settings
@settings_bp.route("/security", methods=["PUT"])
@jwt_required()
def update_security():
    try:
        user_id = get_jwt_identity()
        logger.info(f"Updating security settings for user {user_id}")
        
        data = request.json
        settings = Settings.query.filter_by(user_id=user_id).first()
        
        if not settings:
            settings = Settings(user_id=user_id)
            db.session.add(settings)
        
        # Update security fields
        if 'two_factor_enabled' in data:
            settings.two_factor_enabled = data['two_factor_enabled']
        if 'login_notifications' in data:
            settings.login_notifications = data['login_notifications']
        if 'session_timeout' in data:
            settings.session_timeout = data['session_timeout']
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Security settings updated successfully",
            "data": settings.to_dict()
        })
    except Exception as e:
        logger.error(f"Error in update_security: {str(e)}")
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Failed to update security settings"
        }), 500

# Update Preferences
@settings_bp.route("/preferences", methods=["PUT"])
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
        
        # Update preference fields
        if 'language' in data:
            settings.language = data['language']
        if 'date_format' in data:
            settings.date_format = data['date_format']
        if 'time_format' in data:
            settings.time_format = data['time_format']
        if 'timezone' in data:
            settings.timezone = data['timezone']
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Preferences updated successfully",
            "data": settings.to_dict()
        })
    except Exception as e:
        logger.error(f"Error in update_preferences: {str(e)}")
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Failed to update preferences"
        }), 500

# Update Currency Settings
@settings_bp.route("/currency", methods=["PUT"])
@jwt_required()
def update_currency():
    try:
        user_id = get_jwt_identity()
        logger.info(f"Updating currency settings for user {user_id}")
        
        data = request.json
        settings = Settings.query.filter_by(user_id=user_id).first()
        
        if not settings:
            settings = Settings(user_id=user_id)
            db.session.add(settings)
        
        # Update currency fields
        if 'primary_currency' in data:
            settings.primary_currency = data['primary_currency']
        if 'currency_display' in data:
            settings.currency_display = data['currency_display']
        if 'decimal_separator' in data:
            settings.decimal_separator = data['decimal_separator']
        if 'thousands_separator' in data:
            settings.thousands_separator = data['thousands_separator']
        if 'decimal_places' in data:
            settings.decimal_places = data['decimal_places']
        if 'show_currency_symbol' in data:
            settings.show_currency_symbol = data['show_currency_symbol']
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Currency settings updated successfully",
            "data": settings.to_dict()
        })
    except Exception as e:
        logger.error(f"Error in update_currency: {str(e)}")
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Failed to update currency settings"
        }), 500

# Update Notification Settings
@settings_bp.route("/notifications", methods=["PUT"])
@jwt_required()
def update_notifications():
    try:
        user_id = get_jwt_identity()
        logger.info(f"Updating notification settings for user {user_id}")
        
        data = request.json
        settings = Settings.query.filter_by(user_id=user_id).first()
        
        if not settings:
            settings = Settings(user_id=user_id)
            db.session.add(settings)
        
        # Update notification fields
        if 'email_notifications' in data:
            settings.email_notifications = data['email_notifications']
        if 'push_notifications' in data:
            settings.push_notifications = data['push_notifications']
        if 'notification_frequency' in data:
            settings.notification_frequency = data['notification_frequency']
        if 'quiet_hours' in data:
            settings.quiet_hours = data['quiet_hours']
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Notification settings updated successfully",
            "data": settings.to_dict()
        })
    except Exception as e:
        logger.error(f"Error in update_notifications: {str(e)}")
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Failed to update notification settings"
        }), 500

# Get All Settings
@settings_bp.route('/', methods=['GET'])
@jwt_required()
def get_settings():
    try:
        user_id = get_jwt_identity()
        logger.info(f"Fetching settings for user {user_id}")
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        settings = Settings.query.filter_by(user_id=user_id).first()
        if not settings:
            logger.info(f"Creating default settings for user {user_id}")
            settings = Settings(user_id=user_id)
            db.session.add(settings)
            db.session.commit()
        
        # Combine user profile data with settings
        response_data = {
            **user.to_dict(),
            **settings.to_dict()
        }
        
        return jsonify({
            "status": "success",
            "data": response_data
        })
    except Exception as e:
        logger.error(f"Error in get_settings: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch settings"
        }), 500

# Delete Account
@settings_bp.route("/account", methods=["DELETE"])
@jwt_required()
def delete_account():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Delete user's settings
        settings = Settings.query.filter_by(user_id=user_id).first()
        if settings:
            db.session.delete(settings)

        # Delete user account
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Account deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while deleting the account.", "details": str(e)}), 500