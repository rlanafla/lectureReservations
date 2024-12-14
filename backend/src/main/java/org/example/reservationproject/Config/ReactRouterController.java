package org.example.reservationproject.Config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReactRouterController {
    @GetMapping(value = {"/", "/listforelicemanager", "/listforelicemanagercalender"})
    public String forward() {
        return "forward:/index.html";
    }
}