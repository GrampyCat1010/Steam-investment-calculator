import React from "react";
import "./InventoryPage.css";
import inventoryData from "../data/inventoryData";
import ItemCard from "../components/ItemCard";


export default function InventoryPage() {
	
	const inventory = inventoryData; // Потом заменим на await fetch(...) как будет готов бэк
	
    return (
	// тут у тебя уже был какой-то свой настроенный css, приведи все к единому и допиши дальше отображение списка
        <main className="inventory-placeholder">

            <h1>Inventory</h1>

            <p>SteamID: {inventory.steam_id}</p>

            <p>Total items: {inventory.total_items}</p>
			
			<div className="inventory-list">

				{inventory.items.map(item => (

					<ItemCard
						key={item.asset_id}
						item={item}
					/>

				))}

			</div>

        </main>
    );
}