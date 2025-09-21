// // File Path: frontend/src/pages/HomePage.jsx (STABLE & FINAL)
// import React, { useState, useContext } from 'react';
// import ImageUploader from '../components/ImageUploader';
// import { AppContext } from '../contexts/AppContext';
// import axios from 'axios';
// import Loader from '../components/Loader';
// import DetailsModal from '../components/DetailsModal';
// import { API_URL } from '../IP_CONFIG.js';

// const HomePage = () => {
//     const { user, setIsLoading, isLoading } = useContext(AppContext);
//     const [images, setImages] = useState({ front: null, back: null, left: null, right: null });
//     const [error, setError] = useState('');
//     const [resultData, setResultData] = useState(null);

//     const handleFileSelect = (side, file) => {
//         const key = side.toLowerCase();
//         setImages(prev => ({ ...prev, [key]: file }));
//     };
    
//     const handleSubmit = () => {
//         setError('');
//         setIsLoading(true);

//         if (!navigator.geolocation) {
//             setError("Geolocation is not supported by your browser.");
//             setIsLoading(false);
//             return;
//         }

//         navigator.geolocation.getCurrentPosition(
//             async (position) => {
//                 const { latitude, longitude } = position.coords;
//                 const formData = new FormData();
//                 formData.append('user_id', user.id);
//                 formData.append('latitude', latitude);
//                 formData.append('longitude', longitude);

//                 for (const side in images) {
//                     // Safety Check: Ensure the file object exists before appending
//                     if (images[side]) {
//                         formData.append(side, images[side]);
//                     }
//                 }
                
//                 try {
//                     const response = await axios.post(`${API_URL}/identify`, formData);
//                     setResultData({
//                         id: response.data.record_id,
//                         animal_name: 'Identification Result',
//                         breed_result: response.data.result,
//                         is_saved: false,
//                         latitude: latitude,
//                         longitude: longitude
//                     });
//                 } catch (err) {
//                     // Provide a more detailed error from the backend if possible
//                     setError(err.response?.data?.error || 'An error occurred. Please check the backend server terminal for details.');
//                 } finally {
//                     setIsLoading(false);
//                 }
//             },
//             () => {
//                 setError("Location permission was denied. Please allow location access in your browser settings.");
//                 setIsLoading(false);
//             }
//         );
//     };
    
//     const resetForm = () => {
//         setResultData(null);
//         window.location.reload();
//     }

//     const canSubmit = Object.values(images).every(Boolean);

//     if (isLoading) {
//         return <Loader message="Getting location & analyzing images..." />;
//     }

//     return (
//         <>
//             <p style={{textAlign: 'center', margin: '0 0 1.5rem 0', padding: '0 1rem'}}>
//                 Please upload four clear photos of the <strong>same animal</strong> from all sides.
//             </p>
//             <div className="uploaders-grid">
//                 <ImageUploader title="FRONT" onFileSelect={handleFileSelect} />
//                 <ImageUploader title="BACK" onFileSelect={handleFileSelect} />
//                 <ImageUploader title="LEFT" onFileSelect={handleFileSelect} />
//                 <ImageUploader title="RIGHT" onFileSelect={handleFileSelect} />
//             </div>
//             {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
//             <button className="btn-primary identify-btn" onClick={handleSubmit} disabled={!canSubmit}>
//                 Identify Breed
//             </button>
//             {resultData && (
//                 <DetailsModal 
//                     record={resultData} 
//                     images={images} 
//                     onClose={resetForm} 
//                     showSave={true}
//                 />
//             )}
//         </>
//     );
// };
// export default HomePage;