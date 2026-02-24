import telebot
from telebot import types
import requests

TOKEN = "7832070396:AAGkHgAZ0NT84_QjAFDN3CTQI50AHeZ04jY"

bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start'])
#если человек напишет start
def send_welcome(message):
#message - это объект, содержащий всю информацию о входящем сообщении
    welcome_text = "Привет! 👋 Я калькулятор цен скинов в CS2! Рад тебя видеть!"
    bot.reply_to(message, welcome_text)

@bot.message_handler(commands=['help'])
def send_help(message):
    help_text = "Я калькулятор цен скинов в CS2. Вот что я умею: /start - начать общение /help - получить помощь"
    bot.reply_to(message, help_text)

@bot.message_handler(commands=['search'])
def search_help(message):
    help_text = "Поисковик"
    bot.reply_to(message, help_text)


@bot.message_handler(commands=["skin_add"])
def show_inline_keyboard(message):

    markup = types.InlineKeyboardMarkup(row_width=2)  # колво кнопок в линии

    btn1 = types.InlineKeyboardButton("Добавить скин", callback_data='skin_add')

    markup.add(btn1)
    question_text = "Нажмите на кнопку для подтверждения действия"
    bot.send_message(message.chat.id, question_text, reply_markup=markup)


@bot.callback_query_handler(func=lambda call: True)
def handle_inline_button(call):
    if call.data == "skin_add":
        bot.answer_callback_query(call.id, "Успешное подтверждение!")  # отвечаем на событие 'like'

        bot.edit_message_text(
            chat_id=call.message.chat.id,
            message_id=call.message.message_id,
            text="Введите название скина ( Пример: AK-47 | Redline (Field-Tested) )",
            reply_markup=None  # Убираем клаву
        )

@bot.message_handler(func=lambda message: True)
def echo_all(message):
    user_text = message.text.lower()
    if "привет" in user_text:
        response = f"И тебе привет!😊"
    else:
        params = {
            'appid': 730,
            'currency': 5,
            'market_hash_name': 'AK-47 | Redline (Field-Tested)'
        }

        response = requests.get('https://steamcommunity.com/market/priceoverview/', params=params)
        data = response.json()

        if data.get('success'):
            print(f"Цена AK-47 | Redline (Field-Tested):")
            print(f"Самая низкая: {data.get('lowest_price', 'N/A')}")
            print(f"Медианная: {data.get('median_price', 'N/A')}")
            print(f"Объем продаж: {data.get('volume', 'N/A')}")
        else:
            print("Не удалось получить данные")



#Запуск бота
if __name__ == "__main__":
    print("Бот запущен")
    bot.infinity_polling() #запускает бесконечный цикл опроса серверов Telegram\