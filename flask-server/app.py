from flask import Flask, request

@app.route("/")
def app():
    return "running"
   

if __name__ == "__main__":
    app.run(debug=True)