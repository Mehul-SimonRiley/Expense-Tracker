from flask import Blueprint, request, jsonify
from models import User, Category
from extensions import db, jwt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
import logging

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    logger.info("Starting registration process")
    data = request.get_json()
    logger.info(f"Received registration data: {data}")

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        logger.error("Missing required fields in registration data")
        return jsonify({"msg": "Missing required fields (name, email, password)"}), 400

    if User.query.filter_by(email=email).first():
        logger.error(f"User with email {email} already exists")
        return jsonify({"msg": "Email already exists"}), 400

    try:
        user = User(name=name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.flush() # Get the user ID before commit for categories
        logger.info(f"User object created for {email}")

        # Create default categories
        default_categories = [
            ('Food & Dining', '#FF5733', '🍽️'),
            ('Transportation', '#33FF57', '🚗'),
            ('Shopping', '#3357FF', '🛍️'),
            ('Bills & Utilities', '#FF33F5', '💡'),
            ('Entertainment', '#33FFF5', '🎮'),
            ('Health', '#F5FF33', '🏥'),
            ('Travel', '#FF8033', '✈️'),
            ('Education', '#3380FF', '📚'),
            ('Salary', '#33FF80', '💰'),
            ('Investments', '#8033FF', '📈'),
            ('Other Income', '#FF3380', '💵'),
            ('Miscellaneous', '#808080', '📌')
        ]

        for cat_name, color, icon in default_categories:
            category = Category(
                user_id=user.id,
                name=cat_name,
                color=color,
                icon=icon
            )
            db.session.add(category)
        logger.info(f"Default categories added for user {user.id}")

        db.session.commit()
        logger.info(f"User {user.id} and default categories saved to database successfully")

        # Convert user.id to string for JWT identity
        user_id = str(user.id)
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        logger.info(f"Tokens created for user {user_id}")

        return jsonify({
            "msg": "User created successfully",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Registration error for {email}: {str(e)}")
        return jsonify({"msg": f"Registration failed: {str(e)}"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    logger.info(f"Login attempt for email: {email}")

    if not email or not password:
        logger.error("Missing email or password in login request")
        return jsonify({"msg": "Missing email or password"}), 400

    try:
        user = User.query.filter_by(email=email).first()
        if not user:
            logger.warning(f"User not found for email: {email}")
            return jsonify({"msg": "Invalid email or password"}), 401

        if user.check_password(password):
            # Convert user.id to string for JWT identity
            user_id = str(user.id)
            logger.info(f"Creating tokens for user ID: {user_id}")
            
            try:
                access_token = create_access_token(identity=user_id)
                refresh_token = create_refresh_token(identity=user_id)
                logger.info(f"Tokens created successfully for user: {user_id}")
                
                return jsonify({
                    "msg": "Login successful",
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": user.to_dict()
                })
            except Exception as e:
                logger.error(f"Token creation error: {str(e)}")
                return jsonify({"msg": "Authentication failed - token creation error"}), 500
        else:
            logger.warning(f"Invalid password for user: {email}")
            return jsonify({"msg": "Invalid email or password"}), 401
            
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({"msg": "Login failed"}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user_id = get_jwt_identity()
        logger.info(f"Refreshing token for user ID: {current_user_id}")
        
        # Ensure identity is a string
        user_id = str(current_user_id)
        access_token = create_access_token(identity=user_id)
        logger.info(f"Access token refreshed successfully for user ID: {user_id}")
        
        return jsonify({
            "msg": "Token refreshed successfully",
            "access_token": access_token
        })
    except Exception as e:
        logger.error(f'Refresh token error for user ID {current_user_id}: {str(e)}')
        return jsonify({'msg': 'Failed to refresh token'}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    logger.info(f"Fetching profile for user ID: {current_user_id}")
    user = User.query.get(current_user_id)
    if not user:
        logger.warning(f"Profile fetch attempt for non-existent user ID: {current_user_id}")
        return jsonify({"msg": "User not found"}), 404
    logger.info(f"Profile fetched successfully for user ID: {current_user_id}")
    return jsonify(user.to_dict())

@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    logger.info(f"Updating profile for user ID: {current_user_id}")
    user = User.query.get(current_user_id)

    if not user:
        logger.warning(f"Profile update attempt for non-existent user ID: {current_user_id}")
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    logger.info(f"Received profile update data for user {current_user_id}: {data}")
    updated = False

    try:
        if 'name' in data and data['name']:
            user.name = data['name']
            updated = True
        if 'password' in data and data['password']:
            user.set_password(data['password'])
            updated = True

        if updated:
            db.session.commit()
            logger.info(f"Profile updated successfully for user ID: {current_user_id}")
            return jsonify({"msg": "Profile updated successfully", "user": user.to_dict()})
        else:
            logger.info(f"No fields to update for user ID: {current_user_id}")
            return jsonify({"msg": "No changes provided", "user": user.to_dict()})

    except Exception as e:
        db.session.rollback()
        logger.error(f'Profile update error for user {current_user_id}: {str(e)}')
        return jsonify({"msg": 'Failed to update profile'}), 500 