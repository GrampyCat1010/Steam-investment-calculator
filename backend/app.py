from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/api/helloworld")
def hello():
    return jsonify({
        'message': "Hello From FLask!!!"
    })

@app.route("/api/save_deal")
def save_deal(name, purchase_price, purchase_date, operation_type, comment):
    with open("deals.txt", "w", encoding="utf-8") as file:
        file.write(name, purchase_price, purchase_date, operation_type, comment)




if __name__ == "__main__":
    app.run(debug=True)