import telebot
from telebot import types
import requests

TOKEN = "7832070396:AAGkHgAZ0NT84_QjAFDN3CTQI50AHeZ04jY"

bot = telebot.TeleBot(TOKEN)


@bot.message_handler(commands=['start'])
def send_welcome(message):
    welcome_text = "Привет! 👋 Я калькулятор цен скинов в CS2! Рад тебя видеть!"
    bot.send_message(message.chat.id, welcome_text)  # Изменено на send_message для единообразия


@bot.message_handler(commands=['help'])
def send_help(message):
    help_text = "Я калькулятор цен скинов в CS2. Вот что я умею:\n/start - начать общение\n/help - получить помощь\n/search - поиск скина\n/skin_add - добавить скин для проверки цены"
    bot.send_message(message.chat.id, help_text)  # Изменено на send_message


@bot.message_handler(commands=['search'])
def search_help(message):
    help_text = "Поисковик скинов. Используйте /skin_add чтобы добавить скин."
    bot.send_message(message.chat.id, help_text)  # Изменено на send_message


@bot.message_handler(commands=["skin_add"])
def show_inline_keyboard(message):
    markup = types.InlineKeyboardMarkup(row_width=2)
    btn1 = types.InlineKeyboardButton("Добавить скин", callback_data='skin_add')
    markup.add(btn1)
    question_text = "Нажмите на кнопку для подтверждения действия"
    bot.send_message(message.chat.id, question_text, reply_markup=markup)


@bot.callback_query_handler(func=lambda call: True)
def handle_inline_button(call):
    if call.data == "skin_add":
        bot.answer_callback_query(call.id, "Успешное подтверждение!")

        # Удаляем клавиатуру из предыдущего сообщения
        bot.edit_message_text(
            chat_id=call.message.chat.id,
            message_id=call.message.message_id,
            text="Подтверждено!",
            reply_markup=None
        )

        # Отправляем НОВОЕ сообщение с запросом названия скина (СТРОКА 56)
        msg = bot.send_message(
            call.message.chat.id,
            "Введите название скина (Пример: AK-47 | Redline (Field-Tested))"
        )

        # Регистрируем следующий шаг для нового сообщения
        bot.register_next_step_handler(msg, get_skin_price)


def get_skin_price(message):
    """Получает цену скина и отправляет в Telegram"""
    skin_name = message.text.strip()

    # Отправляем сообщение о начале поиска (СТРОКА 80)
    bot.send_message(message.chat.id, f"Ищу информацию для скина: {skin_name}...")

    try:
        params = {
            'appid': 730,
            'currency': 5,  # 5 - российский рубль
            'market_hash_name': skin_name
        }

        response = requests.get('https://steamcommunity.com/market/priceoverview/', params=params)
        data = response.json()

        if data.get('success'):
            lowest_price = data.get('lowest_price', 'N/A')
            median_price = data.get('median_price', 'N/A')
            volume = data.get('volume', 'N/A')

            # Формируем сообщение с ценой
            price_info = f"Информация о скине {skin_name}:\n\n"
            price_info += f"Самая низкая цена: {lowest_price}\n"
            price_info += f"Медианная цена: {median_price}\n"
            price_info += f"Продано за 24 часа: {volume}"

            # Отправляем информацию в Telegram (СТРОКА 88)
            bot.send_message(message.chat.id, price_info)
            print(price_info)
            # Также выводим в консоль для отладки
            print(f"Цена {skin_name}:")
            print(f"Самая низкая: {lowest_price}")
            print(f"Медианная: {median_price}")
            print(f"Объем продаж: {volume}")
        else:
            # Отправляем сообщение об ошибке (СТРОКА 88 для else)
            bot.send_message(
                message.chat.id,
                f"Не удалось получить данные для скина '{skin_name}'. Проверьте правильность названия."
            )

    except Exception as e:
        # Отправляем сообщение об ошибке (СТРОКА 88 для except)
        bot.send_message(message.chat.id, f"Произошла ошибка: {str(e)}")


@bot.message_handler(func=lambda message: True)
def echo_all(message):
    user_text = message.text.lower()
    if "привет" in user_text:
        response = f"И тебе привет!"
        bot.send_message(message.chat.id, response)  # Изменено на send_message
    else:
        # Для любого другого текста предлагаем использовать команду
        bot.send_message(message.chat.id, "Используйте /skin_add чтобы узнать цену скина")  # Изменено на send_message



# Запуск бота
if __name__ == "__main__":
    print("Бот запущен")
    bot.infinity_polling()