from flask import Flask # type: ignore
from app.testing.routes import test_bp
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config) 

    app.register_blueprint(test_bp,url_prefix='/testing')

    return app
