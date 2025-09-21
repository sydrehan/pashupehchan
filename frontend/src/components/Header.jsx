// File Path: frontend/src/components/Header.jsx (FINAL, COMPLETE, AND CORRECTED)

import React, { useContext } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

const Header = ({ title }) => {
    const { user } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();

    // Back button ab '/upload/front' (wizard ke pehle step) ke alawa har page par dikhega
    const showBackButton = location.pathname !== '/upload/front';

    // User ke gender ke hisaab se profile icon select karta hai
    const getProfileIcon = () => {
        if (user?.gender === 'male') return '👨';
        if (user?.gender === 'female') return '👩';
        return '👤'; // Default icon
    };

    return (
        <header className="app-header">
            <div className="header-left">
                {showBackButton ? (
                    <button className="header-icon-btn" onClick={() => navigate(-1)}>&#8592;</button>
                ) : (
                    // Yeh khaali div header ko balanced rakhta hai jab back button nahi hota
                    <div style={{width: '60px'}}></div> 
                )}
            </div>
            
            <h1>{title}</h1>
            
            <div className="header-right">
                <NavLink to="/help" className="header-icon-btn" title="Help">❓</NavLink>
                <NavLink to="/settings" className="header-icon-btn" title="Profile & Settings">{getProfileIcon()}</NavLink>
            </div>
        </header>
    );
};

export default Header;