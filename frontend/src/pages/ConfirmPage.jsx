// File Path: frontend/src/pages/ConfirmPage.jsx

import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import DetailsModal from '../components/DetailsModal';
import { API_URL } from '../IP_CONFIG.js';

const ConfirmPage = () => {
    const { uploadImages, setUploadImages, setIsLoading, isLoading } = useContext(AppContext);
    const [error, setError] = useState('');
    const [resultData, setResultData] = useState(null);
    const [previews, setPreviews] = useState({ front: '', back: '', left: '', right: '' });

    // Create previews for uploaded images
    useEffect(() => {
        setPreviews({
            front: uploadImages.front ? URL.createObjectURL(uploadImages.front) : '',
            back: uploadImages.back ? URL.createObjectURL(uploadImages.back) : '',
            left: uploadImages.left ? URL.createObjectURL(uploadImages.left) : '',
            right: uploadImages.right ? URL.createObjectURL(uploadImages.right) : ''
        });
    }, [uploadImages]);

    const handleSubmit = () => {
        setError('');
        setIsLoading(true);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const formData = new FormData();
                // ❌ Removed user.id append
                formData.append('latitude', latitude);
                formData.append('longitude', longitude);

                for (const side in uploadImages) {
                    if (uploadImages[side]) {
                        formData.append(side, uploadImages[side]);
                    }
                }

                try {
                    const response = await axios.post(`${API_URL}/api/identify`, formData);
                    setResultData({
                        id: response.data.record_id || Date.now(), // fallback if no id from backend
                        animal_name: 'Identification Result',
                        breed_result: response.data.result,
                        is_saved: false,
                        latitude,
                        longitude
                    });
                } catch (err) {
                    setError(err.response?.data?.error || 'An error occurred.');
                } finally {
                    setIsLoading(false);
                }
            },
            () => {
                setError("Location permission denied.");
                setIsLoading(false);
            }
        );
    };

    const resetWizard = () => {
        setResultData(null);
        setUploadImages({ front: null, back: null, left: null, right: null });
        window.location.href = '/upload/front';
    };

    if (isLoading) return <Loader message="Getting location & analyzing images..." />;

    if (!Object.values(uploadImages).every(Boolean)) {
        return (
            <div style={{textAlign: 'center', marginTop: '2rem'}}>
                <p>Some images are missing. Please start over.</p>
                <a
                    href="/upload/front"
                    className='btn-primary'
                    style={{textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '0.5rem 1rem'}}
                >
                    Start Over
                </a>
            </div>
        );
    }

    return (
        <div className="confirm-page-container">
            <p>Please confirm the four uploaded images below before identification.</p>
            <div className="confirm-grid">
                <div className="confirm-image-item">
                    <img src={previews.front} alt="Front Preview"/>
                    <label>FRONT</label>
                </div>
                <div className="confirm-image-item">
                    <img src={previews.back} alt="Back Preview"/>
                    <label>BACK</label>
                </div>
                <div className="confirm-image-item">
                    <img src={previews.left} alt="Left Preview"/>
                    <label>LEFT</label>
                </div>
                <div className="confirm-image-item">
                    <img src={previews.right} alt="Right Preview"/>
                    <label>RIGHT</label>
                </div>
            </div>
            {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
            <button className="btn-primary identify-btn" onClick={handleSubmit}>Identify Breed</button>
            {resultData && (
                <DetailsModal
                    record={resultData}
                    images={uploadImages}
                    onClose={resetWizard}
                    showSave={true}
                />
            )}
        </div>
    );
};

export default ConfirmPage;
