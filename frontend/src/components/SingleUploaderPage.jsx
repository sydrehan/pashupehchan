// File Path: frontend/src/components/SingleUploaderPage.jsx (FINAL, WITH NEXT BUTTON FIX)

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import ImageUploader from './ImageUploader';

const SingleUploaderPage = ({ side, nextStepUrl }) => {
    const { setUploadImages } = useContext(AppContext);
    const navigate = useNavigate();

    // isImageSelected state yeh track karega ki is page par image select hui hai ya nahi
    const [isImageSelected, setIsImageSelected] = useState(false);

    const handleFileSelect = (selectedSide, file) => {
        // Jab user image select karta hai:
        if (file) {
            // Global state mein image save karo
            const stateKey = selectedSide.toLowerCase().split(' ')[0]; // "Front View" se "front" banata hai
            setUploadImages(prevImages => ({
                ...prevImages,
                [stateKey]: file
            }));
            // Next button dikhane ke liye local state ko 'true' karo
            setIsImageSelected(true);
        } else {
            // Agar user ne preview clear kiya, to Next button ko hata do
            setIsImageSelected(false);
        }
    };
    
    // "Next" button dabane par yeh function chalta hai
    const handleNextClick = () => {
        // --- YEH SABSE ZAROORI LOGIC HAI ---
        // Pehle check karo ki image select hui hai ya nahi
        if (isImageSelected) {
            // Agar hui hai, tabhi agle page par jao
            navigate(nextStepUrl);
        } else {
            // Agar nahi hui, to ek error message dikhao
            alert("Please upload or capture an image before proceeding to the next step.");
        }
    };

    return (
        <div className="single-uploader-container">
            <p style={{textAlign: 'center', fontSize: '1.1rem'}}>
                Please upload a clear photo of the animal's <strong>{side}</strong>.
            </p>
            <div className="single-uploader-box">
                <ImageUploader title={side} onFileSelect={handleFileSelect} />
            </div>

            {/* Next button ab hamesha dikhega (ya image select hone ke baad dikhega), 
                lekin iska click event smart hai */}
            {isImageSelected && (
                <div style={{ marginTop: '1.5rem' }}>
                    <button className="btn-primary" onClick={handleNextClick}>
                        Next Step &rarr;
                    </button>
                </div>
            )}
        </div>
    );
};
export default SingleUploaderPage;