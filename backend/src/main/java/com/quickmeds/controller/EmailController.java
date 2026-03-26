package com.quickmeds.controller;

import java.util.Map;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quickmeds.service.EmailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.email.test-enabled", havingValue = "true")
public class EmailController {
    private final EmailService emailService;

    @GetMapping("/test")
    public ResponseEntity<?> sendTestEmail(
        @RequestParam String to
    ) {
        try {
            emailService.sendTestEmail(to);
            return ResponseEntity.ok(Map.of(
                    "message", "Test email sent successfully",
                    "to", to
            ));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "message", "Test email sending failed",
                    "to", to,
                    "error", ex.getMessage()
            ));
        }
    }
}
