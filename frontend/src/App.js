// App.js
import { useState } from "react";
import { Routes, Route } from "react-router-dom"; // Routes/Route нужны, чтобы разные URL показывали разные страницы
import WelcomePage from "./pages/WelcomePage";
import Header from "./components/Header";
import DashboardPage from "./pages/DashboardPage"; // страница, которую мы показываем на "/"
import AboutUsPage from "./pages/AboutUsPage";
import MarketPage from "./pages/MarketPage";
import InventoryPage from "./pages/InventoryPage";
import CalculatorPage from "./pages/CalculatorPage";

function App() {
    // steamId — значение, которое пользователь ввёл на приветственном экране
    const [steamId, setSteamId] = useState("");

    // isStarted — флаг "прошёл ли пользователь приветственный экран".
    // False = показываем WelcomePage, true = показываем основное приложение с шапкой и страницами
    const [isStarted, setIsStarted] = useState(false);

    // Вызывается из WelcomePage, когда пользователь ввёл steamId и нажал "Save"
    const handleSaveSteamId = (value) => {
        console.log("Получено значение:", value);
        setSteamId(value);      // сохраняем steamId, он пригодится в Header (показать "Steam ID: ...")
        setIsStarted(true);     // переключаемся с приветствия на основное приложение
    };

    // Если isStarted = false, показываем приветствие с полем ввода
    // (это ранний return — весь код ниже не выполняется, пока пользователь не введёт steamId)
    if (!isStarted) {
        return <WelcomePage onSaveSteamId={handleSaveSteamId} />;
    }

    // Если isStarted = true, показываем основное приложение с роутингом
    return (
        <div className="container">
            {/* Шапка видна на всех страницах, поэтому она вне <Routes> */}
            <Header steamId={steamId} />

            <main className="main-content">
                {/* Routes решает, какой компонент показать в зависимости от текущего URL.
                    Внутри main-content меняется только содержимое, шапка (Header) остаётся неизменной. */}
                <Routes>
                    {/* path="/" — главная страница (дашборд с графиком и статами) */}
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/market" element={<MarketPage />} />
                    <Route path="/about-us" element={<AboutUsPage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/calculator" element={<CalculatorPage />} />
                    {/* TODO: сюда позже добавить остальные страницы, на которые уже есть ссылки в Header:
                        УКРАЛИ!!!
                        Пока этих компонентов не существует, переход по этим ссылкам ничего не покажет. */}
                </Routes>
            </main>
        </div>
    );
}

export default App;
