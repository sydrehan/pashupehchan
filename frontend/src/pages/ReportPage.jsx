// File Path: frontend/src/pages/ReportPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import axios from 'axios';
import Loader from '../components/Loader';
import DetailsModal from '../components/DetailsModal';
import FormattedTime from '../components/FormattedTime'; // Naya component import karein
import { API_URL } from '../IP_CONFIG.js';

const parseResult = (text, key) => { if (typeof text !== 'string') return 'N/A'; const regex = new RegExp(`${key}:\\s*(.*)`, "i"); const match = text.match(regex); return match ? match[1].trim() : 'N/A'; };
const ReportPage = () => {
    const { user } = useContext(AppContext); const [history, setHistory] = useState([]); const [isLoading, setIsLoading] = useState(true); const [selectedRecord, setSelectedRecord] = useState(null);
    const fetchHistory = async () => { if (!user) return; setIsLoading(true); try { const response = await axios.get(`${API_URL}/history/${user.id}`); setHistory(response.data); } catch (error) { console.error("Failed to fetch history:", error); } finally { setIsLoading(false); } };
    useEffect(() => { fetchHistory(); }, [user]);
    const handleDelete = async (recordId, event) => { event.stopPropagation(); if (window.confirm("Are you sure?")) { try { await axios.delete(`${API_URL}/history/delete/${recordId}`); setHistory(currentHistory => currentHistory.filter(rec => rec.id !== recordId)); } catch (error) { alert("Could not delete."); } } };
    if (isLoading) return <Loader message="Generating report..." />;

    return (
        <div className="report-container">
            <h2>Complete Identification Report</h2>
            <p>This report summarizes all identified animals. Click a row for details.</p>
            <div className="report-table-wrapper">
                {history.length > 0 ? (
                    <table className="report-table">
                        <thead><tr><th>No.</th><th>Photo</th><th>Animal Details</th><th>Date & Time</th><th>Location</th><th>Action</th></tr></thead>
                        <tbody>
                            {history.map((record, index) => (
                                <tr key={record.id} onClick={() => setSelectedRecord(record)}>
                                    <td>{index + 1}</td>
                                    <td><img src={`${API_URL}${record.images.front}`} alt={record.animal_name} className="report-image-preview" /></td>
                                    <td><strong>{record.animal_name}</strong><br/><small>Gender: {parseResult(record.breed_result, 'Breed Gender')}</small></td>
                                    {/* Purane 'new Date' ki jagah naya component istemal karein */}
                                    <td><FormattedTime utcTimestamp={record.timestamp} /></td>
                                    <td>{record.latitude ? (<a href={`https://...`} target="_blank" rel="noopener noreferrer" className="map-link" onClick={(e) => e.stopPropagation()}>View Map</a>) : "N/A"}</td>
                                    <td><button className="icon-btn delete-btn" onClick={(event) => handleDelete(record.id, event)}>&#128465;</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (<p>No history found to generate a report.</p>)}
            </div>
            {selectedRecord && (<DetailsModal record={selectedRecord} images={selectedRecord.images} onClose={() => setSelectedRecord(null)} onStatusChange={fetchHistory} onItemDeleted={fetchHistory} showSave={true} showUnsave={true} showDelete={true} />)}
        </div>
    );
};
export default ReportPage;