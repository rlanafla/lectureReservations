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
    Button,
    MenuItem,
    FormControl,
    Select,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert
} from '@mui/material';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [locations, setLocations] = useState([]); // 장소 목록
    const [selectedLocation, setSelectedLocation] = useState(''); // 선택된 장소
    const [message, setMessage] = useState({ text: '', type: 'success' });
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        open: false,
        reservationId: null
    });

    useEffect(() => {
        fetchReservations();
    }, []);

    // 예약 데이터 가져오기
    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://54.180.163.230/api/reservations');
            const data = response.data;

            setReservations(data);
            extractLocations(data); // 장소 목록 추출
            setFilteredReservations(data); // 초기 상태에 전체 리스트 보여주기
        } catch (error) {
            setMessage({
                text: '예약 목록을 불러오는 데 실패했습니다.',
                type: 'error'
            });
        }
    };

    // 장소 목록 추출
    const extractLocations = (data) => {
        const uniqueLocations = [...new Set(data.map((res) => res.location))];
        setLocations(uniqueLocations);
    };

    // 삭제 버튼 클릭 시
    const handleDeleteClick = (reservationId) => {
        setDeleteConfirmation({
            open: true,
            reservationId: reservationId
        });
    };

    // 삭제 확인
    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://54.180.163.230/api/reservations/${deleteConfirmation.reservationId}`);
            setMessage({
                text: '예약이 성공적으로 삭제되었습니다.',
                type: 'success'
            });
            fetchReservations();
            setDeleteConfirmation({ open: false, reservationId: null });
        } catch (error) {
            setMessage({
                text: '예약 삭제에 실패했습니다.',
                type: 'error'
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmation({ open: false, reservationId: null });
    };

    // 장소 변경 시 필터링
    const handleLocationChange = (event) => {
        const location = event.target.value;
        setSelectedLocation(location);

        if (location) {
            const filtered = reservations.filter((res) => res.location === location);
            setFilteredReservations(filtered);
        } else {
            setFilteredReservations(reservations);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            {message.text && (
                <Box sx={{ width: '100%', maxWidth: 800, mb: 2 }}>
                    <Alert severity={message.type}>{message.text}</Alert>
                </Box>
            )}

            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                예약 목록
            </Typography>

            {/* 장소 선택 드롭다운 */}
            <FormControl sx={{ mb: 2, minWidth: 200 }}>
                <Select
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>전체</em>
                    </MenuItem>
                    {locations.map((location, index) => (
                        <MenuItem key={index} value={location}>
                            {location}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* 예약 테이블 */}
            <TableContainer component={Box} sx={{ maxWidth: 800, width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>이름</TableCell>
                            <TableCell>전화번호</TableCell>
                            <TableCell>날짜</TableCell>
                            <TableCell>시간대</TableCell>
                            <TableCell>장소</TableCell>
                            <TableCell>액션</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReservations.map((reservation) => (
                            <TableRow key={reservation.id}>
                                <TableCell>{reservation.id}</TableCell>
                                <TableCell>{reservation.name}</TableCell>
                                <TableCell>{reservation.phoneNumber}</TableCell>
                                <TableCell>{reservation.reservationDate}</TableCell>
                                <TableCell>{reservation.timeSlot}</TableCell>
                                <TableCell>{reservation.location}</TableCell>
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

            {/* 삭제 확인 다이얼로그 */}
            <Dialog open={deleteConfirmation.open} onClose={handleDeleteCancel}>
                <DialogTitle>예약 삭제 확인</DialogTitle>
                <DialogContent>
                    <DialogContentText>정말로 이 예약을 삭제하시겠습니까?</DialogContentText>
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
