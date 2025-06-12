from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_mail import Mail

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()
migrate = Migrate()
mail = Mail()
cache = Cache(config={
    'CACHE_TYPE': 'simple',
    'CACHE_DEFAULT_TIMEOUT': 300  # 5 minutes
})
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

def configure_jwt(app):
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return str(user.id) if user else None

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        from models.user import User
        identity = jwt_data["sub"]
        return User.query.filter_by(id=identity).one_or_none()

    @jwt.invalid_token_loader
    def invalid_token_callback(error_string):
        return {"msg": f"Invalid token: {error_string}"}, 401

    @jwt.unauthorized_loader
    def unauthorized_callback(error_string):
        return {"msg": "Missing authorization header"}, 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {"msg": "Token has expired"}, 401

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return {"msg": "Token has been revoked"}, 401

    @jwt.needs_fresh_token_loader
    def needs_fresh_token_callback(jwt_header, jwt_payload):
        return {"msg": "Fresh token required"}, 401