from flask import request
from flask_restx import Namespace, Resource
import os
import boto3
from backend.config import Config
#from config import Config
from werkzeug.utils import secure_filename

s3_ns = Namespace("s3", description="Storage operations")

@s3_ns.route("/upload", methods=["POST"])
class s3Upload(Resource):
    def post(file):
        if request.method == "POST":
            f = request.files['file']
            type = request.form['type']
            path = os.path.join("uploads",type, secure_filename(f.filename))
            f.save(path)
            get_client().upload_file(f"uploads/{type}/{f.filename}", Config.BUCKET, path)
            return {"message": "file uploaded", "path":f"{path}"}, 200
        
@s3_ns.route("/download", methods=["GET"])
class s3Download(Resource):
    def get(file):
        if request.method == "GET":
            path = request.args.get('path')
            get_client().download_file(Config.BUCKET, path, str(path))
            return {"message": f"file saved to {path}"}, 200

def get_client():
    return boto3.client(
        's3',
        Config.AWS_DEFAULT_REGION,
        aws_access_key_id = Config.AWS_ACCESS_KEY_ID,
        aws_secret_access_key = Config.AWS_SECRET_ACCESS_KEY
    )