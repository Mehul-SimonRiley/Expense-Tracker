from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    theme = db.Column(db.String(50), default="light")  # "light" or "dark"
    language = db.Column(db.String(50), default="en")  # e.g., "en", "es"
    date_format = db.Column(db.String(20), default="YYYY-MM-DD")
    start_of_week = db.Column(db.String(10), default="Monday")
    email_notifications = db.Column(db.Boolean, default=True)
    push_notifications = db.Column(db.Boolean, default=True)