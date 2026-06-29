import telebot
from telebot import types
import requests
import urllib.parse
from collections import defaultdict
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

TOKEN = "7832070396:AAGkHgAZ0NT84_QjAFDN3CTQI50AHeZ04jY"

app_id = 730

# Настройка сессии с повторными попытками при таймаутах
session = requests.Session()
retry = Retry(
    total=3,
    read=3,
    connect=3,
    backoff_factor=0.5,
    status_forcelist=(500, 502, 503, 504)
)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)

# Создаем бота с увеличенными таймаутами
bot = telebot.TeleBot(TOKEN)

# Хранилища данных
user_history = defaultdict(list)  # История поиска
tracked_skins = defaultdict(list)  # Отслеживаемые скины
user_settings = defaultdict(dict)  # Настройки пользователей

# Словарь с валютами
currencies = {
    '🇷🇺 RUB': 5,
    '🇺🇸 USD': 1,
    '🇪🇺 EUR': 3,
    '🇺🇦 UAH': 18
}

# Популярные скины
popular_skins = [
    "AK-47 | Redline (Field-Tested)",
    "AWP | Dragon Lore (Minimal Wear)",
    "M4A4 | Howl (Factory New)",
    "Butterfly Knife | Fade (Minimal Wear)",
    "Desert Eagle | Blaze (Factory New)",
    "AWP | Asiimov (Field-Tested)"
]


@bot.message_handler(commands=['start'])
def send_welcome(message):
    try:
        welcome_text = "Привет! 👋 Я калькулятор цен скинов в CS2! Рад тебя видеть!\n\nИспользуй /menu для открытия главного меню."
        bot.send_message(message.chat.id, welcome_text)
        show_menu(message)  # Сразу показываем меню
    except Exception as e:
        print(f"Ошибка в send_welcome: {e}")


@bot.message_handler(commands=['menu'])
def show_menu(message):
    try:
        markup = types.ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
        btn1 = types.KeyboardButton("🔍 Поиск скина")
        btn2 = types.KeyboardButton("📋 История")
        btn3 = types.KeyboardButton("⭐ Популярные")
        btn4 = types.KeyboardButton("💰 Сравнить")
        btn5 = types.KeyboardButton("🔔 Отслеживать")
        btn6 = types.KeyboardButton("📊 Статистика")
        btn7 = types.KeyboardButton("💱 Валюта")
        btn8 = types.KeyboardButton("❓ Помощь")

        markup.add(btn1, btn2, btn3, btn4, btn5, btn6, btn7, btn8)
        bot.send_message(message.chat.id, "📱 Главное меню:", reply_markup=markup)
    except Exception as e:
        print(f"Ошибка в show_menu: {e}")


@bot.message_handler(commands=['help'])
def send_help(message):
    try:
        help_text = """
🤖 **Доступные команды:**

/start - Начать общение
/menu - Открыть главное меню
/help - Показать эту справку
/skin_add - Добавить скин для проверки
/currency - Выбрать валюту
/history - История поиска
/popular - Популярные скины
/compare - Сравнить два скина
/track - Отслеживать скин
/stats - Статистика цен

📌 **Как пользоваться:**
1. Нажми /skin_add или кнопку "Поиск скина"
2. Введи название скина (пример: AK-47 | Redline (Field-Tested))
3. Получи информацию о цене
        """
        bot.send_message(message.chat.id, help_text, parse_mode='Markdown')
    except Exception as e:
        print(f"Ошибка в send_help: {e}")


@bot.message_handler(commands=['currency'])
def choose_currency(message):
    try:
        markup = types.InlineKeyboardMarkup(row_width=2)
        buttons = []
        for currency_name in currencies.keys():
            buttons.append(types.InlineKeyboardButton(currency_name, callback_data=f'curr_{currency_name}'))
        markup.add(*buttons)
        bot.send_message(message.chat.id, "💱 Выберите валюту:", reply_markup=markup)
    except Exception as e:
        print(f"Ошибка в choose_currency: {e}")


@bot.message_handler(commands=['history'])
def show_history(message):
    try:
        user_id = message.from_user.id
        if user_id in user_history and user_history[user_id]:
            history_text = "📋 **Ваша история поиска:**\n\n"
            for i, skin in enumerate(user_history[user_id], 1):
                history_text += f"{i}. {skin}\n"

            # Добавляем кнопку для очистки истории
            markup = types.InlineKeyboardMarkup()
            markup.add(types.InlineKeyboardButton("🗑 Очистить историю", callback_data='clear_history'))

            bot.send_message(message.chat.id, history_text, parse_mode='Markdown', reply_markup=markup)
        else:
            bot.send_message(message.chat.id, "📭 История поиска пуста")
    except Exception as e:
        print(f"Ошибка в show_history: {e}")


