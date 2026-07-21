import React, { useMemo, useState } from "react";
import "./CalculatorPage.css";

const DEFAULT_PURCHASE = {
    name: "AK-47 | Redline (Field-Tested)",
    purchasePrice: "18.45",
    purchaseDate: "2026-07-21",
};

// ДАННЫЕ-ЗАГЛУШКИ ДЛЯ ФРОНТЕНДА:
// после подключения бэкенда DEFAULT_PURCHASE и INVENTORY_ITEMS не должны быть
// источником данных: вместо них страница будет получать значения по API.

// ТОЧКА ПОДКЛЮЧЕНИЯ ИНВЕНТАРЯ:
// после появления API этот временный массив нужно заменить данными, полученными
// из Steam-инвентаря. Для списка используются id, name, game и rarity каждого предмета.
const INVENTORY_ITEMS = [
    {
        id: "ak-redline-ft",
        name: "AK-47 | Redline (Field-Tested)",
        game: "Counter-Strike 2",
        rarity: "Classified",
        color: "#d32ce6",
        purchasePrice: "18.45",
        purchaseDate: "2026-06-14",
        currentPrice: "21.32",
    },
    {
        id: "awp-neo-noir-ft",
        name: "AWP | Neo-Noir (Field-Tested)",
        game: "Counter-Strike 2",
        rarity: "Covert",
        color: "#eb4b4b",
        purchasePrice: "34.90",
        purchaseDate: "2026-05-03",
        currentPrice: "29.75",
    },
    {
        id: "m4a1s-decypher-mw",
        name: "M4A1-S | Decypher (Minimal Wear)",
        game: "Counter-Strike 2",
        rarity: "Classified",
        color: "#d32ce6",
        purchasePrice: "12.60",
        purchaseDate: "2026-07-02",
        currentPrice: "15.18",
    },
    {
        id: "recoil-case",
        name: "Recoil Case",
        game: "Counter-Strike 2",
        rarity: "Base Grade",
        color: "#8a93a6",
        purchasePrice: "0.31",
        purchaseDate: "2026-07-18",
        currentPrice: "0.27",
    },
];

// СПИСОК РЫНКОВ ДЛЯ ВЫБОРА ИСТОЧНИКА ЦЕНЫ.
// В дальнейшем каждый ключ будет передаваться бэкенду, который сам запросит
// соответствующую площадку и вернёт единую цену в формате приложения.
const MARKET_SOURCES = [
    { id: "steam", name: "Steam Community Market" },
    { id: "csfloat", name: "CSFloat" },
    { id: "dmarket", name: "DMarket" },
    { id: "market-csgo", name: "Market.CSGO" },
    { id: "lis-skins", name: "Lis-Skins" },
];

// Форматирование вынесено отдельно, чтобы все денежные значения на странице
// выглядели одинаково и позже функцию было легко заменить под реальные валюты API.
const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

