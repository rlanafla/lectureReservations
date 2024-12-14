import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Container,
    CssBaseline
} from '@mui/material';

// Import the components
import ReservationManagement from './reservationManagement';
import ReservationList from './reservationList';
import ReservationCalendar from './reservationCalender';

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <CssBaseline />
                <Routes>
                    <Route path="/" element={<ReservationManagement />} />
                    <Route path="/listforelicemanager" element={<ReservationList />} />
                    <Route path="/listforelicemanager/calender" element={<ReservationCalendar />} />
                </Routes>
        </BrowserRouter>
    );
}

export default App;