from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS
from app import create_app, db
from dotenv import load_dotenv
import os

load_dotenv()

app = create_app()

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

# Initialize CORS
CORS(app)

# Initialize the database when the app starts
with app.app_context():
    db.create_all()

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return {"error": "Not Found"}, 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return {"error": "Internal Server Error"}, 500

if __name__ == '__main__':
    app.run(debug=True)

# test