// File Path: frontend/src/pages/SettingsPage.jsx
import React, { useContext } from 'react';
import Header from '../components/Header';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const { theme, setTheme, user, setUser } = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // --- FIX: This function now correctly uses the event target's value ---
    const handleThemeChange = (e) => {
        setTheme(e.target.value);
    };

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    const handleLogout = () => { /* ... this function remains unchanged ... */ 
        if (window.confirm('Are you sure you want to log out?')) {
            setUser(null); localStorage.removeItem('breedIDUser'); navigate('/profile');
        }
    };

    if (!user) return null;

    return (
        <>
            <Header title={t('settings_title')} />
            {/* Theme Selector */}
            <div className="form-group">
                <label htmlFor="theme-select">{t('theme_label')}</label>
                <select id="theme-select" className="form-input" value={theme} onChange={handleThemeChange}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>
            {/* Language Selector */}
            <div className="form-group">
                <label htmlFor="language-select">{t('language_label')}</label>
                <select id="language-select" className="form-input" value={i18n.language} onChange={handleLanguageChange}>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                </select>
            </div>
            {/* Profile Info and Logout */}
            <div className="form-group">
                <label>Profile Information</label>
                <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>User ID:</strong> <small>{user.id}</small></p>
                </div>
            </div>
            <div className="form-group" style={{marginTop: '2rem'}}>
                 <button onClick={handleLogout} className="btn-primary" style={{backgroundColor: '#ef4444'}}>Logout</button>
            </div>
        </>
    );
};
export default SettingsPage;