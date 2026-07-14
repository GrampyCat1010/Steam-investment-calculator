import React from "react";
import "./AboutUsPage.css";
import { Link } from "react-router-dom";
// Импорт картинок как модулей — так принято в Create React App / Webpack:
// сборщик сам подставит вместо grampyAvatar правильный путь к файлу после сборки (например /static/media/....jpg).
// Файлы должны физически лежать по пути src/assets/, иначе сборка упадёт с ошибкой "Module not found".
import grampyAvatar from "../assets/grampycat1010.jpg";
import smokingAvatar from "../assets/smokingkillsu.jpg";

// ===== ДАННЫЕ ДЛЯ БЛОКА "НАША МИССИЯ" (3 карточки-принципа) =====
// Иконки — инлайн SVG в том же стиле, что на DashboardPage (currentColor + тонкие линии)
const VALUES = [
    {
        title: "Transparency",
        text: "We show exactly how every number is calculated — no black boxes.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: "Accuracy",
        text: "Prices and trends are pulled from live market data, updated constantly.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: "Community",
        text: "Built together with traders and collectors who use it every day.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="8" r="3" />
                <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 4.5a3 3 0 010 6" strokeLinecap="round" />
                <path d="M18 14.2c2.3.6 4 2.5 4 5.8" strokeLinecap="round" />
            </svg>
        ),
    },
];

// ===== ДАННЫЕ ДЛЯ КОМАНДЫ =====
// Каждый объект описывает одного участника:
// nickname  — никнейм, который видит пользователь (используется и как текст ссылки, и как key в .map)
// avatar    — импортированная картинка (переменная grampyAvatar/smokingAvatar из require выше)
// githubUrl — куда ведёт клик по нику; открывается в новой вкладке (см. target="_blank" ниже в JSX)
const TEAM = [
    { nickname: "GrampyCat1010", avatar: grampyAvatar, githubUrl: "https://github.com/GrampyCat1010" },
    { nickname: "smokingkillsu", avatar: smokingAvatar, githubUrl: "https://github.com/KyrenieYbivaet" },
];

export default function AboutUsPage() {
    return (
        <main className="about">
            {/* ===== ВЕРХНЯЯ СЕКЦИЯ: бейдж + заголовок + описание (тот же паттерн, что на DashboardPage) ===== */}
            <section className="about-hero">
                <div className="badge">
                    <span className="badge-icon">◆</span>
                    About the team
                </div>

                <h1>
                    Built by traders,
                    <br />
                    <span className="gradient-text">for traders.</span>
                </h1>

                <p>
                    Steam Investment Calculator started in 2025 as a side project to
                    track our own Steam inventories. Today it helps thousands of
                    collectors and traders make smarter, data-driven decisions.
                </p>
            </section>

            {/* ===== СЕКЦИЯ "НАШИ ЦЕННОСТИ" — 3 карточки с иконками ===== */}
            <section className="about-values">
                <h2>What we stand for</h2>
                <div className="about-values-grid">
                    {VALUES.map((value) => (
                        <div className="value-card" key={value.title}>
                            <div className="value-icon">{value.icon}</div>
                            <b>{value.title}</b>
                            <p>{value.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== СЕКЦИЯ "КОМАНДА" ===== */}
            <section className="about-team">
                <h2>Meet the team</h2>
                <div className="about-team-grid">
                    {/* .map проходит по массиву TEAM и для каждого участника рисует одну карточку.
                        key={member.nickname} — обязательный проп для списков в React,
                        помогает React понять, какой элемент изменился/удалился/добавился при перерисовке. */}
                    {TEAM.map((member) => (
                        // ВАЖНОЕ ИЗМЕНЕНИЕ: раньше ссылкой был только текст ника (<a> вокруг {member.nickname}),
                        // теперь ссылкой является ВСЯ карточка целиком — <a className="team-card"> оборачивает
                        // и картинку, и текст. Благодаря этому клик в любой точке карточки (не только на нике)
                        // открывает GitHub, а hover-подсветка в CSS применяется сразу ко всему блоку.
                        <a
                            key={member.nickname}
                            href={member.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="team-card"
                        >
                            {/* Реальное фото участника вместо кружка-заглушки с буквой.
                                src берёт значение из member.avatar (уже импортированная картинка).
                                alt обязателен для доступности (screen readers) и на случай, если картинка не загрузится. */}
                            <img
                                src={member.avatar}
                                alt={member.nickname}
                                className="team-avatar"
                            />
                            {/* Ник теперь обычный <span>, а не отдельная ссылка — кликабельность
                                обеспечивает родительский <a>, дублировать ссылку внутри ссылки нельзя (невалидный HTML) */}
                            <span className="team-nickname">{member.nickname}</span>
                        </a>
                    ))}
                </div>
            </section>

            {/* ===== CTA-БЛОК В КОНЦЕ — ссылка на калькулятор, как кнопка Open Calculator на Dashboard ===== */}
            <section className="about-cta">
                <h2>Ready to see what your inventory is worth?</h2>
                <Link to="/calculator" className="open-calculator">
                    <span className="open-calculator-icon">▦</span>
                    Open Calculator
                    <span className="open-calculator-arrow">→</span>
                </Link>
            </section>
        </main>
    );
}
