import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, 
    Button, 
    Container, 
    TextField, 
    Typography, 
    FormControl, 
    Alert
} from '@mui/material';

const ReservationManagement = () => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        reservationDate: '',
        timeSlot: 'AM'
    });
    const [message, setMessage] = useState({
        text: '',
        type: 'success'
    });
    const [reservedDates, setReservedDates] = useState([]); // 예약된 날짜와 시간 정보를 저장할 상태

    useEffect(() => {
        // 예약 데이터를 서버에서 가져옵니다
        const fetchReservations = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/reservations');
                if (Array.isArray(response.data)) {
                    setReservedDates(response.data); // 예약된 날짜와 시간 정보를 상태에 저장
                }
            } catch (error) {
                console.error('예약 정보를 가져오는 데 실패했습니다.', error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/reservations', formData);
            setMessage({
                text: '예약이 성공적으로 완료되었습니다.',
                type: 'success'
            });
            // 폼 초기화
            setFormData({
                name: '',
                phoneNumber: '',
                reservationDate: '',
                timeSlot: 'AM'
            });
        } catch (error) {
            const errorMessage = error.response?.data || '예약에 실패했습니다.';
            setMessage({
                text: errorMessage,
                type: 'error'
            });
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // 예약이 이미 되어있는 날짜와 시간대인지 확인하는 함수
    const isReserved = (date, timeSlot) => {
        return reservedDates.some(reservation => reservation.reservationDate === date && reservation.timeSlot === timeSlot);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    새 예약 생성
                </Typography>

                <Box 
                    component="form" 
                    onSubmit={handleSubmit} 
                    sx={{ 
                        width: '100%', 
                        maxWidth: 500, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2 
                    }}
                >
                    <TextField
                        required
                        fullWidth
                        label="이름"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        fullWidth
                        label="전화번호"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        fullWidth
                        label="날짜"
                        type="date"
                        name="reservationDate"
                        InputLabelProps={{ shrink: true }}
                        value={formData.reservationDate}
                        onChange={handleChange}
                        inputProps={{
                            min: getTodayDate() // 오늘 날짜 이전 선택 못 하게 설정
                        }}
                    />
                    <FormControl fullWidth>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant={formData.timeSlot === 'AM' ? 'contained' : 'outlined'}
                                color="primary"
                                onClick={() => handleTimeSlotChange('AM')}
                                disabled={isReserved(formData.reservationDate, 'AM')}
                                sx={{
                                    backgroundColor: formData.timeSlot === 'AM' ? '#1976d2' : 'transparent',
                                    color: formData.timeSlot === 'AM' ? 'white' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: formData.timeSlot === 'AM' ? '#1565c0' : '#e3f2fd'
                                    }
                                }}
                            >
                                오전
                            </Button>
                            <Button
                                variant={formData.timeSlot === 'PM' ? 'contained' : 'outlined'}
                                color="primary"
                                onClick={() => handleTimeSlotChange('PM')}
                                disabled={isReserved(formData.reservationDate, 'PM')}
                                sx={{
                                    backgroundColor: formData.timeSlot === 'PM' ? '#1976d2' : 'transparent',
                                    color: formData.timeSlot === 'PM' ? 'white' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: formData.timeSlot === 'PM' ? '#1565c0' : '#e3f2fd'
                                    }
                                }}
                            >
                                오후
                            </Button>
                        </Box>
                    </FormControl>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                    >
                        생성
                    </Button>
                </Box>

                {message.text && (
                    <Box sx={{ width: '100%', maxWidth: 500, mt: 2 }}>
                        <Alert severity={message.type}>
                            {message.text}
                        </Alert>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default ReservationManagement;
