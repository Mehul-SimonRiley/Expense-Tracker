from datetime import timedelta
import os

# Determine the absolute path to the project's root directory
# Assuming config.py is in the backend directory
basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
instance_path = os.path.join(basedir, 'backend', 'instance')

class Config:
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
    
    # Database
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(instance_path, "expense_tracker.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-jwt-secret-key-here')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Cache
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300
    
    # Rate Limiting
    RATELIMIT_DEFAULT = "200 per day;50 per hour;1 per second"
    RATELIMIT_STORAGE_URL = "memory://"
    
    # CORS settings
    CORS_HEADERS = 'Content-Type'
    
    # CORS
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5000", "http://127.0.0.1:5000"]
    CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"]
    CORS_ALLOW_HEADERS = ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
    CORS_EXPOSE_HEADERS = ["Content-Type", "Authorization"]
    CORS_SUPPORTS_CREDENTIALS = True
    CORS_MAX_AGE = 3600
    CORS_SEND_WILDCARD = False
    CORS_AUTOMATIC_OPTIONS = True
    CORS_VARY_HEADER = True