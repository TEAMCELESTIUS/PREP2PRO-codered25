from flask import Flask # type: ignore
from app.testing.routes import test_bp
from app.resume.routes import resume_bp
from app.interview.routes import interview_bp
from app.redis.routes import redis_bp
from app.auth.routes import auth_bp
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config) 

    app.register_blueprint(test_bp,url_prefix='/testing')
    app.register_blueprint(resume_bp,url_prefix='/resume')
    app.register_blueprint(interview_bp,url_prefix='/interview')
    app.register_blueprint(redis_bp,url_prefix='/redis')
    app.register_blueprint(auth_bp,url_prefix='/auth')

    return app
