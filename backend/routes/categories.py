from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.category import Category
from extensions import db

bp = Blueprint("categories", __name__)

@bp.route("/", methods=["GET"])
@jwt_required()
def get_categories():
    user_id = get_jwt_identity()
    categories = Category.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": c.id,
        "name": c.name
    } for c in categories])

@bp.route("/", methods=["POST"])
@jwt_required()
def add_category():
    user_id = get_jwt_identity()
    data = request.json
    category = Category(user_id=user_id, name=data["name"])
    db.session.add(category)
    db.session.commit()
    return jsonify({"message": "Category added successfully"}), 201

@bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_category(id):
    user_id = get_jwt_identity()
    category = Category.query.filter_by(id=id, user_id=user_id).first()
    if not category:
        return jsonify({"message": "Category not found"}), 404
    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Category deleted successfully"}), 200