@bot.message_handler(commands=['popular'])
def show_popular_skins(message):
    try:
        markup = types.InlineKeyboardMarkup(row_width=1)
        for skin in popular_skins:
            markup.add(types.InlineKeyboardButton(skin, callback_data=f'skin_{skin}'))

        bot.send_message(message.chat.id, "⭐ **Популярные скины:**\nВыберите скин для просмотра цены:",
                         parse_mode='Markdown', reply_markup=markup)
    except Exception as e:
        print(f"Ошибка в show_popular_skins: {e}")


@bot.message_handler(commands=['compare'])
def compare_skins(message):
    try:
        bot.send_message(message.chat.id,
                         "💰 **Сравнение скинов**\n\nВведите два скина для сравнения через запятую:\n"
                         "Пример: `AK-47 | Redline (Field-Tested), AWP | Dragon Lore (Minimal Wear)`",
                         parse_mode='Markdown')
        bot.register_next_step_handler(message, process_compare)
    except Exception as e:
        print(f"Ошибка в compare_skins: {e}")


@bot.message_handler(commands=['track'])
def track_skin(message):
    try:
        bot.send_message(message.chat.id,
                         "🔔 **Отслеживание цены**\n\nВведите название скина для отслеживания:\n"
                         "(Я буду уведомлять вас о изменении цены)",
                         parse_mode='Markdown')
        bot.register_next_step_handler(message, add_to_tracking)
    except Exception as e:
        print(f"Ошибка в track_skin: {e}")


@bot.message_handler(commands=['stats'])
def show_stats(message):
    try:
        bot.send_message(message.chat.id,
                         "📊 **Статистика цен**\n\nВведите название скина для просмотра статистики:",
                         parse_mode='Markdown')
        bot.register_next_step_handler(message, get_skin_stats)
    except Exception as e:
        print(f"Ошибка в show_stats: {e}")


@bot.message_handler(commands=["skin_add"])
def show_inline_keyboard(message):
    try:
        markup = types.InlineKeyboardMarkup(row_width=2)
        btn1 = types.InlineKeyboardButton("✅ Добавить скин", callback_data='skin_add')
        btn2 = types.InlineKeyboardButton("❌ Отмена", callback_data='cancel')
        markup.add(btn1, btn2)
        question_text = "🔍 Хотите добавить скин для проверки цены?"
        bot.send_message(message.chat.id, question_text, reply_markup=markup)
    except Exception as e:
        print(f"Ошибка в show_inline_keyboard: {e}")


@bot.callback_query_handler(func=lambda call: True)
def handle_inline_button(call):
    try:
        if call.data == "skin_add":
            bot.answer_callback_query(call.id, "Введите название скина!")

            bot.edit_message_text(
                chat_id=call.message.chat.id,
                message_id=call.message.message_id,
                text="✅ Подтверждено!",
                reply_markup=None
            )

            msg = bot.send_message(
                call.message.chat.id,
                "📝 **Введите название скина**\n\nПример: `AK-47 | Redline (Field-Tested)`\n\n"
                "💡 Совет: Используйте точное название скина из Steam Market",
                parse_mode='Markdown'
            )

            bot.register_next_step_handler(msg, get_skin_price)

        elif call.data == "cancel":
            bot.answer_callback_query(call.id, "Действие отменено")
            bot.edit_message_text(
                chat_id=call.message.chat.id,
                message_id=call.message.message_id,
                text="❌ Действие отменено",
                reply_markup=None
            )

        elif call.data.startswith('curr_'):
            currency_name = call.data[5:]
            user_id = call.from_user.id
            user_settings[user_id]['currency'] = currencies[currency_name]
            user_settings[user_id]['currency_name'] = currency_name

            bot.answer_callback_query(call.id, f"Валюта изменена на {currency_name}")
            bot.edit_message_text(
                chat_id=call.message.chat.id,
                message_id=call.message.message_id,
                text=f"✅ Валюта успешно изменена на {currency_name}",
                reply_markup=None
            )

        elif call.data.startswith('skin_'):
            skin_name = call.data[5:]
            bot.answer_callback_query(call.id, f"Поиск: {skin_name}")

            # Создаем искусственное сообщение для get_skin_price
            class FakeMessage:
                def __init__(self, text, chat_id, from_user):
                    self.text = text
                    self.chat = type('obj', (), {'id': chat_id})
                    self.from_user = from_user
                    self.content_type = 'text'

            fake_msg = FakeMessage(skin_name, call.message.chat.id, call.from_user)
            get_skin_price(fake_msg)

        elif call.data == 'clear_history':
            user_id = call.from_user.id
            if user_id in user_history:
                user_history[user_id] = []
            bot.answer_callback_query(call.id, "История очищена")
            bot.edit_message_text(
                chat_id=call.message.chat.id,
                message_id=call.message.message_id,
                text="🗑 История поиска очищена",
                reply_markup=None
            )
    except Exception as e:
        print(f"Ошибка в handle_inline_button: {e}")
        try:
            bot.answer_callback_query(call.id, "Произошла ошибка")
        except:
            pass


