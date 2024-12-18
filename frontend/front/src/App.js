import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
    CssBaseline
} from '@mui/material';

// Import the components
import ReservationManagement from './reservationManagement';
import ReservationList from './reservationList';
import ReservationCalender from './reservationCalender';
import './App.css';

function App() {
    return (
        <>
            <CssBaseline/>
            <Routes>
                <Route path="/" element={<ReservationManagement />} />
                <Route path="/listforelicemanager" element={<ReservationList />} />
                <Route path="/listforelicemanagercalender" element={<ReservationCalender />} />
            </Routes>
        </>
    );
}

export default App;