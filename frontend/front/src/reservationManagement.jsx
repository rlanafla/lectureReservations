import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, 
    Button, 
    Container, 
    TextField, 
    Typography, 
    FormControl, 
    Alert, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle
} from '@mui/material';
import MainSide from './mainSide';

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
    const [openDialog, setOpenDialog] = useState(false); // Dialog 열기 상태
    const [dialogMessage, setDialogMessage] = useState(''); // Dialog에 표시할 메시지
    const [openResultDialog, setOpenResultDialog] = useState(false);



    useEffect(() => {
        // 예약 데이터를 서버에서 가져옵니다
        const fetchReservations = async () => {
            try {
                const response = await axios.get('http://54.180.163.230/api/reservations');
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
        setOpenDialog(true);
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        setOpenResultDialog(true);
        try {
            const response = await axios.post('http://54.180.163.230/api/reservations', formData);
            setDialogMessage('예약이 성공적으로 완료되었습니다.'); // 예약 성공 메시지 설정
        } catch (error) {
            const errorMessage = error.response?.data || '예약에 실패했습니다.';
            setDialogMessage(errorMessage); // 예약 실패 메시지 설정
        }
        setOpenDialog(false);
        setOpenResultDialog(true);
    };
    

    const handleCancel = () => {
        setOpenDialog(false); // Dialog 닫기
    };

    const handleResultDialogClose = () => {
        setOpenResultDialog(false);
    }


    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const isReserved = (date, timeSlot) => {
        return reservedDates.some(reservation => reservation.reservationDate === date && reservation.timeSlot === timeSlot);
    };

    return (
        <Container maxWidth="lg" sx={{display: 'flex', flexDirection: 'row', height: '100vh'}}>
            <Box sx = {{display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignContent: 'center', height: '100vh'}}>
                <MainSide />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignContent: 'center', flex: 1}}>
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    강사 예약
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
                        inputProps={{
                            pattern: "^01[0-9]-[0-9]{3,4}-[0-9]{4}$",
                            maxLength: 13
                        }}
                        helperText="예: 010-1234-5678"
                        error={formData.phoneNumber && !/01[0-9]-[0-9]{3,4}-[0-9]{4}/.test(formData.phoneNumber)}
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
                        disabled={
                            !formData.name || 
                            !formData.phoneNumber || 
                            !formData.reservationDate || 
                            isReserved(formData.reservationDate, formData.timeSlot)
                        }
                    >
                        예약
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

            <Dialog open={openDialog} onClose={handleCancel}>
                <DialogTitle>예약 확인</DialogTitle>
                <DialogContent sx={{width : '400px', justifyContent: 'center', alignContent: 'center'}}>
                    <Box sx={{ mb: 1 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>이름:</Typography> {formData.name}
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>전화번호:</Typography> {formData.phoneNumber}
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>날짜:</Typography> {formData.reservationDate}
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>시간:</Typography> {formData.timeSlot === 'AM' ? '오전' : '오후'}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openResultDialog} onClose={handleResultDialogClose}>
                <DialogTitle>예약 결과</DialogTitle>
                <DialogContent>
                    <Typography>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleResultDialogClose} color="primary">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>


            
        </Container>
    );
};

export default ReservationManagement;
