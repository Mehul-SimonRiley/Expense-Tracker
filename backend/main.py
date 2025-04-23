from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from extensions import db  # Import db from extensions.py

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
JWTManager(app)

# Initialize extensions
db.init_app(app)

# Import routes after initializing db to avoid circular imports
from routes import auth, transactions, categories, budgets

# Register blueprints
app.register_blueprint(auth.bp, url_prefix="/auth")
app.register_blueprint(transactions.bp, url_prefix="/transactions")
app.register_blueprint(categories.bp, url_prefix="/categories")
app.register_blueprint(budgets.bp, url_prefix="/budgets")

# Create database tables
with app.app_context():
    db.create_all()
    print("Database tables created successfully!")

# Default route
@app.route("/")
def index():
    return "Welcome to the Expense Tracker API!"

if __name__ == "__main__":
    app.run(debug=True)