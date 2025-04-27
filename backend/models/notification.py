from extensions import db
from datetime import datetime

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # budget_alert, system, etc.
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    notification_data = db.Column(db.JSON)  # Additional data like budget_id, amount, etc.
    
    # Relationships
    user = db.relationship('User', backref='notifications')
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'title': self.title,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat(),
            'notification_data': self.notification_data
        }
    
    @classmethod
    def create_budget_alert(cls, user_id, budget_data):
        return cls(
            user_id=user_id,
            type='budget_alert',
            title='Budget Alert',
            message=f'You have used {budget_data["current_percentage"]}% of your budget for {budget_data["category_name"]}.',
            notification_data={
                'budget_id': budget_data['budget_id'],
                'category_id': budget_data['category_id'],
                'current_percentage': budget_data['current_percentage'],
                'amount_remaining': budget_data['amount_remaining']
            }
        )
    
    @classmethod
    def create_system_notification(cls, user_id, title, message, notification_data=None):
        return cls(
            user_id=user_id,
            type='system',
            title=title,
            message=message,
            notification_data=notification_data
        ) 