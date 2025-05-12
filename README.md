# Expense Tracker

A full-stack web application for tracking personal expenses and managing budgets.

## Features

- User authentication and authorization
- Transaction management (income and expenses)
- Category-based expense tracking
- Budget planning and monitoring
- Monthly reports and analytics
- Responsive design

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls
- Chart.js for data visualization

### Backend
- Python Flask
- SQLite database
- JWT authentication
- Flask-Migrate for database migrations

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
python create_test_user.py  # Creates a test user
flask run
```

3. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Test User Credentials

- Email: test@example.com
- Password: test123

## API Documentation

The API documentation is available at http://localhost:5000/api/docs when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 