// File Path: frontend/src/pages/ProfilePage.jsx
import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import axios from 'axios';
import Loader from '../components/Loader';
import { API_URL } from '../IP_CONFIG.js';

const ProfilePage = () => {
    const { setUser, setIsLoading, isLoading } = useContext(AppContext);
    const [formData, setFormData] = useState({ name: '', phone: '', state: '', district: '', pincode: '', gender: 'male' });
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!Object.values(formData).every(Boolean)) { setError('All fields are required.'); return; }
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/register`, formData);
            setUser(response.data);
        } catch (err) {
            if (err.response) { setError(err.response.data.error || 'Server responded with an error.'); }
            else if (err.request) { setError('Could not connect to the server. Check Wi-Fi and IP address.'); }
            else { setError('An unknown error occurred.'); }
        } finally { setIsLoading(false); }
    };

    if (isLoading) return <Loader message="Creating profile..." />;
    return (
        <div style={{maxWidth: '400px', margin: '2rem auto'}}>
            <h2 style={{textAlign: 'center'}}>Create Your Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Name</label><input type="text" name="name" className="form-input" onChange={handleChange} required /></div>
                <div className="form-group"><label>Phone</label><input type="tel" name="phone" className="form-input" onChange={handleChange} required /></div>
                <div className="form-group"><label>State</label><input type="text" name="state" className="form-input" onChange={handleChange} required /></div>
                <div className="form-group"><label>District</label><input type="text" name="district" className="form-input" onChange={handleChange} required /></div>
                <div className="form-group"><label>Pincode</label><input type="text" name="pincode" className="form-input" onChange={handleChange} required /></div>
                <div className="form-group"><label>Gender</label><select name="gender" className="form-input" value={formData.gender} onChange={handleChange}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <button type="submit" className="btn-primary">Create Profile & Start</button>
            </form>
        </div>
    );
};
export default ProfilePage;