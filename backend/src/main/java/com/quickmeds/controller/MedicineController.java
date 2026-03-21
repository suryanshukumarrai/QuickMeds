package com.quickmeds.controller;

import com.quickmeds.dto.MedicineDtos;
import com.quickmeds.repository.CategoryRepository;
import com.quickmeds.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MedicineController {
    private final MedicineService medicineService;
    private final CategoryRepository categoryRepository;

    @GetMapping("/api/medicines")
    public ResponseEntity<List<MedicineDtos.MedicineResponse>> medicines(@RequestParam(required = false) String search, @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(medicineService.findAll(search, categoryId));
    }

    @GetMapping("/api/medicines/{id}")
    public ResponseEntity<MedicineDtos.MedicineResponse> medicine(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.findById(id));
    }

    @GetMapping("/api/categories")
    public ResponseEntity<?> categories() {
        return ResponseEntity.ok(categoryRepository.findAll().stream().map(c -> Map.of("id", c.getId(), "name", c.getName(), "description", c.getDescription())).toList());
    }
}
