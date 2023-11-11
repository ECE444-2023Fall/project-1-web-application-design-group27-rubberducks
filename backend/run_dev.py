from backend.main import create_app
from backend.config import DevConfig
from flask_cors import CORS

app = create_app(DevConfig)

if __name__ == "__main__":
    CORS(app)
    app.run(debug=True, port=8000)
