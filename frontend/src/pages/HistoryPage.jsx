// File Path: frontend/src/pages/HistoryPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import axios from 'axios';
import Loader from '../components/Loader';
import DetailsModal from '../components/DetailsModal';
import FormattedTime from '../components/FormattedTime'; // Naya component import karein
import { API_URL } from '../IP_CONFIG.js';

const HistoryPage = () => {
    const { user } = useContext(AppContext); const [history, setHistory] = useState([]); const [isLoading, setIsLoading] = useState(true); const [selectedRecord, setSelectedRecord] = useState(null);
    const fetchHistory = async () => { if (!user) return; setIsLoading(true); try { const response = await axios.get(`${API_URL}/history/${user.id}`); setHistory(response.data); } catch (error) { console.error("Failed to fetch history:", error); } finally { setIsLoading(false); } };
    useEffect(() => { fetchHistory(); }, [user]);
    const handleItemDeleted = (deletedId) => setHistory(current => current.filter(item => item.id !== deletedId));
    if (isLoading) return <Loader message="Loading history..." />;

    return (
        <>
            <div className="history-list">
                {history.length === 0 ? (<p style={{ textAlign: 'center' }}>No history found yet. Manage records in the Report tab.</p>) : (
                    history.map((record, index) => (
                        <div className="history-card" key={record.id} onClick={() => setSelectedRecord(record)}>
                            <div className="history-card-content">
                                <h3><span className="record-index">{index + 1}.</span> {record.is_saved && '⭐ '}{record.animal_name}</h3>
                                {/* Purane 'new Date' ki jagah naya component istemal karein */}
                                <p>Analyzed on: <FormattedTime utcTimestamp={record.timestamp} /></p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {selectedRecord && (<DetailsModal record={selectedRecord} images={selectedRecord.images} onClose={() => setSelectedRecord(null)} onStatusChange={fetchHistory} onItemDeleted={()=>{}} showSave={true} showDelete={false} showUnsave={true} />)}
        </>
    );
};
export default HistoryPage;