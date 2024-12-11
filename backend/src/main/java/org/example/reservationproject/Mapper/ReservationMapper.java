package org.example.reservationproject.Mapper;

import org.example.reservationproject.Dto.ReservationDTO;
import org.example.reservationproject.Entity.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {
    public Reservation toEntity(ReservationDTO dto) {
        Reservation reservation = new Reservation();
        reservation.setName(dto.getName());
        reservation.setPhoneNumber(dto.getPhoneNumber());
        reservation.setReservationDate(dto.getReservationDate());
        reservation.setTimeSlot(dto.getTimeSlot());
        return reservation;
    }

    public ReservationDTO toDTO(Reservation entity) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setReservationDate(entity.getReservationDate());
        dto.setTimeSlot(entity.getTimeSlot());
        return dto;
    }
}