def process_compare(message):
    try:
        # Проверяем, есть ли текст в сообщении
        if not message.text:
            bot.send_message(message.chat.id, "❌ Пожалуйста, отправьте текстовое сообщение с названиями скинов.")
            return

        skins = message.text.split(',')
        if len(skins) != 2:
            bot.send_message(message.chat.id,
                             "❌ Пожалуйста, введите два скина через запятую\n"
                             "Пример: AK-47 | Redline, AWP | Dragon Lore")
            return

        skin1, skin2 = skins[0].strip(), skins[1].strip()

        bot.send_message(message.chat.id, f"🔍 Сравниваю:\n1. {skin1}\n2. {skin2}\n\n⏳ Пожалуйста, подождите...")

        # Получаем цены для обоих скинов
        price1 = get_skin_price_data(skin1)
        price2 = get_skin_price_data(skin2)

        if price1 and price2:
            comparison = "📊 **Результат сравнения:**\n\n"
            comparison += f"1️⃣ **{skin1}**\n"
            comparison += f"   💰 Низшая цена: {price1['lowest']}\n"
            comparison += f"   📊 Медианная: {price1['median']}\n"
            comparison += f"   📈 Продаж: {price1['volume']}\n\n"
            comparison += f"2️⃣ **{skin2}**\n"
            comparison += f"   💰 Низшая цена: {price2['lowest']}\n"
            comparison += f"   📊 Медианная: {price2['median']}\n"
            comparison += f"   📈 Продаж: {price2['volume']}\n"

            bot.send_message(message.chat.id, comparison, parse_mode='Markdown')
        else:
            bot.send_message(message.chat.id, "❌ Не удалось получить цены для одного из скинов")

    except Exception as e:
        print(f"Ошибка в process_compare: {e}")
        bot.send_message(message.chat.id, f"❌ Произошла ошибка: {str(e)}")


def add_to_tracking(message):
    try:
        # Проверяем, есть ли текст в сообщении
        if not message.text:
            bot.send_message(message.chat.id, "❌ Пожалуйста, отправьте текстовое сообщение с названием скина.")
            return

        skin_name = message.text.strip()
        user_id = message.from_user.id

        tracked_skins[user_id].append({
            'name': skin_name,
            'price': None,
            'added_time': time.time()
        })

        bot.send_message(message.chat.id,
                         f"✅ Скин **'{skin_name}'** добавлен в отслеживание!\n"
                         f"Я буду уведомлять вас об изменении цены.",
                         parse_mode='Markdown')
    except Exception as e:
        print(f"Ошибка в add_to_tracking: {e}")
        bot.send_message(message.chat.id, f"❌ Произошла ошибка: {str(e)}")


def get_skin_stats(message):
    try:
        # Проверяем, есть ли текст в сообщении
        if not message.text:
            bot.send_message(message.chat.id, "❌ Пожалуйста, отправьте текстовое сообщение с названием скина.")
            return

        skin_name = message.text.strip()
        bot.send_message(message.chat.id,
                         f"📊 Статистика для скина **{skin_name}**\n\n"
                         f"Функция в разработке. Скоро здесь будет:\n"
                         f"• График изменения цены\n"
                         f"• История продаж\n"
                         f"• Прогноз цены",
                         parse_mode='Markdown')
    except Exception as e:
        print(f"Ошибка в get_skin_stats: {e}")


