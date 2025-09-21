// File Path: frontend/src/contexts/AppContext.jsx (FINAL WITH IMAGE STATE)
import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('breedIDUser')) || null);
    const [theme, setTheme] = useState(() => localStorage.getItem('breedIDTheme') || 'light');
    const [isLoading, setIsLoading] = useState(false);

    // --- NEW STATE TO REMEMBER IMAGES ACROSS ALL PAGES ---
    const [uploadImages, setUploadImages] = useState({
        front: null,
        back: null,
        left: null,
        right: null
    });

    useEffect(() => {
        if (user) { localStorage.setItem('breedIDUser', JSON.stringify(user)); } 
        else { localStorage.removeItem('breedIDUser'); }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('breedIDTheme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    
    // Make the new state and its setter available to the entire application
    const value = { 
        user, setUser, 
        theme, setTheme, 
        isLoading, setIsLoading, 
        uploadImages, setUploadImages // Added here
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};