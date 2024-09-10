import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY') 
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL') 
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY') 
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')
    CORS_HEADERS = 'Content-Type'
    SESSION_TYPE = 'filesystem'
    REACT_APP_API_URL=os.getenv('REACT_APP_API_URL')
    LOGIN_URL=os.getenv('LOGIN_URL')
    API_URL=os.getenv('API_URL')
    OPENAI_API_KEY=os.getenv('OPENAI_API_KEY')
    FLASK_APP=os.getenv('FLASK_APP')