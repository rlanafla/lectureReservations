import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, 
    Typography, 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert
} from '@mui/material';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [message, setMessage] = useState({
        text: '',
        type: 'success'
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        reservationId: null
    });

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://54.180.163.230:8080/api/reservations');
            setReservations(response.data);
        } catch (error) {
            setMessage({
                text: '예약 목록을 불러오는 데 실패했습니다.',
                type: 'error'
            });
        }
    };

    const handleDeleteClick = (reservationId) => {
        setDeleteConfirmation({
            open: true,
            reservationId: reservationId
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://54.180.163.230:8080/api/reservations/${deleteConfirmation.reservationId}`);
            
            setMessage({
                text: '예약이 성공적으로 삭제되었습니다.',
                type: 'success'
            });
            
            // 목록 새로고침
            fetchReservations();
            
            // 삭제 확인 대화상자 닫기
            setDeleteConfirmation({
                open: false,
                reservationId: null
            });
        } catch (error) {
            setMessage({
                text: '예약 삭제에 실패했습니다.',
                type: 'error'
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmation({
            open: false,
            reservationId: null
        });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            {message.text && (
                <Box sx={{ width: '100%', maxWidth: 800, mb: 2 }}>
                    <Alert severity={message.type}>
                        {message.text}
                    </Alert>
                </Box>
            )}

            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                예약 목록
            </Typography>

            <TableContainer component={Paper} sx={{ maxWidth: 800, width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>이름</TableCell>
                            <TableCell>전화번호</TableCell>
                            <TableCell>날짜</TableCell>
                            <TableCell>시간대</TableCell>
                            <TableCell>액션</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((reservation) => (
                            <TableRow key={reservation.id}>
                                <TableCell>{reservation.id}</TableCell>
                                <TableCell>{reservation.name}</TableCell>
                                <TableCell>{reservation.phoneNumber}</TableCell>
                                <TableCell>{reservation.reservationDate}</TableCell>
                                <TableCell>{reservation.timeSlot}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteClick(reservation.id)}
                                    >
                                        삭제
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={deleteConfirmation.open}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>예약 삭제 확인</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        정말로 이 예약을 삭제하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        삭제
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReservationList;