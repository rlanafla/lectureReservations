import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Container, TextField, Typography, FormControl, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel } from '@mui/material';
import ReservationCalendar from './reservationCalender';

const ReservationManagement = () => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        reservationDate: '',
        timeSlot: 'AM',
        location: ''
    });
    const [reservedDates, setReservedDates] = useState([]);
    const [locations, setLocations] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [openResultDialog, setOpenResultDialog] = useState(false);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('http://54.180.163.230/api/reservations');
                if (Array.isArray(response.data)) {
                    setReservedDates(response.data);

                    // Extract unique locations from reservation data
                    const locationsSet = new Set(response.data.map(reservation => reservation.location));
                    setLocations([...locationsSet]);
                }
            } catch (error) {
                console.error('Failed to fetch reservation data.', error);
            }
        };

        fetchReservations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTimeSlotChange = (slot) => {
        setFormData(prev => ({
            ...prev,
            timeSlot: slot
        }));
    };

    const handleLocationChange = (event) => {
        const selectedLocation = event.target.value;
        setFormData(prev => ({
            ...prev,
            location: selectedLocation,
            reservationDate: '',
            timeSlot: 'AM'
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for reservation limits
        if (isDuplicateReservation()) {
            setDialogMessage('같은 날짜에 두 번 예약할 수 없습니다.');
            setOpenResultDialog(true);
            return;
        }

        if (hasReachedReservationLimit()) {
            setDialogMessage('세 번까지만 예약할 수 있습니다.');
            setOpenResultDialog(true);
            return;
        }

        setOpenDialog(true);
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://54.180.163.230/api/reservations', formData);
            setDialogMessage('예약이 성공하였습니다.');

            // Update local reserved dates to reflect new reservation
            setReservedDates(prev => [...prev, formData]);
        } catch (error) {
            const errorMessage = error.response?.data || '예약이 실패하였습니다.';
            setDialogMessage(errorMessage);
        }
        setOpenDialog(false);
        setOpenResultDialog(true);
    };

    const handleCancel = () => {
        setOpenDialog(false);
    };

    const handleResultDialogClose = () => {
        setOpenResultDialog(false);
        // Reset form after closing result dialog
        setFormData({
            name: '',
            phoneNumber: '',
            reservationDate: '',
            timeSlot: 'AM',
            location: ''
        });
    };

    // Check if the given date, time, and location are already reserved
    const isReserved = (date, timeSlot, location) => {
        return reservedDates.some(reservation =>
            reservation.reservationDate === date &&
            reservation.timeSlot === timeSlot &&
            reservation.location === location
        );
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            reservationDate: date,
            timeSlot: 'AM' // Reset to AM when date changes
        }));
    };

    // Form validation function
    const isFormValid = () => {
        return (
            formData.name.trim() !== '' &&
            /01[0-9]-[0-9]{3,4}-[0-9]{4}/.test(formData.phoneNumber) &&
            formData.location !== '' &&
            formData.reservationDate !== ''
        );
    };

    // Check if the user is attempting to reserve both AM and PM on the same date
    const isDuplicateReservation = () => {
        return reservedDates.some(reservation =>
            reservation.reservationDate === formData.reservationDate &&
            reservation.name === formData.name &&
            reservation.phoneNumber === formData.phoneNumber &&
            reservation.timeSlot !== formData.timeSlot
        );
    };

    // Check if the user has already made 3 reservations
    const hasReachedReservationLimit = () => {
        const userReservations = reservedDates.filter(reservation =>
            reservation.name === formData.name &&
            reservation.phoneNumber === formData.phoneNumber
        );
        return userReservations.length >= 3;
    };

    return (
        <Container maxWidth="false" sx={{ display: 'flex', flexDirection: 'row', height: '100vh', padding: 0, margin: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignContent: 'center', height: '100vh', bgcolor: '#7100ee' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <svg>
                        <image href="/elice.svg" />
                    </svg>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignContent: 'center', flex: 2, margin: 0, padding: 0 }}>
                <Box sx={{ marginX: '25%' }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            required
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            inputProps={{ pattern: "^01[0-9]-[0-9]{3,4}-[0-9]{4}$", maxLength: 13 }}
                            helperText="예시: 010-1234-5678"
                            error={formData.phoneNumber && !/01[0-9]-[0-9]{3,4}-[0-9]{4}/.test(formData.phoneNumber)}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Location</InputLabel>
                            <Select
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleLocationChange}
                                labelId="location-select-label"
                            >
                                {locations.map(location => (
                                    <MenuItem key={location} value={location}>{location}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <ReservationCalendar 
                            onDateChange={handleDateChange} 
                            reservedDates={reservedDates} 
                            location={formData.location} 
                        />
                        <FormControl fullWidth>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                {(!formData.location || !formData.reservationDate || isReserved(formData.reservationDate, 'AM', formData.location)) ? null : (
                                    <Button
                                        onClick={() => handleTimeSlotChange('AM')}
                                        sx={{
                                            borderRadius: '100px',
                                            border: '1px solid #7100ee',
                                            backgroundColor: formData.timeSlot === 'AM' ? '#7100ee' : 'transparent',
                                            color: formData.timeSlot === 'AM' ? 'white' : '#7100ee',
                                            '&:hover': {
                                                color: 'white',
                                                backgroundColor: '#7100ee'
                                            }
                                        }}
                                    >
                                        오전
                                    </Button>
                                )}
                                {(!formData.location || !formData.reservationDate || isReserved(formData.reservationDate, 'PM', formData.location)) ? null : (
                                    <Button
                                        onClick={() => handleTimeSlotChange('PM')}
                                        sx={{
                                            borderRadius: '100px',
                                            border: '1px solid #7100ee',
                                            backgroundColor: formData.timeSlot === 'PM' ? '#7100ee' : 'transparent',
                                            color: formData.timeSlot === 'PM' ? 'white' : '#7100ee',
                                            '&:hover': {
                                                color: 'white',
                                                backgroundColor: '#7100ee'
                                            }
                                        }}
                                    >
                                        오후
                                    </Button>
                                )}
                            </Box>
                        </FormControl>
                        {isFormValid() ? (
                            <Button
                                sx={{
                                    backgroundColor: '#7100ee',
                                    borderRadius: '100px',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#7100ee',
                                        color: 'white'
                                    }
                                }}
                                type="submit"
                            >
                                Reserve
                            </Button>
                        ) : null}
                    </Box>
                </Box>
            </Box>
            <Dialog open={openDialog} onClose={handleCancel}>
                <DialogTitle>예약 확인</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Confirm with the following details:
                        <br />
                        이름: {formData.name}
                        <br />
                        전화번호: {formData.phoneNumber}
                        <br />
                        장소: {formData.location}
                        <br />
                        날짜: {formData.reservationDate}
                        <br />
                        시간: {formData.timeSlot === '오전' ? '오전' : '오후'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">Cancel</Button>
                    <Button onClick={handleConfirm} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openResultDialog} onClose={handleResultDialogClose}>
                <DialogTitle>예약 결과</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleResultDialogClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ReservationManagement;
