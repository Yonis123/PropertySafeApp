from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app import create_app, db


app = create_app()

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