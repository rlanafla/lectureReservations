package org.example.reservationproject.Service;

import lombok.RequiredArgsConstructor;
import org.example.reservationproject.Dto.ReservationDTO;
import org.example.reservationproject.Entity.Reservation;
import org.example.reservationproject.Mapper.ReservationMapper;
import org.example.reservationproject.Repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;

    @Transactional
    public ReservationDTO createReservation(ReservationDTO reservationDTO) {
        // 중복 예약 체크
        reservationRepository.findByReservationDateAndTimeSlot(
            reservationDTO.getReservationDate(),
            reservationDTO.getTimeSlot()
        ).ifPresent(r -> {
            throw new RuntimeException("선택한 시간에 이미 예약이 있습니다.");
        });

        Reservation reservation = reservationMapper.toEntity(reservationDTO);
        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.toDTO(savedReservation);
    }

    @Transactional(readOnly = true)
    public List<ReservationDTO> getAllReservations() {
        return reservationRepository.findAll()
            .stream()
            .map(reservationMapper::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationDTO getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
        return reservationMapper.toDTO(reservation);
    }

    @Transactional
    public ReservationDTO updateReservation(Long id, ReservationDTO reservationDTO) {
        // 기존 예약 확인
        Reservation existingReservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));

        // 중복 예약 체크 (날짜와 시간대가 변경된 경우)
        if (!existingReservation.getReservationDate().equals(reservationDTO.getReservationDate()) ||
            !existingReservation.getTimeSlot().equals(reservationDTO.getTimeSlot())) {

            reservationRepository.findByReservationDateAndTimeSlot(
                reservationDTO.getReservationDate(),
                reservationDTO.getTimeSlot()
            ).ifPresent(r -> {
                throw new RuntimeException("선택한 시간에 이미 예약이 있습니다.");
            });
        }

        // 업데이트
        existingReservation.setName(reservationDTO.getName());
        existingReservation.setPhoneNumber(reservationDTO.getPhoneNumber());
        existingReservation.setReservationDate(reservationDTO.getReservationDate());
        existingReservation.setTimeSlot(reservationDTO.getTimeSlot());

        Reservation updatedReservation = reservationRepository.save(existingReservation);
        return reservationMapper.toDTO(updatedReservation);
    }

    @Transactional
    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));

        reservationRepository.delete(reservation);
    }
}