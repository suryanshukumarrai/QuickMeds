package com.quickmeds.controller;

import com.quickmeds.dto.MedicineDtos;
import com.quickmeds.dto.PrescriptionDtos;
import com.quickmeds.service.MedicineService;
import com.quickmeds.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final MedicineService medicineService;
    private final PrescriptionService prescriptionService;

    @PostMapping("/medicines")
    public ResponseEntity<MedicineDtos.MedicineResponse> create(@Valid @RequestBody MedicineDtos.MedicineRequest request) {
        return ResponseEntity.ok(medicineService.create(request));
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<MedicineDtos.MedicineResponse> update(@PathVariable Long id, @Valid @RequestBody MedicineDtos.MedicineRequest request) {
        return ResponseEntity.ok(medicineService.update(id, request));
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        medicineService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Medicine deleted"));
    }

    @PutMapping("/prescriptions/{id}/validate")
    public ResponseEntity<PrescriptionDtos.PrescriptionResponse> validate(@PathVariable Long id, @Valid @RequestBody PrescriptionDtos.ValidatePrescriptionRequest request) {
        return ResponseEntity.ok(prescriptionService.validate(id, request.getValidated()));
    }
}
