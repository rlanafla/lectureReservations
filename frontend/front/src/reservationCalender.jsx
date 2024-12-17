import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import './calenderStyle.css';

const ReservationCalendar = ({ onDateChange, reservedDates = [], location }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // 장소 선택 여부 확인
    const isLocationSelected = location && location.trim() !== '';

    const getReservationStatus = (date) => {
        // 장소 미선택 시 기본 상태 반환
        if (!isLocationSelected) {
            return {
                morning: '',
                afternoon: '',
                isFullyBooked: true
            };
        }

        const formattedDate = moment(date).format('YYYY-MM-DD');

        // 특정 장소, 날짜의 모든 예약 필터링
        const dayReservations = reservedDates.filter(
            (res) => res.reservationDate === formattedDate && 
                     res.location === location
        );

        // 오전, 오후 예약 상태 확인
        const morningReservation = dayReservations.some(res => res.timeSlot === 'AM');
        const afternoonReservation = dayReservations.some(res => res.timeSlot === 'PM');

        return {
            morning: morningReservation ? '불가능' : '가능',
            afternoon: afternoonReservation ? '불가능' : '가능',
            isFullyBooked: morningReservation && afternoonReservation
        };
    };

    const tileDisabled = ({ date, view }) => {
        // 과거 날짜 비활성화
        if (view === 'month' && date < new Date().setHours(0, 0, 0, 0)) {
            return true;
        }

        // 주말 비활성화
        if (view === 'month' && (date.getDay() === 0 || date.getDay() === 6)) {
            return true;
        }

        // 장소 미선택 시 모든 날짜 비활성화
        if (!isLocationSelected) {
            return true;
        }

        // 완전히 예약된 날짜 비활성화
        const { isFullyBooked } = getReservationStatus(date);
        return isFullyBooked;
    };

    // 장소 미선택 시 null 반환하여 캘린더 숨기기
    if (!isLocationSelected) {
        return (
            <Box sx={{ 
                textAlign: 'center', 
                color: 'red', 
                marginBottom: 2 
            }}>
                <Typography variant="body1">
                    예약을 진행하려면 먼저 장소를 선택해주세요.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center'}}>
                <Calendar
                    onChange={(date) => {
                        if (!tileDisabled({ date })) {
                            setSelectedDate(date);
                            onDateChange(moment(date).format('YYYY-MM-DD'));
                        }
                    }}
                    value={selectedDate}
                    tileContent={({ date }) => {
                        const { morning, afternoon, isFullyBooked } = getReservationStatus(date);
                        return (
                            <div style={{ 
                                fontSize: '0.8rem', 
                                opacity: isFullyBooked ? 0.5 : 1 
                            }}>
                                <div style={{ 
                                    color: morning === '불가능' ? 'red' : 'green',
                                    fontWeight: morning === '불가능' ? 'bold' : 'normal'
                                }}>
                                    {morning}
                                </div>
                                <div style={{ 
                                    color: afternoon === '불가능' ? 'red' : 'green',
                                    fontWeight: afternoon === '불가능' ? 'bold' : 'normal'
                                }}>
                                    {afternoon}
                                </div>
                            </div>
                        );
                    }}
                    tileDisabled={tileDisabled}
                    tileClassName={({ date }) => {
                        const { isFullyBooked } = getReservationStatus(date);
                        return isFullyBooked ? 'fully-booked' : '';
                    }}
                />
            </Box>
        </Box>
    );
};

export default ReservationCalendar;