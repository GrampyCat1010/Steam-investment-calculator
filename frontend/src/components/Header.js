import './Header.css';
import { Link } from "react-router-dom";
import React, { useState } from 'react';

function Header({ steamId }) {
    const [copied, setCopied] = useState(false);

    const handleCopySteamId = () => {
        if (!steamId) return;
        navigator.clipboard.writeText(steamId).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };

    return (
        <header className="header">
            <div className="header-logo">
                <img src="/logo512.png" alt="Logo" className="logo-image" />
                <div className="logo-text">
                    <span className="logo-title">Steam Investment Calculator</span>
                    {steamId && (
                        <span
                            className="logo-steamid"
                            onClick={handleCopySteamId}
                            title=""
                        >
                            Steam ID: {steamId} {copied && "✓"}
                        </span>
                    )}
                </div>
            </div>

            <nav className="header-nav">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/calculator" className="nav-link">Calculator</Link>
                <Link to="/inventory" className="nav-link">Inventory</Link>
                <Link to="/market" className="nav-link">Market</Link>
                <Link to="/about-us" className="nav-link">About Us</Link>
            </nav>
        </header>
    );
}

export default Header;