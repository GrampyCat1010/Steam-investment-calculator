import React from "react";
import "./InventoryPage.css";

// Временная страница
export default function InventoryPage() {
    return (
        <main className="inventory-placeholder">
            <section className="inventory-placeholder-card">
                <span className="inventory-placeholder-icon" aria-hidden="true">▣</span>
                <span className="inventory-placeholder-eyebrow">Inventory</span>
                <h1>Your inventory is <span>coming soon.</span></h1>
                <p>
                    Item loading will appear here after the Steam inventory integration is ready.
                </p>
            </section>
        </main>
    );
}
