from extensions import db
from models.user import User
from main import create_app

def check_user():
    app = create_app()
    with app.app_context():
        user = User.query.filter_by(email='test@example.com').first()
        if user:
            print("User exists:")
            print(f"ID: {user.id}")
            print(f"Name: {user.name}")
            print(f"Email: {user.email}")
        else:
            print("User does not exist in the database.")

if __name__ == '__main__':
    check_user() 