from extensions import db
from datetime import datetime
# Ensure User is imported if needed for direct column reference, but string is preferred
# from .user import User 

class Budget(db.Model):
    __tablename__ = 'budget' # Explicitly set table name
    
    id = db.Column(db.Integer, primary_key=True)
    # Revert to standard ForeignKey definition
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    spent = db.Column(db.Float, default=0.0)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    alert_threshold = db.Column(db.Float, default=0.8)  # Alert when 80% of budget is used
    alert_enabled = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    category = db.relationship('Category', backref='budgets')
    # user = db.relationship('User', backref='budgets') # Removed conflicting relationship
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_id': self.category_id,
            'amount': self.amount,
            'spent': self.spent,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'alert_threshold': self.alert_threshold,
            'alert_enabled': self.alert_enabled,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def check_alert(self, current_spending):
        if not self.alert_enabled:
            return None
            
        percentage_used = current_spending / self.amount
        if percentage_used >= self.alert_threshold:
            return {
                'budget_id': self.id,
                'category_id': self.category_id,
                'threshold': self.alert_threshold,
                'current_percentage': round(percentage_used * 100, 2),
                'amount_remaining': self.amount - current_spending
            }
        return None