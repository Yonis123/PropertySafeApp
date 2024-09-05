from flask import Blueprint, request, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from app.models import PropertyManager
from flask_cors import cross_origin

auth = Blueprint('auth', __name__)

# Login Route
@auth.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = PropertyManager.query.filter_by(email=email).first()

    if user is None or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    login_user(user)
    return jsonify({"message": "Logged in successfully"}), 200


# Logout Route
@auth.route('/logout', methods=['POST'])
@login_required  # Ensure the user is logged in to log out
@cross_origin(supports_credentials=True)
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200


# Current User Route
@auth.route('/current_pm', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({"email": current_user.email}), 200
    else:
        return jsonify({"error": "User not authenticated"}), 401