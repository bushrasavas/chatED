from flask import Blueprint, request, jsonify
from app.models.user import User
from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

def generate_token(user_id):
    """JWT token generator function"""
    payload = {
        'sub': user_id,  # Subject - User's ID
        'exp': datetime.utcnow() + timedelta(seconds=int(os.getenv("JWT_EXPIRES_IN"))),  # Expiration time
    }
    token = jwt.encode(payload, os.getenv("JWT_SECRET_KEY"), algorithm='HS256')
    return token

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration route"""
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Ensure all fields are provided
    if not all([username, email, password]):
        return jsonify({'error': 'All fields are required'}), 400
    
    # Check if user already exists
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'error': 'User already exists'}), 409

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create new user
    new_user = User(
        username=username,
        email=email,
        password=hashed_password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to register user'}), 500

    # Respond with a success message and user ID
    return jsonify({'message': 'User registered successfully', 'user_id': new_user.id}), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login route"""
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Find user by email
    user = User.query.filter_by(email=email).first()

    # Check if user exists and password matches
    if user and check_password_hash(user.password, password):
        # Generate JWT token for authenticated user
        token = generate_token(user.id)
        return jsonify({'token': token}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401