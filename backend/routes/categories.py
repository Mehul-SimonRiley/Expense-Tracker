from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Category, Transaction, Budget # Models only
from extensions import db # Extensions here
import logging

logger = logging.getLogger(__name__)

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('', methods=['POST'])
@jwt_required()
def add_category():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    name = data.get('name')
    color = data.get('color')
    icon = data.get('icon')

    if not all([name, color, icon]):
        return jsonify({"msg": "Missing required fields"}), 400

    # Basic validation for hex color and icon (can be enhanced)
    if not (color.startswith('#') and len(color) == 7):
         return jsonify({"msg": "Invalid color format (must be #XXXXXX)"}), 400
    # Add more validation for icon if needed

    new_category = Category(
        user_id=current_user_id,
        name=name,
        color=color,
        icon=icon
    )
    db.session.add(new_category)
    db.session.commit()

    return jsonify(new_category.to_dict()), 201

@categories_bp.route('', methods=['GET'])
@jwt_required()
def get_categories():
    current_user_id = get_jwt_identity()
    categories = Category.query.filter_by(user_id=current_user_id).order_by(Category.name).all()
    return jsonify([c.to_dict() for c in categories])

@categories_bp.route('/<int:category_id>', methods=['GET'])
@jwt_required()
def get_category(category_id):
    current_user_id = get_jwt_identity()
    category = Category.query.filter_by(id=category_id, user_id=current_user_id).first()
    if not category:
        return jsonify({"msg": "Category not found"}), 404
    return jsonify(category.to_dict())

@categories_bp.route('/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    current_user_id = get_jwt_identity()
    category = Category.query.filter_by(id=category_id, user_id=current_user_id).first()
    if not category:
        return jsonify({"msg": "Category not found"}), 404

    data = request.get_json()
    
    if 'name' in data:
        category.name = data['name']
    if 'color' in data:
        if not (data['color'].startswith('#') and len(data['color']) == 7):
             return jsonify({"msg": "Invalid color format (must be #XXXXXX)"}), 400
        category.color = data['color']
    if 'icon' in data:
        # Add icon validation if needed
        category.icon = data['icon']

    db.session.commit()
    return jsonify(category.to_dict())

@categories_bp.route('/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    current_user_id = get_jwt_identity()
    category = Category.query.filter_by(id=category_id, user_id=current_user_id).first()
    if not category:
        return jsonify({"msg": "Category not found"}), 404

    # Check if category is used in transactions or budgets (optional: decide handling)
    if Transaction.query.filter_by(category_id=category_id).first() or \
       Budget.query.filter_by(category_id=category_id).first():
        # Option 1: Prevent deletion
        return jsonify({"msg": "Cannot delete category, it is currently in use"}), 409 
        # Option 2: Set transactions/budgets category to null (requires model changes)
        # Option 3: Delete associated transactions/budgets (cascade delete - requires model changes)

    db.session.delete(category)
    db.session.commit()
    return jsonify({"msg": "Category deleted successfully"})