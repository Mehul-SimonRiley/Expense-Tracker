from datetime import timedelta
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Determine the absolute path to the project's root directory
basedir = os.path.abspath(os.path.dirname(__file__))
instance_path = os.path.join(basedir, 'instance')

class Config:
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    DEBUG = True
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        f'sqlite:///{os.path.join(instance_path, "expense_tracker.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    JWT_ERROR_MESSAGE_KEY = 'msg'
    JWT_ALGORITHM = 'HS256'
    JWT_DECODE_ALGORITHMS = ['HS256']
    JWT_ENCODE_NBF = False
    JWT_ENCODE_IAT = True
    JWT_ENCODE_JTI = False
    JWT_JSON_KEY = 'access_token'
    JWT_REFRESH_JSON_KEY = 'refresh_token'
    JWT_ACCESS_CSRF_HEADER_NAME = 'X-CSRF-TOKEN'
    JWT_REFRESH_CSRF_HEADER_NAME = 'X-CSRF-REFRESH-TOKEN'
    
    # Cache
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300
    
    # Rate Limiting
    RATELIMIT_DEFAULT = "1000000 per day;100000 per hour;1000 per second"
    RATELIMIT_STORAGE_URL = "memory://"
    
    # CORS settings
    CORS_HEADERS = 'Content-Type'
    
    # CORS
    CORS_ORIGINS = [
        'http://localhost:3000',
        'https://expense-tracker-kfwa.onrender.com'
    ]  # Add your frontend URL
    CORS_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    CORS_ALLOW_HEADERS = ['Content-Type', 'Authorization']
    CORS_EXPOSE_HEADERS = ['Content-Type', 'Authorization']
    CORS_SUPPORTS_CREDENTIALS = True
    CORS_MAX_AGE = 3600
    CORS_SEND_WILDCARD = False
    CORS_AUTOMATIC_OPTIONS = True
    CORS_VARY_HEADER = True

    # Other configurations
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

    # Email
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', True)
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER')

    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

class ProductionConfig(Config):
    DEBUG = False
    
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        
        # Log to stderr in production
        import logging
        from logging import StreamHandler
        file_handler = StreamHandler()
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}