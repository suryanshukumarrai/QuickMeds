package com.quickmeds.controller;

import com.quickmeds.dto.AdminDtos;
import com.quickmeds.dto.MedicineDtos;
import com.quickmeds.dto.OrderDtos;
import com.quickmeds.dto.PrescriptionDtos;
import com.quickmeds.service.CategoryService;
import com.quickmeds.service.MedicineService;
import com.quickmeds.service.OrderService;
import com.quickmeds.service.PrescriptionService;
import com.quickmeds.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final MedicineService medicineService;
    private final PrescriptionService prescriptionService;
    private final OrderService orderService;
    private final UserService userService;
    private final CategoryService categoryService;

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

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDtos.OrderResponse>> orders() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDtos.OrderResponse> updateOrderStatus(@PathVariable Long id, @Valid @RequestBody OrderDtos.UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus()));
    }

    @GetMapping("/prescriptions")
    public ResponseEntity<List<PrescriptionDtos.PrescriptionResponse>> prescriptions() {
        return ResponseEntity.ok(prescriptionService.findAll());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminDtos.UserSummaryResponse>> users() {
        return ResponseEntity.ok(userService.findAllSummaries());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<AdminDtos.UserSummaryResponse> updateUserRole(@PathVariable Long id, @Valid @RequestBody AdminDtos.UpdateUserRoleRequest request) {
        return ResponseEntity.ok(userService.updateRole(id, request.getRole()));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<AdminDtos.CategoryResponse>> categories() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @PostMapping("/categories")
    public ResponseEntity<AdminDtos.CategoryResponse> createCategory(@Valid @RequestBody AdminDtos.CategoryRequest request) {
        return ResponseEntity.ok(categoryService.create(request));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<AdminDtos.CategoryResponse> updateCategory(@PathVariable Long id, @Valid @RequestBody AdminDtos.CategoryRequest request) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted"));
    }

    @GetMapping("/prescriptions/{id}/download")
    public ResponseEntity<Resource> downloadPrescription(@PathVariable Long id) throws Exception {
        Path filePath = prescriptionService.getPrescriptionFilePath(id);
        byte[] content = Files.readAllBytes(filePath);
        ByteArrayResource resource = new ByteArrayResource(content);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + prescriptionService.getPrescriptionOriginalFileName(id) + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(content.length)
                .body(resource);
    }

    @GetMapping("/orders/export/csv")
    public ResponseEntity<Resource> exportOrdersCsv() {
        byte[] content = orderService.exportOrdersCsv();
        ByteArrayResource resource = new ByteArrayResource(content);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"orders-report.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(content.length)
                .body(resource);
    }
}
