// File Path: frontend/src/components/BottomNav.jsx (FINAL WITH REPORT TAB)

import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                <span>📷</span>
                <span>Identify</span>
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                 <span>📜</span>
                 <span>History</span>
            </NavLink>
            <NavLink to="/saved" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                <span>⭐</span>
                <span>Saved</span>
            </NavLink>
            {/* --- NAYA 'REPORT' ICON --- */}
            <NavLink to="/report" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
                <span>📄</span>
                <span>Report</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;