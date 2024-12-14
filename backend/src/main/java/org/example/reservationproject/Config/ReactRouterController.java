package org.example.reservationproject.Config;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.reservationproject.Dto.ReservationDTO;
import org.example.reservationproject.Service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Controller
public class ReactRoutingController {
    @GetMapping(value = {"/", "/listforelicemanager", "/listforelicemanager/calender"})
    public String forward() {
        return "forward:/index.html";
    }
}