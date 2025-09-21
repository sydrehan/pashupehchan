// File Path: frontend/src/components/ImageUploader.jsx (FINAL, CAMERA-GALLERY SEPARATION GUARANTEED)

import React, { useState, useRef, useEffect } from 'react';

const ImageUploader = ({ title, onFileSelect }) => {
    const [preview, setPreview] = useState(null);

    // Hum do alag alag, independent refs ka istemal kar rahe hain.
    // Inka naam saaf-saaf batata hai ki kaun sa ref kya kaam karta hai.
    const galleryInputRef = useRef(null); // Yeh gallery ke liye hai
    const cameraInputRef = useRef(null);  // Yeh camera ke liye hai

    useEffect(() => {
        // Naye page par aate hi purana preview saaf kar deta hai
        setPreview(null);
        if(galleryInputRef.current) galleryInputRef.current.value = "";
        if(cameraInputRef.current) cameraInputRef.current.value = "";
    }, [title]);

    // Yeh function dono (camera ya gallery) se file select hone par chalta hai
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setPreview(reader.result); };
            reader.readAsDataURL(file);
            onFileSelect(title, file);
        }
    };

    const clearPreview = () => {
        setPreview(null);
        onFileSelect(title, null);
    };

    return (
        <div className="image-uploader">
            
            {/* Gallery ke liye alag input, hamesha hidden rehta hai */}
            <input
                id={`gallery-input-${title}`} // Unique ID
                type="file"
                accept="image/*"
                ref={galleryInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }} 
            />
            {/* Camera ke liye alag input, hamesha hidden rehta hai */}
            <input
                id={`camera-input-${title}`} // Unique ID
                type="file"
                accept="image/*"
                capture="environment" // Yeh attribute mobile par camera kholne ka hint deta hai
                ref={cameraInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }} 
            />
            
            {preview ? (
                <img src={preview} alt={`${title} preview`} className="preview-image" onClick={clearPreview} title="Click to remove"/>
            ) : (
                <div className="uploader-options-container">
                    <div className="uploader-title">{title}</div>
                    
                    {/* --- YEH SABSE ZAROORI FIX HAI --- */}
                    {/* "Capture Image" ka button sirf aur sirf `cameraInputRef` ko hi click karega */}
                    <div className="uploader-button-box" onClick={() => cameraInputRef.current.click()}>
                        <span>📷</span>
                        <span className="uploader-text">Capture Image</span>
                    </div>
                    
                    <div className="uploader-divider">or</div>
                    
                    {/* "Upload Image" ka button sirf aur sirf `galleryInputRef` ko hi click karega */}
                    <div className="uploader-button-box" onClick={() => galleryInputRef.current.click()}>
                        <span>🖼️</span>
                        <span className="uploader-text">Upload Image</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;