package org.example.reservationproject.Entity;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reservations",
    uniqueConstraints = @UniqueConstraint(columnNames = {"reservation_date", "time_slot", "location"}))
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "reservation_date", nullable = false)
    private String reservationDate;

    @Column(name = "time_slot", nullable = false)
    private String timeSlot; // "AM" or "PM"

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}