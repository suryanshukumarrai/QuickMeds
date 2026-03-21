package com.quickmeds.service;

import com.quickmeds.dto.PrescriptionDtos;
import com.quickmeds.entity.Prescription;
import com.quickmeds.entity.User;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.PrescriptionRepository;
import com.quickmeds.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;

    @Value("${app.upload-dir}")
    private String uploadDir;

    public PrescriptionDtos.PrescriptionResponse upload(String username, MultipartFile file) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        try {
            Path dir = Paths.get(uploadDir).toAbsolutePath();
            Files.createDirectories(dir);
            String generated = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path target = dir.resolve(generated);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            Prescription p = prescriptionRepository.save(Prescription.builder().user(user).fileName(file.getOriginalFilename()).filePath(target.toString()).validated(false).uploadedAt(LocalDateTime.now()).build());
            return toResponse(p);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload prescription", e);
        }
    }

    public List<PrescriptionDtos.PrescriptionResponse> mine(String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return prescriptionRepository.findByUserOrderByUploadedAtDesc(user).stream().map(this::toResponse).toList();
    }

    public List<PrescriptionDtos.PrescriptionResponse> findAll() {
        return prescriptionRepository.findAllByOrderByUploadedAtDesc().stream().map(this::toResponse).toList();
    }

    public PrescriptionDtos.PrescriptionResponse validate(Long id, Boolean validated) {
        Prescription p = prescriptionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
        p.setValidated(validated);
        Prescription saved = prescriptionRepository.save(p);
        if (Boolean.FALSE.equals(validated)) {
            orderService.cancelOrdersByRejectedPrescription(
                    saved.getId(),
                    "Cancelled due to prescription rejection by admin"
            );
        }
        return toResponse(saved);
    }

    public Path getPrescriptionFilePath(Long id) {
        Prescription p = prescriptionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
        return Paths.get(p.getFilePath());
    }

    public String getPrescriptionOriginalFileName(Long id) {
        Prescription p = prescriptionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
        return p.getFileName();
    }

    private PrescriptionDtos.PrescriptionResponse toResponse(Prescription p) {
        return PrescriptionDtos.PrescriptionResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .userEmail(p.getUser().getEmail())
                .userFullName(p.getUser().getFullName())
                .fileName(p.getFileName())
                .validated(p.getValidated())
                .uploadedAt(p.getUploadedAt())
                .build();
    }
}
