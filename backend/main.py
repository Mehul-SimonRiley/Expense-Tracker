from flask import Flask
from flask_cors import CORS
from extensions import db, jwt, cache, limiter, migrate
from config import Config
import logging
from middleware.cors import handle_options_request

app = Flask(__name__)
from routes.auth import auth_bp
app.register_blueprint(auth_bp, url_prefix="/auth/login")

# Basic logging configuration
logging.basicConfig(level=logging.INFO)

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    # Ensure instance folder exists
    try:
        import os
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Initialize extensions
    CORS(app, 
         resources={r"/api/*": {
             "origins": "http://localhost:3000",
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "max_age": 3600
         }})
    db.init_app(app)
    jwt.init_app(app)
    cache.init_app(app)
    limiter.init_app(app)
    migrate.init_app(app, db)

    # Add CORS middleware
    @app.before_request
    def before_request():
        response = handle_options_request()
        if response:
            return response

    # Register blueprints
    from routes.auth import auth_bp
    from routes.transactions import transactions_bp
    from routes.categories import categories_bp
    from routes.budgets import budgets_bp
    from routes.reports import reports_bp
    from routes.dashboard import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    app.register_blueprint(budgets_bp, url_prefix='/api/budgets')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)