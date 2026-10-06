from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json


app = Flask(__name__)
CORS(app)


# Открываем файл и загружаем данные
with open('variables.json', 'r') as file:
    data = json.load(file)

# Теперь ключ доступен как data['api_key']
API_KEY = data['API_KEY']


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
    currency = data.get("currency", "RUB")
    
    with open("deals.txt", "a", encoding="utf-8") as file:
        file.write(
            f"{name};{purchase_price};{currency};{purchase_date};{operation_type};{comment}\n"
        )

    return jsonify({
        "message": "Deal saved successfully"
    })

@app.route("/api/get_profile_image", methods=["GET"])
def get_profile_image(steam_id):

    profile = requests.get(
        "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
        params={
            "key": API_KEY,
            "steamids": steam_id
        }
    ).json()

    return profile["response"]["players"][0]["avatarfull"]


@app.route("/api/get_profile_name", methods=["GET"])
def get_profile_name(steam_id):

    profile = requests.get(
        "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
        params={
            "key": API_KEY,
            "steamids": steam_id
        }
    ).json()

    return profile["response"]["players"][0]["personaname"]




if __name__ == "__main__":
    app.run(debug=True)
