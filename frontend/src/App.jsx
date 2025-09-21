// File Path: frontend/src/App.jsx (FINAL, COMPLETE, WITH REPORT PAGE ROUTE)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Sabhi zaroori context aur components ko import karein
import { AppProvider, AppContext } from './contexts/AppContext';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import SingleUploaderPage from './components/SingleUploaderPage';

// Sabhi pages ko import karein
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import SavedItemsPage from './pages/SavedItemsPage';
import HelpPage from './pages/HelpPage';
import SettingsPage from './pages/SettingsPage';
import ConfirmPage from './pages/ConfirmPage';
import ReportPage from './pages/ReportPage'; // Report page ka naya import

// Main stylesheet
import './App.css';

// Yeh component check karta hai ki user logged in hai ya nahi
const PrivateRoute = ({ children }) => {
    const { user } = React.useContext(AppContext);
    return user ? children : <Navigate to="/profile" />;
};
// Yeh component user ko login ke baad profile page par jaane se rokta hai
const PublicRoute = ({ children }) => {
    const { user } = React.useContext(AppContext);
    return !user ? children : <Navigate to="/upload/front" />;
};

const AppContent = () => {
  const { user } = React.useContext(AppContext);

  return (
    <Router>
        <div className="app-container">
            {/* User ke login hone par hi Header aur BottomNav dikhayein */}
            {user && <Header title="PashuPehchan" />}
            
            <main className="page-content">
                <Routes>
                    {/* Public route sirf profile page ke liye */}
                    <Route path="/profile" element={<PublicRoute><ProfilePage /></PublicRoute>} />
                    
                    {/* Private routes (login zaroori hai) */}
                    
                    {/* Default path "/" ab automatic wizard ke pehle step par le jayega */}
                    <Route path="/" element={<PrivateRoute><Navigate to="/upload/front" /></PrivateRoute>} />

                    {/* Aapka Naya 5-Page Upload Wizard */}
                    <Route path="/upload/front" element={<PrivateRoute><SingleUploaderPage side="Front View" nextStepUrl="/upload/back" /></PrivateRoute>} />
                    <Route path="/upload/back"  element={<PrivateRoute><SingleUploaderPage side="Back View"  nextStepUrl="/upload/left" /></PrivateRoute>} />
                    <Route path="/upload/left"  element={<PrivateRoute><SingleUploaderPage side="Left View"  nextStepUrl="/upload/right" /></PrivateRoute>} />
                    <Route path="/upload/right" element={<PrivateRoute><SingleUploaderPage side="Right View" nextStepUrl="/confirm" /></PrivateRoute>} />
                    <Route path="/confirm"     element={<PrivateRoute><ConfirmPage /></PrivateRoute>} />

                    {/* Baaki sabhi pages */}
                    <Route path="/history"  element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
                    <Route path="/saved"    element={<PrivateRoute><SavedItemsPage /></PrivateRoute>} />

                    {/* NAYA REPORT PAGE KA ROUTE YAHAN HAI */}
                    <Route path="/report"   element={<PrivateRoute><ReportPage /></PrivateRoute>} />

                    <Route path="/help"     element={<PrivateRoute><HelpPage /></PrivateRoute>} />
                    <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
                    
                    {/* Koi anjaan URL daalne par user ko sahi jagah bhejein */}
                    <Route path="*" element={<Navigate to={user ? "/upload/front" : "/profile"} />} />
                </Routes>
            </main>

            {user && <BottomNav />}
        </div>
    </Router>
  );
}

// Main App component
const App = () => (
    <AppProvider>
        <AppContent />
    </AppProvider>
);

export default App;