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

function App() {
    return (
        <Router>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        예약 시스템
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        새 예약
                    </Button>
                    <Button color="inherit" component={Link} to="/listforelicemanager" sx={{ display: 'none' }}>
                        예약 목록
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={<ReservationManagement />} />
                    <Route path="/listforelicemanager" element={<ReservationList />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;