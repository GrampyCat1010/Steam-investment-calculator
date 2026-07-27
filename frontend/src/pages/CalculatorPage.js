import React, { useState } from "react";
import "./CalculatorPage.css";

export default function CalculatorPage() {
    const [name, setName] = useState("AK-47 | Redline (Field-Tested)");
    const [purchasePrice, setPurchasePrice] = useState("100");
    const [purchaseDate, setPurchaseDate] = useState("2026-07-21"); // Changed to ISO format for date input
    const [comment, setComment] = useState("Я хочу баунти и твикс");

    const handleSubmit = async (type) => {
        const formData = {
            name,
            purchasePrice,
            purchaseDate,
            operationType: type,
            comment,
        };
        
		try {
			const response = await fetch(
				"http://127.0.0.1:5000/api/save_deal",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				}
			);
			const data = await response.json();
			console.log(data);
			alert(data.message);

		} catch (error) {
			console.error(error);
			alert("Connection error");
		}
    };
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
