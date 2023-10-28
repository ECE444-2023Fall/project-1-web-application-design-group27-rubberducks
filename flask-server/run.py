from main import create_app
from config import DevConfig
from flask_cors import CORS
if __name__ == "__main__":
    app = create_app(DevConfig)
    CORS(app)
    app.run(debug=True, port=8000)
