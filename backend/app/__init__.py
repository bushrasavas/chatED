"""This module initializes the Flask application and registers blueprints."""

import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from app.routes.auth import auth_bp
from app.routes.chatbot import chatbot_bp
from app.routes.predict import predict_bp
from app.routes.history import history_bp
from app.extensions import db

jwt = JWTManager()  # JWT manager instance

def create_app():
    """Create and configure the Flask application."""
    
    load_dotenv()

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # JWT Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-jwt-key')
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:8081"}})

    # Initialize Flask-Migrate
    migrate = Migrate(app, db) 
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(chatbot_bp)
    app.register_blueprint(predict_bp)
    app.register_blueprint(history_bp)

    return app
