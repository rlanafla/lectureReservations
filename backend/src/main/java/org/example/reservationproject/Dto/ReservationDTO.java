package org.example.reservationproject.Dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ReservationDTO {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{10,11}$", message = "Invalid phone number")
    private String phoneNumber;

    @NotBlank(message = "Date is required")
    private String reservationDate;

    @NotBlank(message = "Time slot is required")
    @Pattern(regexp = "^(AM|PM)$", message = "Time slot must be AM or PM")
    private String timeSlot;
}
