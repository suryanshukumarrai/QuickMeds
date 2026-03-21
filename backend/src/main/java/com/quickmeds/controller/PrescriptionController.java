package com.quickmeds.controller;

import com.quickmeds.dto.PrescriptionDtos;
import com.quickmeds.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {
    private final PrescriptionService prescriptionService;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<PrescriptionDtos.PrescriptionResponse> upload(Authentication authentication, @RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(prescriptionService.upload(authentication.getName(), file));
    }

    @GetMapping
    public ResponseEntity<?> mine(Authentication authentication) {
        return ResponseEntity.ok(prescriptionService.mine(authentication.getName()));
    }
}
