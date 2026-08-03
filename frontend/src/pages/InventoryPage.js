import React, { useMemo, useState } from "react";
import "./InventoryPage.css";
import inventoryData from "../data/inventoryData";

const markets = ["Steam", "Skinport", "CSFloat", "Buff.163"];

// Цвета полной шкалы редкости CS2.
const rarityColors = {
  "Base Grade": "#b0c3d9",
  "Consumer Grade": "#b0c3d9",
  "Industrial Grade": "#5e98d9",
  "Mil-Spec Grade": "#4b69ff",
  Restricted: "#8847ff",
  Classified: "#d32ce6",
  Covert: "#eb4b4b",
  Contraband: "#e4ae39",
  "High Grade": "#4b69ff",
  Remarkable: "#8847ff",
  Exotic: "#d32ce6",
  Extraordinary: "#eb4b4b"
};

const rarityOptions = ["All rarities", ...Object.keys(rarityColors)];

export default function InventoryPage({ steamId }) {
  const currentSteamId = steamId || inventoryData.steam_id;
  const [market, setMarket] = useState("Steam");
  const [layout, setLayout] = useState("grid");
  const [query, setQuery] = useState("");
  const [rarity, setRarity] = useState("All rarities");
  const [tradeable, setTradeable] = useState(false);
  const [sort, setSort] = useState("price-desc");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const items = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return inventoryData.items
      .filter((item) => {
        const price = item.prices[market];
        const matchesName = item.name.toLowerCase().includes(normalizedQuery);
        const matchesRarity = rarity === "All rarities" || item.rarity === rarity;
        const matchesTradeable = !tradeable || item.marketable;
        const matchesMinPrice = !min || price >= Number(min);
        const matchesMaxPrice = !max || price <= Number(max);

        return matchesName && matchesRarity && matchesTradeable && matchesMinPrice && matchesMaxPrice;
      })
      .sort((first, second) => {
        if (sort === "name") return first.name.localeCompare(second.name);
        const priceDifference = first.prices[market] - second.prices[market];
        return sort === "price-asc" ? priceDifference : -priceDifference;
      });
  }, [market, query, rarity, tradeable, min, max, sort]);

  const total = inventoryData.items.reduce(
    (sum, item) => sum + item.prices[market],
    0
  );

  const reset = () => {
    setQuery("");
    setRarity("All rarities");
    setTradeable(false);
    setMin("");
    setMax("");
  };

  return (
    <section className="inventory-page">
      <div className="inventory-heading">
        <div>
          <p className="section-label">YOUR CS2 COLLECTION</p>
          <h1>Inventory</h1>
          <p className="subtitle">Track skins and compare their value across markets.</p>
        </div>
        <div className="profile-actions">
          <a className="profile-link" href={`https://steamcommunity.com/profiles/${currentSteamId}`} target="_blank" rel="noreferrer">
            Open Steam profile
          </a>
          <a className="profile-link inventory-link" href={`https://steamcommunity.com/profiles/${currentSteamId}/inventory/#730`} target="_blank" rel="noreferrer">
            Open CS2 inventory
          </a>
        </div>
      </div>

      <div className="inventory-summary">
        <div className="steam-account">
          <div className="steam-avatar">S</div>
          <div>
            <small>CONNECTED ACCOUNT</small>
            <strong>Steam ID: {currentSteamId}</strong>
            <span>CS2 - {inventoryData.total_items} items synced</span>
          </div>
        </div>
        <div className="value-stat">
          <span>ESTIMATED VALUE</span>
          <strong>${total.toFixed(2)}</strong>
          <small>Based on {market} prices</small>
        </div>
        <button className="refresh-button" type="button">Refresh inventory</button>
      </div>

      <div className="inventory-toolbar">
        <label className="search-field">
          <span>Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skins..." />
        </label>
        <select value={market} onChange={(event) => setMarket(event.target.value)} aria-label="Pricing market">
          {markets.map((name) => <option key={name}>{name}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort inventory">
          <option value="price-desc">Price: high to low</option>
          <option value="price-asc">Price: low to high</option>
          <option value="name">Name: A-Z</option>
        </select>
        <div className="view-switch">
          <button className={layout === "grid" ? "selected" : ""} onClick={() => setLayout("grid")} aria-label="Card view">Grid</button>
          <button className={layout === "list" ? "selected" : ""} onClick={() => setLayout("list")} aria-label="List view">List</button>
        </div>
      </div>

      <div className="inventory-body">
        <aside className="filters">
          <div className="filter-heading"><b>Filters</b><button onClick={reset}>Reset</button></div>
          <label>
            RARITY
            <select value={rarity} onChange={(event) => setRarity(event.target.value)}>
              {rarityOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            PRICE, USD
            <div className="range">
              <input value={min} onChange={(event) => setMin(event.target.value)} placeholder="Min" type="number" />
              <i>-</i>
              <input value={max} onChange={(event) => setMax(event.target.value)} placeholder="Max" type="number" />
            </div>
          </label>
          <label className="check">
            <input type="checkbox" checked={tradeable} onChange={(event) => setTradeable(event.target.checked)} />
            Tradable only
          </label>
          <div className="filter-note"><b>Comparison market</b><p>Prices and sorting use <strong>{market}</strong>.</p></div>
        </aside>

        <main className={`skins ${layout}`}>
          <div className="items-found"><b>{items.length} {items.length === 1 ? "item" : "items"}</b><span>Prices from {market}</span></div>
          <div className="skin-list">
            {items.map((item) => (
              <article className="skin-card" key={item.asset_id}>
                <div className="skin-art"><span className="rarity-line" style={{ background: rarityColors[item.rarity] }} /></div>
                <div className="skin-info">
                  <div><p className="weapon-type">{item.type}</p><h2>{item.name}</h2><p className="wear">{item.wear} - Float {item.float}</p></div>
                  <div className="skin-price"><small>{market.toUpperCase()}</small><strong>${item.prices[market].toFixed(2)}</strong><span className={item.change >= 0 ? "positive" : "negative"}>{item.change >= 0 ? "+" : ""}{item.change}%</span></div>
                </div>
                <span className="status">{item.marketable ? "Tradable" : "Trade locked"}</span>
              </article>
            ))}
          </div>
          {!items.length && <div className="empty">No skins found. Try adjusting your filters.</div>}
        </main>
      </div>
    </section>
  );
}
