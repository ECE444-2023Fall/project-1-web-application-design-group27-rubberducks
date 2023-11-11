from backend.main import create_app
from backend.config import ProdConfig
from flask_cors import CORS

app = create_app(ProdConfig)

if __name__ == "__main__":
    CORS(app)
    app.run(debug=False, port=8000)
