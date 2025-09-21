// File Path: frontend/src/components/Loader.jsx

import React from 'react';

// Yeh ek simple component hai jo ek 'message' prop leta hai.
// Agar message nahi diya jaata, to woh default 'Loading...' dikhayega.
const Loader = ({ message = 'Loading...' }) => {
    return (
        // .loader class ise page ke center mein rakhti hai (App.css se style aati hai)
        <div className="loader">
            {/* .spinner class ghoomne wali animation banati hai */}
            <div className="spinner"></div>
            {/* Yahan par woh message dikhaya jaata hai jo component ko pass kiya gaya hai */}
            <p style={{ marginTop: '1rem', fontWeight: '500' }}>
                {message}
            </p>
        </div>
    );
};

export default Loader;