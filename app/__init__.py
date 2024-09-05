from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
from flask_cors import CORS
from dotenv import load_dotenv
from flask_session import Session


load_dotenv()  # Load environment variables

# Initialize extensions globally
db = SQLAlchemy()
login_manager = LoginManager()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')  # Load config from config.py

    # Enable CORS for cross-origin requests and support for credentials (cookies)
    CORS(app, supports_credentials=True)
    
    # Initialize extensions with app
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    
    from app.models import PropertyManager

    # Login settings
    login_manager.login_view = 'http://localhost:3000/pm-portal'  # Redirect to frontend login page if not authenticated

    # Custom unauthorized handler (for API-based responses)
    @login_manager.unauthorized_handler
    def unauthorized():
        # Redirect to the frontend login page if unauthorized
        return redirect('http://localhost:3000/pm-portal')  # Redirect to your frontend login page

    @login_manager.user_loader
    def load_user(user_id):
        # This loads the user by ID for session handling
        return PropertyManager.query.get(int(user_id))

    # Initialize Flask-Session for server-side session handling
    Session(app)

    # Register blueprints (routes)
    from app.routes import main
    from app.auth import auth  # Import your auth blueprint

    app.register_blueprint(main)
    app.register_blueprint(auth)

    return app