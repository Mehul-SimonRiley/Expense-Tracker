from flask import Flask
from flask_cors import CORS
from extensions import db, jwt, cache, migrate
from config import Config
import logging
from middleware.cors import handle_options_request

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
             "origins": app.config['CORS_ORIGINS'],
             "methods": app.config['CORS_METHODS'],
             "allow_headers": app.config['CORS_ALLOW_HEADERS'],
             "expose_headers": app.config['CORS_EXPOSE_HEADERS'],
             "supports_credentials": app.config['CORS_SUPPORTS_CREDENTIALS'],
             "max_age": app.config['CORS_MAX_AGE']
         }})
    db.init_app(app)
    jwt.init_app(app)
    cache.init_app(app)
    migrate.init_app(app, db)

    # Add CORS middleware
    @app.before_request
    def before_request():
        response = handle_options_request()
        if response:
            return response

    # Register blueprints with /api prefix
    from routes.auth import auth_bp
    from routes.transactions import transactions_bp
    from routes.categories import categories_bp
    from routes.budgets import budgets_bp
    from routes.users import users_bp
    from routes.reports import reports_bp
    from routes.dashboard import dashboard_bp
    from routes.notifications import notifications_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    app.register_blueprint(budgets_bp, url_prefix='/api/budgets')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')

    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)