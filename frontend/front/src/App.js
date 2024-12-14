import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
        <Router>
            <CssBaseline />
                <Routes>
                    <Route path="/" element={<ReservationManagement />} />
                    <Route path="/listforelicemanager" element={<ReservationList />} />
                    <Route path="/listforelicemanager/calender" element={<ReservationCalendar />} />
                </Routes>
        </Router>
    );
}

export default App;