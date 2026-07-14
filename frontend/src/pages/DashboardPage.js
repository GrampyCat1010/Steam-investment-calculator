import React from "react";
import "./DashboardPage.css";
import { Link } from "react-router-dom";

// ===== ДАННЫЕ ДЛЯ ГРАФИКА =====
// Мок-данные для графика (30 дней). Каждое число — стоимость портфеля в этот день.
// Позже эти 30 чисел нужно заменить реальными данными, которые придут с бэкенда (например, через fetch/axios).
const CHART_DATA = [
    780, 760, 800, 790, 820, 810, 840,
    870, 900, 890, 930, 960, 950, 980,
    1010, 1040, 1020, 1060, 1090, 1080,
    1110, 1140, 1130, 1170, 1200, 1190,
    1230, 1260, 1250, 1280,
];

// Подписи под графиком по оси X (даты). Их 5, они расставлены равномерно.
const CHART_LABELS = ["May 1", "May 8", "May 15", "May 22", "May 29"];

// ===== КОМПОНЕНТ ГРАФИКА =====
// Рисует линейный график чистым SVG, без сторонних библиотек (recharts и т.п. не установлены в проекте).
// Принимает массив чисел (data) и сам вычисляет координаты точек.
function PortfolioChart({ data }) {
    // Размеры "холста" графика в условных единицах SVG (viewBox), не в пикселях экрана —
    // сам SVG растягивается на всю ширину контейнера через CSS (width: 100%).
    const width = 780;
    const height = 220;
    const padding = 32; // отступ от края, чтобы линия не упиралась в границы

    // Находим минимальное и максимальное значение в данных —
    // они нужны, чтобы "сжать" реальные цифры (например, 780–1280) в диапазон высоты графика (0–220px)
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; // защита от деления на 0, если все значения одинаковые

    // Превращаем каждое число из data в координату (x, y) на SVG-холсте
    const points = data.map((value, index) => {
        // x распределяет точки равномерно по ширине графика
        const x = padding + (index / (data.length - 1)) * (width - padding * 2);
        // y переворачивает ось (в SVG 0 сверху), чем больше value, тем выше (меньше y) точка
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return `${x},${y}`;
    });

    // Строка вида "x1,y1 x2,y2 x3,y3 ..." — формат, который понимает <polyline>
    const polylinePoints = points.join(" ");

    // То же самое, но с добавленными точками внизу слева и справа —
    // это нужно, чтобы получился замкнутый контур для заливки области под линией (<polygon>)
    const areaPoints = `${padding},${height - padding} ${polylinePoints} ${width - padding},${height - padding}`;

    // Считаем 5 горизонтальных линий сетки (4 промежутка) для фона графика
    const yTicks = 4;
    const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => {
        return min + (range / yTicks) * i;
    }).reverse();

    return (
        <svg
            className="portfolio-chart"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none" // разрешаем графику растягиваться не сохраняя пропорции — подстраивается под контейнер
        >
            <defs>
                {/* Градиент для заливки области под линией: сверху полупрозрачный синий, снизу — прозрачный */}
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(90, 120, 255, 0.35)" />
                    <stop offset="100%" stopColor="rgba(90, 120, 255, 0)" />
                </linearGradient>
            </defs>

            {/* Фоновая сетка — горизонтальные линии-ориентиры */}
            {yLabels.map((value, i) => {
                const y = padding + (i / yTicks) * (height - padding * 2);
                return (
                    <line
                        key={i}
                        x1={padding}
                        y1={y}
                        x2={width - padding}
                        y2={y}
                        className="chart-grid-line"
                    />
                );
            })}

            {/* Заливка под линией графика (использует градиент, объявленный выше в defs) */}
            <polygon points={areaPoints} fill="url(#chartFill)" />

            {/* Сама линия графика */}
            <polyline points={polylinePoints} className="chart-line" fill="none" />
        </svg>
    );
}

