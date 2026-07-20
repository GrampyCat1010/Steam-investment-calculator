import React from "react";
import "./MarketPage.css";

// Данные площадок вынесены в массив: так новый маркет можно добавить одной строкой,
// не дублируя JSX-разметку карточки ниже.
const MARKETS = [
    {
        name: "Steam Community Market",
        description: "The official Steam marketplace",
        href: "https://steamcommunity.com/market/",
        domain: "steamcommunity.com",
        official: true,
    },
    {
        name: "Market.CSGO",
        description: "A popular CS2 P2P marketplace",
        href: "https://market.csgo.com/ru/",
        domain: "market.csgo.com",
    },
    {
        name: "Lis-Skins",
        description: "Instant skin selling and buying",
        href: "https://lis-skins.ru/",
        domain: "lis-skins.ru",
    },
    {
        name: "CSFloat",
        description: "P2P marketplace and float database",
        href: "https://csfloat.com/",
        domain: "csfloat.com",
    },
    {
        name: "DMarket",
        description: "A marketplace for gaming items",
        href: "https://dmarket.com/",
        domain: "dmarket.com",
    },
];

// Google favicon service берёт актуальную иконку напрямую с указанного домена.
// Это позволяет использовать реальные логотипы маркетов без хранения копий в проекте.
const getMarketIconUrl = (domain) => (
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
);

export default function MarketPage() {
    return (
        <main className="market-page">
            {/* Верхняя часть страницы повторяет композицию остальных страниц сайта. */}
            <section className="market-hero">
                <span className="market-eyebrow">Trading platforms</span>
                <h1>
                    Choose a <span>market</span>
                </h1>
                <p>
                    Explore popular platforms for buying and selling Steam items.
                </p>
            </section>

            {/* Вся карточка — ссылка. Внешние сайты открываются в новой вкладке. */}
            <section className="markets-grid" aria-label="Marketplace list">
                {MARKETS.map((market) => (
                    <a
                        className="market-card"
                        href={market.href}
                        key={market.name}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="market-logo">
                            <img
                                src={getMarketIconUrl(market.domain)}
                                alt={`${market.name} logo`}
                            />
                        </span>

                        <span className="market-card-content">
                            <span className="market-title-row">
                                <strong>{market.name}</strong>

                                {/* Галочка отображается только у официальной площадки Steam. */}
                                {market.official && (
                                    <span
                                        className="steam-official"
                                        title="Official Steam marketplace"
                                        aria-label="Official Steam marketplace"
                                    >
                                        <svg viewBox="0 0 20 20" aria-hidden="true">
                                            <path
                                                d="M10 1.5 12.2 3l2.7-.1.9 2.5 2.2 1.6-.9 2.5.9 2.5-2.2 1.6-.9 2.5-2.7-.1L10 18.5l-2.2-1.5-2.7.1-.9-2.5L2 13l.9-2.5L2 8l2.2-1.6.9-2.5 2.7.1L10 1.5Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="m6.3 10 2.25 2.2 5.15-5"
                                                fill="none"
                                                stroke="#fff"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                )}
                            </span>

                            <span className="market-description">
                                {market.description}
                            </span>
                        </span>

                        <span className="market-open" aria-hidden="true">↗</span>
                    </a>
                ))}
            </section>

            <p className="market-note">
                Always verify the website address and platform fees before making a trade.
            </p>
        </main>
    );
}
