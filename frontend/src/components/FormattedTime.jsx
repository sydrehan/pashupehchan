// File Path: frontend/src/components/FormattedTime.jsx (A NEW, DEDICATED COMPONENT)

import React from 'react';

// Yeh component ek prop 'utcTimestamp' lega (e.g., "2025-09-19T04:16:00.123456")
const FormattedTime = ({ utcTimestamp }) => {

    // Safety check: Agar timestamp nahi hai to kuch na dikhaye
    if (!utcTimestamp) {
        return null;
    }

    try {
        // --- THIS IS THE GUARANTEED FIX ---
        // 1. We create a Date object from the string. Appending 'Z' tells JavaScript 100%
        //    that this incoming time is in the UTC timezone.
        const dateObject = new Date(utcTimestamp + 'Z');

        // 2. We use `toLocaleString()` WITHOUT any country code. This forces the browser
        //    to use the user's own computer/phone's settings for the region.
        //    We give it specific options to ensure the format is always nice.
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true, // Hamesha AM/PM format ka istemal karega
        };

        // Yeh browser se user ke local format mein time ko convert karke dega
        return dateObject.toLocaleString(undefined, options);

    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date"; // Agar koi error ho to yeh dikhega
    }
};

export default FormattedTime;