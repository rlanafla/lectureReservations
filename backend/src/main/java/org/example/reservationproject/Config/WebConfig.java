package org.example.reservationproject.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // CORS를 적용할 경로
            .allowedOrigins("http://54.180.163.230:8080/", "http://localhost:3000")  // 허용할 출처
            .allowedMethods("GET", "POST", "PUT", "DELETE")  // 허용할 HTTP 메소드
            .allowedHeaders("*")  // 허용할 헤더
            .allowCredentials(true);  // 쿠키 전송 허용
    }
}
