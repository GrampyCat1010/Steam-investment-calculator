from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/api/helloworld")
def hello():
    return jsonify({
        'message': "Hello From FLask!!!"
    })

@app.route("/api/save_deal", methods=["POST"])
def save_deal():
    data = request.get_json()

    name = data["name"]
    purchase_price = data["purchasePrice"]
    purchase_date = data["purchaseDate"]
    operation_type = data["operationType"]
    comment = data["comment"]
    
    with open("deals.txt", "a", encoding="utf-8") as file:
        file.write(
            f"{name};{purchase_price};{purchase_date};{operation_type};{comment}\n"
        )

    return jsonify({
        "message": "Deal saved successfully"
    })



if __name__ == "__main__":
    app.run(debug=True)