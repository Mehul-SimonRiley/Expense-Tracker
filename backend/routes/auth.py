from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models.user import User
from extensions import db

bp = Blueprint("auth", __name__)

@bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        existing_user = User.query.filter_by(email=data["email"]).first()
        if existing_user:
            return jsonify({"message": "Email already registered"}), 400

        hashed_password = generate_password_hash(data["password"])
        user = User(
            name=data["name"],
            email=data["email"],
            phone=data["phone"],
            password_hash=hashed_password,
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": "An error occurred during registration.", "details": str(e)}), 500

@bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        user = User.query.filter_by(email=data["email"]).first()
        if user and check_password_hash(user.password_hash, data["password"]):
            access_token = create_access_token(identity=str(user.id))
            return jsonify({"access_token": access_token}), 200
        return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": "An error occurred during login.", "details": str(e)}), 500