def get_skin_price_data(skin_name):
    """Вспомогательная функция для получения данных о цене"""
    try:
        params = {
            'appid': 730,
            'currency': 5,  # По умолчанию RUB
            'market_hash_name': skin_name
        }

        response = requests.get('https://steamcommunity.com/market/priceoverview/', params=params, timeout=10)
        data = response.json()

        if data.get('success'):
            return {
                'lowest': data.get('lowest_price', 'N/A'),
                'median': data.get('median_price', 'N/A'),
                'volume': data.get('volume', 'N/A')
            }
        return None
    except Exception as e:
        print(f"Ошибка в get_skin_price_data: {e}")
        return None


def get_skin_price(message):
    """Получает цену скина и отправляет в Telegram"""
    try:
        # Проверяем, есть ли текст в сообщении
        if not message.text:
            bot.send_message(message.chat.id, "❌ Пожалуйста, отправьте текстовое сообщение с названием скина.")
            return

        skin_name = message.text.strip()

        # Проверяем, что название не пустое
        if not skin_name:
            bot.send_message(message.chat.id, "❌ Название скина не может быть пустым. Попробуйте снова.")
            return

        user_id = message.from_user.id

        # Получаем валюту пользователя или используем по умолчанию
        currency = user_settings.get(user_id, {}).get('currency', 5)
        currency_name = user_settings.get(user_id, {}).get('currency_name', '🇷🇺 RUB')

        # Добавляем в историю
        user_history[user_id].append(skin_name)
        # Оставляем только последние 10 запросов
        if len(user_history[user_id]) > 10:
            user_history[user_id] = user_history[user_id][-10:]

        # Отправляем сообщение о начале поиска
        waiting_msg = bot.send_message(message.chat.id, f"🔍 Ищу информацию для скина: **{skin_name}**...",
                                       parse_mode='Markdown')

        try:
            # Кодируем название для URL
            encoded_skin_name = urllib.parse.quote(skin_name)

            params = {
                'appid': 730,
                'currency': currency,
                'market_hash_name': skin_name
            }

            response = requests.get('https://steamcommunity.com/market/priceoverview/', params=params, timeout=10)
            data = response.json()

            if data.get('success'):
                lowest_price = data.get('lowest_price', 'N/A')
                median_price = data.get('median_price', 'N/A')
                volume = data.get('volume', 'N/A')

                # Создаем ссылку на магазин
                market_url = f"https://steamcommunity.com/market/listings/730/{encoded_skin_name}"

                # Формируем сообщение с ценой
                price_info = f"✅ **Информация о скине:**\n"
                price_info += f"`{skin_name}`\n\n"
                price_info += f"💵 **Валюта:** {currency_name}\n"
                price_info += f"💰 **Самая низкая цена:** {lowest_price}\n"
                price_info += f"📊 **Медианная цена:** {median_price}\n"
                price_info += f"📈 **Продано за 24 часа:** {volume}\n\n"
                price_info += f"🔗 [Открыть в Steam Market]({market_url})"

                # Удаляем сообщение ожидания
                try:
                    bot.delete_message(message.chat.id, waiting_msg.message_id)
                except:
                    pass  # Игнорируем ошибку удаления

                # Отправляем информацию в Telegram
                bot.send_message(message.chat.id, price_info, parse_mode='Markdown', disable_web_page_preview=True)

                # Проверяем отслеживаемые скины
                check_tracked_skins(user_id, skin_name, lowest_price)

            else:
                try:
                    bot.delete_message(message.chat.id, waiting_msg.message_id)
                except:
                    pass

                bot.send_message(
                    message.chat.id,
                    f"❌ **Не удалось найти скин**\n\n"
                    f"`{skin_name}`\n\n"
                    f"Проверьте правильность названия и попробуйте снова.\n"
                    f"💡 Пример: AK-47 | Redline (Field-Tested)",
                    parse_mode='Markdown'
                )

        except requests.exceptions.Timeout:
            try:
                bot.delete_message(message.chat.id, waiting_msg.message_id)
            except:
                pass
            bot.send_message(
                message.chat.id,
                "⏰ **Таймаут запроса**\n\n"
                "Сервер Steam отвечает слишком долго. Попробуйте позже.",
                parse_mode='Markdown'
            )
        except Exception as e:
            try:
                bot.delete_message(message.chat.id, waiting_msg.message_id)
            except:
                pass
            bot.send_message(
                message.chat.id,
                f"❌ **Произошла ошибка**\n\n{str(e)}\n\nПопробуйте позже.",
                parse_mode='Markdown'
            )

    except Exception as e:
        print(f"Ошибка в get_skin_price: {e}")
        try:
            bot.send_message(message.chat.id, "❌ Произошла непредвиденная ошибка. Попробуйте снова.")
        except:
            pass


