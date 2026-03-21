package com.quickmeds.service;

import com.quickmeds.dto.PackageResponseDTO;
import com.quickmeds.entity.HealthPackage;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.HealthPackageRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HealthPackageService {
    private final HealthPackageRepository healthPackageRepository;

    public List<PackageResponseDTO> getAllPackages() {
        return healthPackageRepository.findAll().stream().map(this::toDto).toList();
    }

    public PackageResponseDTO getPackageById(Long id) {
        HealthPackage pkg = healthPackageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health package not found"));
        return toDto(pkg);
    }

    private PackageResponseDTO toDto(HealthPackage pkg) {
        return PackageResponseDTO.builder()
                .id(pkg.getId())
                .name(pkg.getName())
                .description(pkg.getDescription())
                .price(pkg.getPrice())
                .discountPercentage(pkg.getDiscountPercentage())
                .imageUrl(pkg.getImageUrl())
                .includedMedicines(pkg.getIncludedMedicines().stream()
                        .map(medicine -> PackageResponseDTO.IncludedMedicineDTO.builder()
                                .id(medicine.getId())
                                .name(medicine.getName())
                                .build())
                        .toList())
                .build();
    }
}
