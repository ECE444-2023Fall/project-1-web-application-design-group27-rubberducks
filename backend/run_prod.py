from backend.main import create_app
from backend.config import ProdConfig

app = create_app(ProdConfig)

if __name__ == "__main__":
    app.run(debug=False, port=8000)
