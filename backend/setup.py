from setuptools import setup, find_packages

setup(
    name="expense-tracker",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "Flask==2.3.3",
        "Flask-SQLAlchemy==3.1.1",
        "Flask-JWT-Extended==4.5.3",
        "Flask-Cors==4.0.0",
        "Flask-Migrate==4.0.5",
        "Flask-Caching==2.1.0",
        "Flask-Limiter==3.5.0",
        "xlsxwriter==3.1.9",
        "python-dotenv==1.0.0",
        "Werkzeug==3.1.3",
        "SQLAlchemy==2.0.40",
        "PyJWT==2.10.1",
        "APScheduler==3.10.4",
        "redis==5.0.1",
        "celery==5.3.6",
        "pandas==2.2.3",
    ],
    python_requires=">=3.8",
    setup_requires=[
        "wheel==0.42.0",
        "setuptools==69.0.3",
    ],
) 