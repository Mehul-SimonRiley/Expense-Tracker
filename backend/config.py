from datetime import timedelta
class Config:
    SECRET_KEY = "your_secret_key"
    JWT_SECRET_KEY = "your_jwt_secret_key"
    SQLALCHEMY_DATABASE_URI = "sqlite:///expense_tracker.db"  # SQLite database file
    SQLALCHEMY_TRACK_MODIFICATIONS = False