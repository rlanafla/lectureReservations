package org.example.reservationproject.Repository;

import org.example.reservationproject.Entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByReservationDateAndTimeSlotAndLocation(String date, String timeSlot, String location);
}