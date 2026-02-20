import requests
import urllib.parse


def get_steam_item_info(item_name: str, app_id: int = 730):
    """Простой запрос информации о предмете"""

    # Кодируем название для URL
    encoded_name = urllib.parse.quote(item_name)

    # URL для запроса цен
    url = "https://steamcommunity.com/market/priceoverview/"

    params = {
        'appid': app_id,
        'market_hash_name': item_name,
        'currency': 1  # USD
    }

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }

    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)

        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Status code: {response.status_code}"}

    except Exception as e:
        return {"error": str(e)}


# Использование
item_info = get_steam_item_info("AK-47 | Redline (Field-Tested)")
print(item_info)