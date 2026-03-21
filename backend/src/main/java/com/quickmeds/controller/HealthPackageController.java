package com.quickmeds.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quickmeds.dto.PackageResponseDTO;
import com.quickmeds.service.HealthPackageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class HealthPackageController {
    private final HealthPackageService healthPackageService;

    @GetMapping
    public ResponseEntity<List<PackageResponseDTO>> getAllPackages() {
        return ResponseEntity.ok(healthPackageService.getAllPackages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackageResponseDTO> getPackageById(@PathVariable Long id) {
        return ResponseEntity.ok(healthPackageService.getPackageById(id));
    }
}
