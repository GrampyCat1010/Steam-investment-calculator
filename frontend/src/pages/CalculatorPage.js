import React, { useState } from "react";
import "./CalculatorPage.css";

export default function CalculatorPage() {
    const [name, setName] = useState("AK-47 | Redline (Field-Tested)");
    const [purchasePrice, setPurchasePrice] = useState("100");
    const [purchaseDate, setPurchaseDate] = useState("2026-07-21"); // Changed to ISO format for date input
    const [operationType, setOperationType] = useState("Purchase");
    const [comment, setComment] = useState("Я хочу баунти и твикс");

    const handleSubmit = (type) => {
        const formData = {
            name,
            purchasePrice,
            purchaseDate,
            operationType: type, // Use the passed type instead of state
            comment,
        };
        console.log(formData);
        // Add your API call or other logic here
    };

    return (
        <main className="calculator-page">
            <h1>Add a deal</h1>

            <form onSubmit={(e) => e.preventDefault()}>
                <label>
                    Item name
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </label>

                <label>
                    Purchase Price, Rubles
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={purchasePrice}
                        onChange={(event) => setPurchasePrice(event.target.value)}
                    />
                </label>

                <label>
                    Purchase date
                    <input
                        type="date"
                        value={purchaseDate}
                        onChange={(event) => setPurchaseDate(event.target.value)}
                    />
                </label>

                <label>
                    Comment
                    <input
                        type="text"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                    />
                </label>

                <div className="button-group">
                    <button type="button" onClick={() => handleSubmit("buy")}>
                        Buy
                    </button>
                    <button type="button" onClick={() => handleSubmit("sell")}>
                        Sell
                    </button>
                </div>
            </form>
        </main>
    );
}
