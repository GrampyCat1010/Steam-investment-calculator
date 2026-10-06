import React, { createContext, useContext, useMemo, useState } from "react";

export const USD_TO_RUB = 90;

const CurrencyContext = createContext(null);

function readSavedCurrency() {
    if (typeof window === "undefined") return "USD";
    return window.localStorage.getItem("selectedCurrency") === "RUB" ? "RUB" : "USD";
}

export function CurrencyProvider({ children }) {
    const [currency, setCurrencyState] = useState(readSavedCurrency);

    const setCurrency = (nextCurrency) => {
        const next = nextCurrency === "RUB" ? "RUB" : "USD";
        setCurrencyState(next);
        window.localStorage.setItem("selectedCurrency", next);
    };

    const value = useMemo(() => ({
        currency,
        setCurrency,
        rate: USD_TO_RUB,
        convertFromUsd: (amount) => currency === "RUB" ? amount * USD_TO_RUB : amount,
        formatMoney: (amount) => new Intl.NumberFormat(currency === "RUB" ? "ru-RU" : "en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(currency === "RUB" ? amount * USD_TO_RUB : amount),
    }), [currency]);

    return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error("useCurrency must be used inside CurrencyProvider");
    return context;
}
