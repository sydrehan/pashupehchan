// File Path: frontend/src/components/DetailsModal.jsx (FINAL, STABLE & BUG-FREE)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import { API_URL } from '../IP_CONFIG.js';

const DetailsModal = ({ record, images, onClose, onStatusChange = () => {}, onItemDeleted = () => {}, isFromSavedPage = false }) => {
    const navigate = useNavigate();

    // --- YEH SABSE ZAROORI CRASH FIX HAI ---
    // Agar modal ko `record` nahi milta, to woh kuch bhi display nahi karega aur crash hone se bach jayega.
    if (!record || !record.breed_result) {
        return null; 
    }

    const [isSaved, setIsSaved] = useState(record.is_saved || false);
    const [originalResult] = useState(record.breed_result);
    const [displayText, setDisplayText] = useState(record.breed_result);
    const [isTranslating, setIsTranslating] = useState(false);
    const [parsedResult, setParsedResult] = useState([]);

    useEffect(() => {
        const lines = displayText.split('\n').filter(line => line.includes(':'));
        const data = lines.map(line => {
            const [key, ...valueParts] = line.split(':');
            return { key: key.trim(), value: valueParts.join(':').trim() };
        });
        setParsedResult(data);
    }, [displayText]);
    
    const getImageUrl = (imageSource) => {
        if (typeof imageSource === 'string') return `${API_URL}${imageSource}`;
        if (imageSource instanceof File) return URL.createObjectURL(imageSource);
        return '';
    };

    const handleToggleSave = async (e) => { e.stopPropagation(); try { const response = await axios.post(`${API_URL}/history/toggle_save/${record.id}`); setIsSaved(response.data.new_status); onStatusChange(); } catch (error) { console.error("Save error", error); alert("Could not update save status."); } };
    const handleDelete = async (e) => { e.stopPropagation(); if(window.confirm("Are you sure? This action is permanent.")) { try { await axios.delete(`${API_URL}/history/delete/${record.id}`); onItemDeleted(record.id); onClose(); } catch (error) { console.error("Delete error", error); alert("Could not delete."); } } };
    const handleTranslate = async (event) => { const lang = event.target.value; if (!lang || lang === 'English') { setDisplayText(originalResult); return; } setIsTranslating(true); try { const res = await axios.post(`${API_URL}/translate`, { text: originalResult, target_language: lang }); setDisplayText(res.data.translated_text); } catch (error) { alert('Translation failed.'); } finally { setIsTranslating(false); } };
    
    const mapUrl = record.latitude && record.longitude ? `https://www.google.com/maps/search/?api=1&query=${record.latitude},${record.longitude}` : null;

    // Data ko ab alag-alag nahi kiya jayega, jaisa aapne kaha tha
    // const mainDetails = ...
    // const otherDetails = ...

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{record.animal_name || 'Identification Result'}</h3>
                    <div className="modal-actions">
                        <select onChange={handleTranslate} defaultValue=""><option value="">Translate...</option><option value="English">English</option><option value="Hindi">Hindi</option></select>
                        {isFromSavedPage ? (isSaved && <button className="icon-btn" onClick={handleToggleSave} title="Unsave">🌟</button>) : (<button className="icon-btn" onClick={handleToggleSave} title={isSaved ? "Unsave" : "Save"}>{isSaved ? '🌟' : '⭐'}</button>)}
                        {!isFromSavedPage && (<button className="icon-btn delete-btn" onClick={handleDelete} title="Delete">&#128465;</button>)}
                    </div>
                </div>
                <div className="modal-images-small"><img src={getImageUrl(images.front)} alt="Front"/><img src={getImageUrl(images.back)} alt="Back"/><img src={getImageUrl(images.left)} alt="Left"/><img src={getImageUrl(images.right)} alt="Right"/></div>
                
                {isTranslating ? <Loader message="Translating..." /> : (
                    <table className="result-table">
                        <tbody>
                            {/* Ab saara data seedhe yahan render hoga, koi duplicate nahi */}
                            {parsedResult.map(item => (
                                <tr key={item.key} className={
                                        item.key === 'Animal Name' || item.key === 'Breed' ? 'highlight-row' : 
                                        item.key === 'Breed Gender' ? 'gender-row' : ''
                                    }>
                                    <td>{item.key}</td>
                                    <td>{item.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {mapUrl && (<div className="location-section"><a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn-primary map-btn">📍 View on Map</a></div>)}
                <button className="btn-primary" style={{marginTop: '1rem', backgroundColor: '#6b7280'}} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};
export default DetailsModal;