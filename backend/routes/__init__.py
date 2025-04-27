# This file can remain empty or include package-level imports if needed.

from .auth import auth_bp
from .transactions import transactions_bp
from .categories import categories_bp
from .budgets import budgets_bp
from .reports import reports_bp

__all__ = ['auth_bp', 'transactions_bp', 'categories_bp', 'budgets_bp', 'reports_bp']

def register_routes(app):
    app.register_blueprint(root)
    app.register_blueprint(auth_bp)
    app.register_blueprint(transactions_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(budgets_bp)
    app.register_blueprint(dashboard)
    app.register_blueprint(settings)
    app.register_blueprint(reports_bp)