export default function CalculatorPage() {
    // ТОЧКА ПОДКЛЮЧЕНИЯ НАЧАЛЬНЫХ ДАННЫХ:
    // при открытии страницы запросить инвентарь пользователя и сохранённые покупки.
    // Ответ API должен заполнить inventory, purchase, currentPrice и selectedItemId.
    // ТОЧКА ПОДКЛЮЧЕНИЯ СОХРАНЁННОЙ ПОКУПКИ:
    // здесь useState нужно заменить загрузкой закреплённой записи для выбранного item id.
    const [purchase, setPurchase] = useState(DEFAULT_PURCHASE);
    const [currentPrice, setCurrentPrice] = useState("21.32");
    const [isSaved, setIsSaved] = useState(true);
    // Статус сохранения пока локальный. После API он должен меняться по результату
    // POST/PUT-запроса и также учитывать ошибку ответа сервера.
    const [lastChecked, setLastChecked] = useState("Just now");
    const [isItemMenuOpen, setIsItemMenuOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState("ak-redline-ft");
    const [selectedMarketId, setSelectedMarketId] = useState("steam");

    // Разница и процент пересчитываются при изменении цены покупки или цены рынка.
    const calculation = useMemo(() => {
        const paid = Number(purchase.purchasePrice) || 0;
        const current = Number(currentPrice) || 0;
        const difference = current - paid;
        const percent = paid > 0 ? (difference / paid) * 100 : 0;

        return { difference, percent };
    }, [purchase.purchasePrice, currentPrice]);

    const isProfit = calculation.difference >= 0;

    const updatePurchase = (field, value) => {
        setPurchase((previous) => ({ ...previous, [field]: value }));
        setIsSaved(false);
    };

    const handleItemSelect = (item) => {
        // ТОЧКА ПОДКЛЮЧЕНИЯ ВЫБОРА ПРЕДМЕТА:
        // после выбора item.id запросить сохранённую покупку и последнюю цену предмета.
        updatePurchase("name", item.name);
        setSelectedItemId(item.id);
        setIsItemMenuOpen(false);
    };

    const handleItemNameChange = (value) => {
        // Если текст не совпадает с предметом из инвентаря, selectedItemId становится null.
        // В этом случае кнопки автоподстановки не должны обращаться к API.
        const matchingItem = INVENTORY_ITEMS.find((item) => item.name === value);

        updatePurchase("name", value);
        setSelectedItemId(matchingItem ? matchingItem.id : null);
    };

    // В будущем поиск будет выполняться по Steam item id из ответа бэкенда.
    const selectedItem = INVENTORY_ITEMS.find((item) => item.id === selectedItemId);

    const handlePurchasePriceLoad = () => {
        // ТОЧКА ПОДКЛЮЧЕНИЯ API ПОКУПКИ:
        // запросить цену покупки выбранного item id и подставить её в purchasePrice.
        if (selectedItem) {
            updatePurchase("purchasePrice", selectedItem.purchasePrice);
        }
    };

    const handleInventoryDateLoad = () => {
        // ТОЧКА ПОДКЛЮЧЕНИЯ API ИНВЕНТАРЯ:
        // запросить дату добавления выбранного item id и подставить её в purchaseDate.
        if (selectedItem) {
            updatePurchase("purchaseDate", selectedItem.purchaseDate);
        }
    };

    const handleSave = (event) => {
        event.preventDefault();
        // ТОЧКА ПОДКЛЮЧЕНИЯ СОХРАНЕНИЯ:
        // сюда добавить POST/PUT с item id, purchasePrice и purchaseDate.
        setIsSaved(true);
    };

    const handlePriceCheck = () => {
        // ТОЧКА ПОДКЛЮЧЕНИЯ ТЕКУЩЕЙ ЦЕНЫ:
        // прямые запросы к API маркетов из браузера обычно не подходят: они могут
        // требовать секретный ключ и блокироваться политикой CORS. Нужен бэкенд-прокси:
        // GET /api/market-price?itemId=<Steam item id>&market=<selectedMarketId>.
        // Бэкенд обращается к API выбранного рынка, приводит цену к общей валюте и
        // возвращает { price, checkedAt }. Здесь результат передать в setCurrentPrice
        // и setLastChecked. До подключения API используем цену из тестового предмета.
        if (selectedItem) {
            setCurrentPrice(selectedItem.currentPrice);
        }
        setLastChecked("Just now");
    };

    return (
        <main className="calculator-page">
            <section className="calculator-hero">
                <div>
                    <span className="calculator-eyebrow">Investment tracker</span>
                    <h1>Know your <span>real return.</span></h1>
                    <p>
                        Save the price and date of an item right after purchase, then
                        compare it with the current lowest market price.
                    </p>
                </div>
                <div
                    className={`calculator-result ${isProfit ? "positive" : "negative"}`}
                >
                    <span className="calculator-result-label">Current result</span>
                    <strong>
                        {isProfit ? "+" : "-"}
                        {formatMoney(Math.abs(calculation.difference))}
                    </strong>
                    <span>
                        {isProfit ? "+" : ""}
                        {calculation.percent.toFixed(2)}% since purchase
                    </span>
                </div>
            </section>

            <section className="calculator-grid">
                <form className="calculator-card purchase-card" onSubmit={handleSave}>
                    <div className="card-heading">
                        <span className="card-icon" aria-hidden="true">*</span>
                        <div>
                            <h2>Purchase details</h2>
                            <p>Record the original deal once.</p>
                        </div>
                    </div>

                    <label>
                        Item from inventory
                        <div className="inventory-select">
                            <div className="inventory-select-input-row">
                                <input
                                    value={purchase.name}
                                    onChange={(event) => handleItemNameChange(event.target.value)}
                                    onFocus={() => setIsItemMenuOpen(true)}
                                    placeholder="Enter a skin name"
                                />
                                <button
                                    className="inventory-select-trigger"
                                    type="button"
                                    onClick={() => setIsItemMenuOpen((isOpen) => !isOpen)}
                                    aria-label="Open inventory items"
                                    aria-expanded={isItemMenuOpen}
                                    aria-haspopup="listbox"
                                >
                                    <span className="inventory-select-arrow" aria-hidden="true">
                                        {isItemMenuOpen ? "^" : "v"}
                                    </span>
                                </button>
                            </div>

                            {isItemMenuOpen && (
                                <div className="inventory-select-menu" role="listbox">
                                    {INVENTORY_ITEMS.map((item) => (
                                        <button
                                            className="inventory-select-option"
                                            type="button"
                                            role="option"
                                            aria-selected={purchase.name === item.name}
                                            key={item.id}
                                            onClick={() => handleItemSelect(item)}
                                        >
                                            <span
                                                className="inventory-item-rarity"
                                                style={{ backgroundColor: item.color }}
                                                aria-hidden="true"
                                            />
                                            <span className="inventory-item-text">
                                                <b>{item.name}</b>
                                                <small>{item.game} · {item.rarity}</small>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </label>

                    <div className="form-row">
                        <label>
                            Purchase price, $
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={purchase.purchasePrice}
                                onChange={(event) => updatePurchase("purchasePrice", event.target.value)}
                            />
                            <button
                                className="field-load-button"
                                type="button"
                                onClick={handlePurchasePriceLoad}
                                disabled={!selectedItem}
                            >
                                Get purchase price
                            </button>
                        </label>
                        <label>
                            Purchase date
                            <input
                                type="date"
                                value={purchase.purchaseDate}
                                onChange={(event) => updatePurchase("purchaseDate", event.target.value)}
                            />
                            <button
                                className="field-load-button"
                                type="button"
                                onClick={handleInventoryDateLoad}
                                disabled={!selectedItem}
                            >
                                Get inventory date
                            </button>
                        </label>
                    </div>

                    <button className="primary-button" type="submit">
                        {isSaved ? "Purchase saved" : "Save purchase details"}
                    </button>
                </form>

                <section
                    className="calculator-card market-check-card"
                    aria-labelledby="market-check-title"
                >
                    <div className="card-heading">
                        <span className="card-icon" aria-hidden="true">~</span>
                        <div>
                            <h2 id="market-check-title">Market check</h2>
                            <p>Use the lowest current listing for comparison.</p>
                        </div>
                    </div>

                    <label>
                        Current lowest price, $
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={currentPrice}
                            onChange={(event) => setCurrentPrice(event.target.value)}
                        />
                    </label>
                    <label className="market-source-label">
                        Market source
                        <select
                            value={selectedMarketId}
                            onChange={(event) => setSelectedMarketId(event.target.value)}
                        >
                            {MARKET_SOURCES.map((market) => (
                                <option value={market.id} key={market.id}>
                                    {market.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={handlePriceCheck}
                    >
                        Check current price
                    </button>
                    <span className="checked-time">Last checked: {lastChecked}</span>

                    <div className="comparison-row">
                        <div>
                            <span>Paid</span>
                            <strong>{formatMoney(purchase.purchasePrice)}</strong>
                        </div>
                        <div>
                            <span>Lowest now</span>
                            <strong>{formatMoney(currentPrice)}</strong>
                        </div>
                        <div className={isProfit ? "value-positive" : "value-negative"}>
                            <span>{isProfit ? "Profit" : "Loss"}</span>
                            <strong>
                                {isProfit ? "+" : "-"}
                                {formatMoney(Math.abs(calculation.difference))}
                            </strong>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}
