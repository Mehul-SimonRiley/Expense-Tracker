from flask import Flask
from flask_cors import CORS
from extensions import db, jwt, cache, migrate
from config import Config
import logging
from middleware.cors import handle_options_request
from routes import register_routes

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
         resources={r"/*": {  # Allow all routes
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

    # Register all routes
    register_routes(app)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)