def check_tracked_skins(user_id, skin_name, current_price):
    """Проверяет отслеживаемые скины и отправляет уведомления"""
    try:
        if user_id in tracked_skins:
            for tracked in tracked_skins[user_id]:
                if tracked['name'].lower() == skin_name.lower():
                    if tracked['price'] and tracked['price'] != current_price:
                        bot.send_message(
                            user_id,
                            f"🔔 **Изменение цены!**\n\n"
                            f"Скин: `{skin_name}`\n"
                            f"Старая цена: {tracked['price']}\n"
                            f"Новая цена: {current_price}",
                            parse_mode='Markdown'
                        )
                    tracked['price'] = current_price
    except Exception as e:
        print(f"Ошибка в check_tracked_skins: {e}")


@bot.message_handler(func=lambda message: True,
                     content_types=['text', 'sticker', 'photo', 'voice', 'video', 'document'])
def handle_text(message):
    try:
        # Проверяем тип контента
        if message.content_type != 'text':
            bot.send_message(
                message.chat.id,
                "Я понимаю только текстовые сообщения. Пожалуйста, отправьте текст с названием скина или используйте /menu"
            )
            return

        user_text = message.text.lower()

        if user_text == "🔍 поиск скина":
            show_inline_keyboard(message)
        elif user_text == "📋 история":
            show_history(message)
        elif user_text == "⭐ популярные":
            show_popular_skins(message)
        elif user_text == "💰 сравнить":
            compare_skins(message)
        elif user_text == "🔔 отслеживать":
            track_skin(message)
        elif user_text == "📊 статистика":
            show_stats(message)
        elif user_text == "💱 валюта":
            choose_currency(message)
        elif user_text == "❓ помощь":
            send_help(message)
        elif "привет" in user_text or "здравствуй" in user_text:
            response = f"И тебе привет! 😊\nЧем могу помочь? Используй /menu для открытия меню."
            bot.send_message(message.chat.id, response)
        else:
            # Для любого другого текста предлагаем использовать команду
            markup = types.InlineKeyboardMarkup()
            markup.add(types.InlineKeyboardButton("🔍 Поиск скина", callback_data='skin_add'))
            bot.send_message(
                message.chat.id,
                "Я не совсем понял ваш запрос. Используйте /menu для открытия меню или нажмите кнопку ниже для поиска скина:",
                reply_markup=markup
            )
    except Exception as e:
        print(f"Ошибка в handle_text: {e}")

def get_inventory_items(steam_id, context_id=2):
    """
    Retrieves a list of items from a Steam inventory using SteamID64.
    """
    url = f'http://steamcommunity.com/inventory/{steam_id}/{app_id}/{context_id}'
    try:
        response = requests.get(url).json()
        if 'descriptions' in response:
            return response['assets'], response['descriptions']
        else:
            print(f"Error retrieving items: {response.get('message', 'Unknown error')}")
            return None
    except requests.RequestException as e:
        print(f"HTTP request error: {e}")
        return None

def main(message):
    steam_id = input("Enter the Steam profile SteamID64: ")
    assets, descriptions = get_inventory_items(steam_id)

    if assets:
        bot.send_message(message.chat.id,"Inventory Items:")
        bot.send_message(message.chat.id,'---')
        for asset in assets:
            classid = asset['classid']
            for description in descriptions:
                if description['classid'] == classid:
                    bot.send_message(message.chat.id,f"Name: {description['name']}")
                    bot.send_message(message.chat.id,f"Type: {description['type']}")
                    bot.send_message(message.chat.id,f"Marketable: {'Yes' if description['marketable'] else 'No'}")
                    bot.send_message(message.chat.id,'---')
    else:
        bot.send_message(message.chat.id,"Failed to retrieve inventory items.")


# Запуск бота с обработкой ошибок
if __name__ == "__main__":
    print("🤖 Бот запущен и готов к работе!")
    print("📋 Доступные команды: /start, /help, /menu")

    while True:
        try:
            bot.infinity_polling(timeout=60, long_polling_timeout=60)
        except Exception as e:
            print(f"❌ Ошибка подключения: {e}")
            print("🔄 Перезапуск через 5 секунд...")
            time.sleep(5)