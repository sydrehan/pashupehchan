// File Path: frontend/src/pages/HelpPage.jsx (NEW FILE)

import React from 'react';

const HelpPage = () => {
    return (
        <div className="help-container">
            <h2>User Guide & Help</h2>
            
            <h4>How to Take Good Photos for Accurate Results:</h4>
            <ul>
                <li><strong>Clear Background:</strong> Try to keep the background simple. Avoid cluttered areas.</li>
                <li><strong>Good Lighting:</strong> Take photos during the day. Avoid harsh shadows or very dark conditions.</li>
                <li><strong>Full Animal View:</strong> Ensure the entire animal, from head to tail, is visible in the frame.</li>
                <li><strong>Correct Angles:</strong> Provide clear photos from the Front, Back, Left, and Right sides as requested.</li>
            </ul>

            <h4>Frequently Asked Questions (FAQ):</h4>
            <div className="faq-item">
                <strong>Q: Why does the app say "Breed cannot be determined"?</strong>
                <p>A: This can happen if the photos are too blurry, too dark, or if the animal is at a very unusual angle. Please try taking new photos following the guide above.</p>
            </div>
            <div className="faq-item">
                <strong>Q: Can I identify a very young calf?</strong>
                <p>A: Yes, the AI can often identify the breed of young animals, but accuracy is highest for adult animals whose features are fully developed.</p>
            </div>
            <div className="faq-item">
                <strong>Q: What is the difference between "History" and "Saved"?</strong>
                <p>A: "History" automatically contains every animal you identify. "Saved" is your special list of favorites, where you can manually save the most important results from your history.</p>
            </div>
        </div>
    );
};

export default HelpPage;