from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/api/helloworld")
def hello():
    return jsonify({
        'message': "Hello From FLask!!!"
    })

if __name__ == "__main__":
    app.run(debug=True)