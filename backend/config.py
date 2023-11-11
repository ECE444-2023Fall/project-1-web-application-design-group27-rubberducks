from decouple import config
import os

BASE_DIR = os.path.dirname(os.path.realpath(__file__))


class Config:
    SECRET_KEY = config("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = config("SQLALCHEMY_TRACK_MODIFICATIONS", cast=bool)
    SQLALCHEMY_DATABASE_URI = config("DATABASE_URL")
    BUCKET = config("BUCKET")
    AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY")
    AWS_DEFAULT_REGION = config("AWS_DEFAULT_REGION")

class DevConfig(Config):
    DEBUG = True
    SQLACHEMY_ECHO = True


class ProdConfig(Config):
    DEBUG = False
    SQLACHEMY_ECHO = False


class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = config("TEST_DATABASE_URL")
    SQLACHEMY_ECHO = False
    TESTING = True

