from flask import current_app
from flask_mail import Mail, Message
import random
import string
from datetime import datetime, timedelta
from extensions import db
import logging

logger = logging.getLogger(__name__)

class EmailVerification(db.Model):
    __tablename__ = 'email_verification'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    code = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    
    def __init__(self, email):
        self.email = email
        self.code = ''.join(random.choices(string.digits, k=6))
        self.expires_at = datetime.utcnow() + timedelta(minutes=15)
    
    def is_expired(self):
        return datetime.utcnow() > self.expires_at

class EmailService:
    def __init__(self, app):
        logger.info("Initializing EmailService")
        self.mail = Mail(app)
        self.app = app
        logger.info(f"Email configuration: SERVER={app.config.get('MAIL_SERVER')}, "
                   f"PORT={app.config.get('MAIL_PORT')}, "
                   f"USERNAME={app.config.get('MAIL_USERNAME')}, "
                   f"USE_TLS={app.config.get('MAIL_USE_TLS')}")
    
    def generate_verification_code(self):
        return ''.join(random.choices(string.digits, k=6))
    
    def send_verification_email(self, email):
        try:
            logger.info(f"Attempting to send verification email to {email}")
            
            # Create new verification record
            verification = EmailVerification(email=email)
            db.session.add(verification)
            db.session.commit()
            logger.info(f"Created verification record with code: {verification.code}")
            
            # Create email message
            msg = Message(
                'Verify Your Email - Traxpense',
                sender=self.app.config['MAIL_DEFAULT_SENDER'],
                recipients=[email]
            )
            
            msg.body = f'''Hello,

Thank you for registering with Traxpense. To verify your email address, please use the following verification code:

{verification.code}

This code will expire in 15 minutes.

If you did not request this verification, please ignore this email.

Best regards,
Traxpense Team'''
            
            msg.html = f'''
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Verify Your Email</h2>
                <p>Thank you for registering with Traxpense. To verify your email address, please use the following verification code:</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <h1 style="color: #007bff; margin: 0;">{verification.code}</h1>
                </div>
                <p style="color: #666;">This code will expire in 15 minutes.</p>
                <p style="color: #666;">If you did not request this verification, please ignore this email.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">Best regards,<br>Traxpense Team</p>
            </div>
            '''
            
            # Send email
            logger.info("Attempting to send email...")
            self.mail.send(msg)
            logger.info(f"Verification email sent successfully to {email}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending verification email to {email}: {str(e)}")
            logger.exception("Full traceback:")
            db.session.rollback()
            return False
    
    def verify_code(self, email, code):
        try:
            logger.info(f"Attempting to verify code for {email}")
            verification = EmailVerification.query.filter_by(
                email=email,
                code=code,
                is_verified=False
            ).first()
            
            if not verification:
                logger.warning(f"Invalid verification code for {email}")
                return False, "Invalid verification code"
            
            if verification.is_expired():
                logger.warning(f"Expired verification code for {email}")
                return False, "Verification code has expired"
            
            verification.is_verified = True
            db.session.commit()
            logger.info(f"Email verified successfully for {email}")
            
            return True, "Email verified successfully"
            
        except Exception as e:
            logger.error(f"Error verifying code for {email}: {str(e)}")
            logger.exception("Full traceback:")
            db.session.rollback()
            return False, "Error verifying code" 