export default function DashboardPage() {
    // ===== ДАННЫЕ ДЛЯ 4 КАРТОЧЕК СТАТИСТИКИ =====
    // Массив вместо 4 отдельных JSX-блоков — легче добавить/убрать метрику, не трогая разметку ниже
    const stats = [
        { label: "Total Value", value: "$1,256.78", change: "+12.45%" },
        { label: "Trade Count", value: "128", change: "+8.72%" },
        { label: "Total Profit (USD)", value: "$342.19", change: "+6.31%" },
        { label: "Total Profit (%)", value: "27.28%", change: "+6.31%" },
    ];

    // ===== ДАННЫЕ ДЛЯ 4 БЛОКОВ "ПОЧЕМУ МЫ" ВНИЗУ СТРАНИЦЫ =====
    // Иконки — это инлайн SVG (нарисованы вручную линиями), чтобы не подключать библиотеку иконок ради 4 картинок
    const features = [
        {
            title: "Market Data",
            text: "Real-time prices and trends",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            title: "Accurate",
            text: "Reliable calculations and insights",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            title: "Fast & Easy",
            text: "Get results in seconds",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            title: "Smart Decisions",
            text: "Invest smarter, not harder",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v9l7-4a9 9 0 11-7-5z" strokeLinejoin="round" />
                </svg>
            ),
        },
    ];

    return (
        <main className="dashboard">
            {/* ===== ВЕРХНЯЯ СЕКЦИЯ: заголовок слева + карточка Portfolio Overview справа ===== */}
            <section className="dashboard-hero">

                {/* ЛЕВАЯ ЧАСТЬ: заголовок, описание и кнопка перехода к калькулятору */}
                <div className="dashboard-page-info">
                    <div className="badge">
                        <span className="badge-icon">↗</span>
                        Calculate. Invest. Profit.
                    </div>

                    <h1>
                        Smart Steam
                        <br />
                        Investments.
                        <br />
                        {/* gradient-text — класс из CSS красит текст градиентом (см. DashboardPage.css) */}
                        <span className="gradient-text">Maximize Profits.</span>
                    </h1>

                    <p>
                        Analyze your Steam inventory, track market trends, and calculate
                        potential profits with real-time data and powerful insights.
                    </p>

                    {/* Link из react-router-dom вместо <a>, чтобы переход был без перезагрузки страницы */}
                    <Link to="/calculator" className="open-calculator">
                        <span className="open-calculator-icon">▦</span>
                        Open Calculator
                        <span className="open-calculator-arrow">→</span>
                    </Link>
                </div>

                {/* ПРАВАЯ ЧАСТЬ: карточка с общей статистикой портфеля и графиком */}
                <div className="portfolio-overview">
                    <div className="portfolio-overview-header">
                        <span className="portfolio-overview-icon">◐</span>
                        <h2>Portfolio Overview</h2>
                    </div>

                    {/* 4 карточки статистики — рендерятся циклом из массива stats, объявленного выше */}
                    <div className="portfolio-stats-grid">
                        {stats.map((stat) => (
                            <div className="portfolio-stat-card" key={stat.label}>
                                <span className="portfolio-stat-label">{stat.label}</span>
                                <span className="portfolio-stat-value">{stat.value}</span>
                                <span className="portfolio-stat-change">{stat.change}</span>
                            </div>
                        ))}
                    </div>

                    {/* Карточка с графиком — используем компонент PortfolioChart, объявленный выше в этом файле */}
                    <div className="portfolio-chart-card">
                        <h3>Portfolio Value (30 Days)</h3>
                        <PortfolioChart data={CHART_DATA} />
                        <div className="portfolio-chart-labels">
                            {CHART_LABELS.map((label) => (
                                <span key={label}>{label}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== НИЖНЯЯ СЕКЦИЯ: 4 карточки с иконками "почему мы" ===== */}
            <section className="dashboard-features">
                {features.map((feature) => (
                    <div className="feature-card" key={feature.title}>
                        <div className="feature-icon">{feature.icon}</div>
                        <div className="feature-text">
                            <b>{feature.title}</b>
                            <span>{feature.text}</span>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}