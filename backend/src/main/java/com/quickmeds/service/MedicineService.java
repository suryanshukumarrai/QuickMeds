package com.quickmeds.service;

import com.quickmeds.dto.MedicineDtos;
import com.quickmeds.entity.Category;
import com.quickmeds.entity.Medicine;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.CategoryRepository;
import com.quickmeds.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {
    private final MedicineRepository medicineRepository;
    private final CategoryRepository categoryRepository;

    public List<MedicineDtos.MedicineResponse> findAll(String search, Long categoryId) {
        List<Medicine> medicines;
        if (search != null && !search.isBlank() && categoryId != null) medicines = medicineRepository.findByNameContainingIgnoreCaseAndCategoryId(search, categoryId);
        else if (search != null && !search.isBlank()) medicines = medicineRepository.findByNameContainingIgnoreCase(search);
        else if (categoryId != null) medicines = medicineRepository.findByCategoryId(categoryId);
        else medicines = medicineRepository.findAll();
        return medicines.stream().map(this::toResponse).toList();
    }

    public MedicineDtos.MedicineResponse findById(Long id) {
        return toResponse(medicineRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Medicine not found")));
    }

    public MedicineDtos.MedicineResponse create(MedicineDtos.MedicineRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Medicine medicine = Medicine.builder().name(request.getName()).description(request.getDescription()).price(request.getPrice()).stock(request.getStock()).requiresPrescription(request.getRequiresPrescription()).imageUrl(request.getImageUrl()).category(category).build();
        return toResponse(medicineRepository.save(medicine));
    }

    public MedicineDtos.MedicineResponse update(Long id, MedicineDtos.MedicineRequest request) {
        Medicine medicine = medicineRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Medicine not found"));
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        medicine.setName(request.getName());
        medicine.setDescription(request.getDescription());
        medicine.setPrice(request.getPrice());
        medicine.setStock(request.getStock());
        medicine.setRequiresPrescription(request.getRequiresPrescription());
        medicine.setImageUrl(request.getImageUrl());
        medicine.setCategory(category);
        return toResponse(medicineRepository.save(medicine));
    }

    public void delete(Long id) {
        if (!medicineRepository.existsById(id)) throw new ResourceNotFoundException("Medicine not found");
        medicineRepository.deleteById(id);
    }

    private MedicineDtos.MedicineResponse toResponse(Medicine medicine) {
        return MedicineDtos.MedicineResponse.builder().id(medicine.getId()).name(medicine.getName()).description(medicine.getDescription()).price(medicine.getPrice()).stock(medicine.getStock()).requiresPrescription(medicine.getRequiresPrescription()).imageUrl(medicine.getImageUrl()).categoryId(medicine.getCategory().getId()).categoryName(medicine.getCategory().getName()).build();
    }
}
