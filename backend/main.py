from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from extensions import db
from routes import auth, transactions, categories, budgets, dashboard, calendar, reports, settings
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config.from_object(Config)
CORS(app, resources={r"/api/*": {"origins": "*"}})
JWTManager(app)

db.init_app(app)
migrate = Migrate(app, db)

from routes import auth, transactions, categories, budgets
app.register_blueprint(auth.bp, url_prefix="/auth")
app.register_blueprint(transactions.bp, url_prefix="/transactions")
app.register_blueprint(categories.bp, url_prefix="/categories")
app.register_blueprint(budgets.bp, url_prefix="/budgets")
app.register_blueprint(dashboard.bp, url_prefix="/dashboard")
app.register_blueprint(calendar.bp, url_prefix="/calendar")
app.register_blueprint(reports.bp, url_prefix="/reports")
app.register_blueprint(settings.bp, url_prefix="/settings")

@app.route("/")
def index():
    return "Welcome to the Expense Tracker API!"

if __name__ == "__main__":
    app.run(debug=True)