# This file can remain empty or include package-level imports if needed.

from .auth import auth_bp
from .transactions import transactions_bp
from .categories import categories_bp
from .budgets import budgets_bp
from .reports import reports_bp
from .dashboard import dashboard_bp
from .settings import settings_bp
from .notifications import notifications_bp
from .root import bp as root_bp

__all__ = [
    'auth_bp',
    'transactions_bp',
    'categories_bp',
    'budgets_bp',
    'reports_bp',
    'dashboard_bp',
    'settings_bp',
    'notifications_bp',
    'root_bp'
]

def register_routes(app):
    # Register root blueprint first
    app.register_blueprint(root_bp)
    
    # Register API blueprints with their respective prefixes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    app.register_blueprint(budgets_bp, url_prefix='/api/budgets')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')