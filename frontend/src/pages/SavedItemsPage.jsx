// File Path: frontend/src/pages/SavedItemsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import axios from 'axios';
import Loader from '../components/Loader';
import DetailsModal from '../components/DetailsModal';
import FormattedTime from '../components/FormattedTime'; // Naya component import karein
import { API_URL } from '../IP_CONFIG.js';

const SavedItemsPage = () => {
    const { user } = useContext(AppContext); const [savedItems, setSavedItems] = useState([]); const [isLoading, setIsLoading] = useState(true); const [selectedRecord, setSelectedRecord] = useState(null);
    const fetchSavedItems = async () => { if (!user) return; setIsLoading(true); try { const response = await axios.get(`${API_URL}/history/saved/${user.id}`); setSavedItems(response.data); } catch (error) { console.error("Failed to fetch saved items:", error); } finally { setIsLoading(false); } };
    useEffect(() => { fetchSavedItems(); }, [user]);
    const handleStatusOrDeleteChange = () => { fetchSavedItems(); };
    if (isLoading) return <Loader message="Loading your saved items..." />;

    return (
        <>
            <div className="history-list">
                {savedItems.length === 0 ? (<p style={{ textAlign: 'center' }}>You have no saved items yet.</p>) : (
                    savedItems.map((record, index) => (
                        <div className="history-card" key={record.id} onClick={() => setSelectedRecord(record)}>
                            <div className="history-card-content">
                                <h3><span className="record-index">{index + 1}.</span>{'⭐ '}{record.animal_name}</h3>
                                {/* Purane 'new Date' ki jagah naya component istemal karein */}
                                <p>Analyzed on: <FormattedTime utcTimestamp={record.timestamp} /></p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {selectedRecord && (<DetailsModal record={selectedRecord} images={selectedRecord.images} onClose={() => setSelectedRecord(null)} onStatusChange={handleStatusOrDeleteChange} onItemDeleted={handleStatusOrDeleteChange} isFromSavedPage={true} showUnsave={true} showDelete={false} />)}
        </>
    );
};
export default SavedItemsPage;