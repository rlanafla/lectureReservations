package org.example.reservationproject.Config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReactRoutingController {
    @GetMapping(value = {"/", "/listforelicemanager", "/listforelicemanager/calender"})
    public String forward() {
        return "forward:/index.html";
    }
}