import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box,
    Container,
    CssBaseline
} from '@mui/material';

// Import the components
import ReservationManagement from './reservationManagement';
import ReservationList from './reservationList';
import ReservationCalender from './reservationCalender';
import './App.css';

function App() {
    return (
            <BrowserRouter basename="/">
                <CssBaseline/>
                    <Routes>
                        <Route path="/" element={<ReservationManagement />} />
                        <Route path="/listforelicemanager" element={<ReservationList />} />
                        <Route path="/listforelicemanagercalender" element={<ReservationCalender />} />
                    </Routes>
            </BrowserRouter>

    );
}

export default App;