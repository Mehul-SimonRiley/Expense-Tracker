from extensions import db

class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    theme = db.Column(db.String(20), default='light')
    language = db.Column(db.String(10), default='en')
    date_format = db.Column(db.String(20), default='YYYY-MM-DD')
    start_of_week = db.Column(db.String(10), default='Monday')
    email_notifications = db.Column(db.Boolean, default=True)
    push_notifications = db.Column(db.Boolean, default=True)
    currency = db.Column(db.String(10), default='USD')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    def to_dict(self):
        return {
            'theme': self.theme,
            'language': self.language,
            'date_format': self.date_format,
            'start_of_week': self.start_of_week,
            'email_notifications': self.email_notifications,
            'push_notifications': self.push_notifications,
            'currency': self.currency
        } 