import './Header.css';
import { Link, useLocation } from "react-router-dom"; // useLocation узнаёт текущий URL, чтобы подсветить активный пункт меню
import React, { useState } from 'react';

// Массив пунктов навигации вместо 5 отдельных <Link> в JSX —
// удобнее добавлять/убирать/переставлять пункты меню в одном месте
const NAV_ITEMS = [
    { to: "/", label: "Home" },
    { to: "/calculator", label: "Calculator" },
    { to: "/inventory", label: "Inventory" },
    { to: "/market", label: "Market" },
    { to: "/about-us", label: "About Us" },
];

function Header({ steamId }) {
    // copied — показываем галочку "✓" на секунду после того, как пользователь скопировал Steam ID
    const [copied, setCopied] = useState(false);

    // location.pathname — текущий адрес страницы (например "/" или "/calculator"),
    // используется ниже, чтобы понять, какой пункт меню сейчас активен
    const location = useLocation();

    const handleCopySteamId = () => {
        if (!steamId) return; // если steamId ещё не задан, копировать нечего
        navigator.clipboard.writeText(steamId).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500); // через 1.5 сек убираем галочку обратно
        });
    };

    return (
        <header className="header">
            {/* Лого — кликабельно, ведёт на главную ("/") */}
            <Link to="/" className="header-logo">
                <div className="logo-badge">
                    <img src="/logo512.png" alt="Logo" className="logo-image" />
                </div>
                <div className="logo-text">
                    <span className="logo-title">
                        Steam Investment
                        <br />
                        {/* logo-title-accent — красит "Calculator" градиентом (стиль задан в Header.css) */}
                        <span className="logo-title-accent">Calculator</span>
                    </span>
                </div>
            </Link>

            <nav className="header-nav">
                {/* Рендерим пункты меню циклом из массива NAV_ITEMS, объявленного выше */}
                {NAV_ITEMS.map((item) => {
                    // Сравниваем текущий адрес страницы с адресом пункта меню —
                    // если совпадают, значит пользователь сейчас на этой странице
                    const isActive = location.pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            // Добавляем класс "active" только активному пункту — по нему в CSS красим текст и подчёркивание
                            className={`nav-link${isActive ? " active" : ""}`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="header-actions">
                {/* Steam ID показываем только если он уже был введён (steamId не пустой) */}
                {steamId && (
                    <span
                        className="header-steamid"
                        onClick={handleCopySteamId}
                        title="Click to copy"
                    >
                        Steam ID: {steamId} {copied && "✓"}
                    </span>
                )}
                {/* Кнопка переключения темы — пока просто иконка-заглушка без реальной логики переключения */}
                <button className="theme-toggle" type="button" aria-label="Toggle theme">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path
                            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </header>
    );
}

export default Header;