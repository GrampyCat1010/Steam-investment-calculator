import { useState } from "react";
import WelcomePage from "./pages/WelcomePage";

function App() {
    const [steamId, setSteamId] = useState("");
    const [isStarted, setIsStarted] = useState(false); // исправил опечатку isStartd -> isStarted

    const handleSaveSteamId = (value) => {
        setSteamId(value);
        setIsStarted(true);
    };

    // Если isStarted = false, показываем приветствие с полем ввода
    if (!isStarted) {
        return <WelcomePage onSaveSteamId={handleSaveSteamId} />;
    }

    // Если isStarted = true, показываем основное приложение
    return (
        <div>
            <h1>Тут будет наше приложение</h1>
            <p>Steam ID: {steamId}</p>
        </div>
    );
}

export default App;