import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, 
    Typography, 
    Paper, 
    Alert, 
    Button 
} from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 캘린더 기본 스타일
import moment from 'moment';

const ReservationCalendar = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dailyReservations, setDailyReservations] = useState([]);
    const [message, setMessage] = useState({
        text: '',
        type: 'success'
    });
    const [newReservation, setNewReservation] = useState({
        name: '',
        phoneNumber: '',
        timeSlot: '',
    });
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        filterReservationsByDate(selectedDate);
    }, [reservations, selectedDate]);

    useEffect(() => {
        // 모든 필드가 채워져야 버튼 활성화
        const { name, phoneNumber, timeSlot } = newReservation;
        setIsValid(name.trim() && phoneNumber.trim() && timeSlot.trim());
    }, [newReservation]);

    
    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://54.180.163.230/api/reservations');
            setReservations(response.data);
        } catch (error) {
            setMessage({
                text: '예약 데이터를 불러오는 데 실패했습니다.',
                type: 'error'
            });
        }
    };

    const filterReservationsByDate = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const filtered = reservations.filter(
            (res) => res.reservationDate === formattedDate
        );
        setDailyReservations(filtered);
    };

    const onDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            {message.text && (
                <Box sx={{ width: '100%', maxWidth: 800, mb: 2 }}>
                    <Alert severity={message.type}>
                        {message.text}
                    </Alert>
                </Box>
            )}

            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                예약 캘린더
            </Typography>

            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Calendar
                    onChange={onDateChange}
                    value={selectedDate}
                    tileContent={({ date, view }) => {
                        const formattedDate = moment(date).format('YYYY-MM-DD');
                        const hasReservation = reservations.some(
                            (res) => res.reservationDate === formattedDate
                        );
                        return hasReservation ? (
                            <div style={{ color: 'red', fontSize: '0.8rem' }}>예약 있음</div>
                        ) : null;
                    }}
                />
                <Paper
                    elevation={3}
                    sx={{
                        padding: 2,
                        width: 400,
                        minHeight: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography variant="h6">
                        {moment(selectedDate).format('YYYY년 MM월 DD일')} 예약 목록
                    </Typography>
                    {dailyReservations.length > 0 ? (
                        dailyReservations.map((reservation) => (
                            <Box
                                key={reservation.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    borderBottom: '1px solid #ddd',
                                    padding: '8px 0',
                                }}
                            >
                                <Typography>
                                    {reservation.name} ({reservation.timeSlot})
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => console.log('예약 삭제:', reservation.id)}
                                >
                                    삭제
                                </Button>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            예약이 없습니다.
                        </Typography>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default ReservationCalendar;
