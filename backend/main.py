from flask import Flask
from flask_cors import CORS
from extensions import db, jwt, cache, migrate, mail
from config import Config
import logging
from middleware.cors import handle_options_request
from routes import register_routes
from routes.auth import auth_bp, init_email_service
# from routes.settings import settings_bp
# from routes.transactions import transactions_bp
# from routes.categories import categories_bp
# from routes.budgets import budgets_bp
# from routes.reports import reports_bp
# from routes.export import export_bp
# from routes.notifications import notifications_bp
# from routes.currency import currency_bp
# from routes.reminders import reminders_bp
# from routes.goals import goals_bp
# from routes.recurring import recurring_bp
# from routes.scheduler import scheduler_bp
# from routes.tasks import tasks_bp
# from routes.check_user import check_user_bp
from logging.handlers import RotatingFileHandler
import os

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
    mail.init_app(app)

    # Initialize email service
    init_email_service(app)

    # Add CORS middleware
    @app.before_request
    def before_request():
        response = handle_options_request()
        if response:
            return response

    # Register all routes
    register_routes(app)

    # Register blueprints
    # app.register_blueprint(auth_bp, url_prefix='/api/auth')
    # app.register_blueprint(settings_bp, url_prefix='/api/settings')
    # app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
    # app.register_blueprint(categories_bp, url_prefix='/api/categories')
    # app.register_blueprint(budgets_bp, url_prefix='/api/budgets')
    # app.register_blueprint(reports_bp, url_prefix='/api/reports')
    # app.register_blueprint(export_bp, url_prefix='/api/export')
    # app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    # app.register_blueprint(currency_bp, url_prefix='/api/currency')
    # app.register_blueprint(reminders_bp, url_prefix='/api/reminders')
    # app.register_blueprint(goals_bp, url_prefix='/api/goals')
    # app.register_blueprint(recurring_bp, url_prefix='/api/recurring')
    # app.register_blueprint(scheduler_bp, url_prefix='/api/scheduler')
    # app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    # app.register_blueprint(check_user_bp, url_prefix='/api/check-user')

    # Create database tables
    with app.app_context():
        db.create_all()

    # Setup logging
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/expense_tracker.log',
                                         maxBytes=10240,
                                         backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s '
            '[in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        
        app.logger.setLevel(logging.INFO)
        app.logger.info('Expense Tracker startup')

    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)