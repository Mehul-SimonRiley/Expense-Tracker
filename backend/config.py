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
    CORS_ORIGINS = ['http://localhost:3000']  # Add your frontend URL
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