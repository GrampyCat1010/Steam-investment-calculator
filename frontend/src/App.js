// App.js
import { useState } from "react";
import WelcomePage from "./pages/WelcomePage";
import Header from "./components/Header";

function App() {
    const [steamId, setSteamId] = useState("");
    const [isStarted, setIsStarted] = useState(false);

    const handleSaveSteamId = (value) => {
        console.log("Получено значение:", value);
        setSteamId(value);
        setIsStarted(true);
    };


    // Если isStarted = false, показываем приветствие с полем ввода
    if (!isStarted) {
        return <WelcomePage onSaveSteamId={handleSaveSteamId} />;
    }

    // Если isStarted = true, показываем основное приложение
    return (
        <div className="container">
            <Header steamId={steamId} />

            <main className="main-content">
            </main>
        </div>

    );
}

export default App;