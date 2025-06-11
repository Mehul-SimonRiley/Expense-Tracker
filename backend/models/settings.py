from extensions import db
from datetime import datetime

class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Profile Settings
    bio = db.Column(db.Text)
    date_of_birth = db.Column(db.Date)
    occupation = db.Column(db.String(100))
    location = db.Column(db.String(100))
    profile_picture = db.Column(db.String(200))
    
    # Security Settings
    two_factor_enabled = db.Column(db.Boolean, default=False)
    login_notifications = db.Column(db.Boolean, default=True)
    session_timeout = db.Column(db.Integer, default=30)  # in minutes
    
    # Preferences
    language = db.Column(db.String(10), default='en')
    date_format = db.Column(db.String(20), default='MM/DD/YYYY')
    time_format = db.Column(db.String(10), default='12')  # 12 or 24
    timezone = db.Column(db.String(50), default='America/New_York')
    
    # Currency Settings
    primary_currency = db.Column(db.String(10), default='USD')
    currency_display = db.Column(db.String(10), default='symbol')  # symbol, code, name
    decimal_separator = db.Column(db.String(1), default='.')
    thousands_separator = db.Column(db.String(1), default=',')
    decimal_places = db.Column(db.Integer, default=2)
    show_currency_symbol = db.Column(db.Boolean, default=True)
    
    # Notification Settings
    email_notifications = db.Column(db.JSON, default={
        'budgetAlerts': True,
        'monthlyReports': True,
        'transactionReminders': False,
        'securityAlerts': True,
        'promotionalEmails': False
    })
    push_notifications = db.Column(db.JSON, default={
        'newTransactions': True,
        'budgetLimits': True,
        'billReminders': True,
        'weeklyDigest': False
    })
    notification_frequency = db.Column(db.String(20), default='immediate')  # immediate, daily, weekly
    quiet_hours = db.Column(db.JSON, default={
        'enabled': True,
        'startTime': '22:00',
        'endTime': '08:00'
    })
    
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            
            # Profile Settings
            'bio': self.bio,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'occupation': self.occupation,
            'location': self.location,
            'profile_picture': self.profile_picture,
            
            # Security Settings
            'two_factor_enabled': self.two_factor_enabled,
            'login_notifications': self.login_notifications,
            'session_timeout': self.session_timeout,
            
            # Preferences
            'language': self.language,
            'date_format': self.date_format,
            'time_format': self.time_format,
            'timezone': self.timezone,
            
            # Currency Settings
            'primary_currency': self.primary_currency,
            'currency_display': self.currency_display,
            'decimal_separator': self.decimal_separator,
            'thousands_separator': self.thousands_separator,
            'decimal_places': self.decimal_places,
            'show_currency_symbol': self.show_currency_symbol,
            
            # Notification Settings
            'email_notifications': self.email_notifications,
            'push_notifications': self.push_notifications,
            'notification_frequency': self.notification_frequency,
            'quiet_hours': self.quiet_hours,
            
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        } 