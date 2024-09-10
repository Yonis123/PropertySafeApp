from flask import Flask, redirect, url_for, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
from flask_cors import CORS
from dotenv import load_dotenv
from flask_session import Session
import os

load_dotenv()  # Load environment variables

# Initialize extensions globally
db = SQLAlchemy()
login_manager = LoginManager()
mail = Mail()

def create_app():
    # Update the static_folder path to point to the React build folder
    app = Flask(__name__, static_folder="../front-end/build", static_url_path="/")
    app.config.from_object('app.config.Config')  # Load config from config.py

    # Enable CORS for cross-origin requests and support for credentials (cookies)
    CORS(app, supports_credentials=True)
    


    # Initialize extensions with app
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)

    from app.models import PropertyManager

    # Login settings
    login_manager.login_view = f"{os.getenv('API_URL')}/pm-portal"

    # Custom unauthorized handler (for API-based responses)
    @login_manager.unauthorized_handler
    def unauthorized():
        return redirect(os.getenv("LOGIN_URL", f"{os.getenv('API_URL')}/pm-portal"))

    @login_manager.user_loader
    def load_user(user_id):
        return PropertyManager.query.get(int(user_id))

    # Initialize Flask-Session for server-side session handling
    Session(app)

    # Register blueprints (routes)
    from app.routes import main
    from app.auth import auth  # Import your auth blueprint

    app.register_blueprint(main)
    app.register_blueprint(auth)

    # Serve React static files
    @app.route('/')
    @app.route('/<path:path>')
    def serve_react(path=""):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app