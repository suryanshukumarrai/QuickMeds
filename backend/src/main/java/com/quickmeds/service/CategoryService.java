package com.quickmeds.service;

import com.quickmeds.dto.AdminDtos;
import com.quickmeds.entity.Category;
import com.quickmeds.exception.BadRequestException;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.CategoryRepository;
import com.quickmeds.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final MedicineRepository medicineRepository;

    public List<AdminDtos.CategoryResponse> findAll() {
        return categoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    public AdminDtos.CategoryResponse create(AdminDtos.CategoryRequest request) {
        categoryRepository.findByNameIgnoreCase(request.getName()).ifPresent(c -> {
            throw new BadRequestException("Category name already exists");
        });

        Category saved = categoryRepository.save(
                Category.builder()
                        .name(request.getName().trim())
                        .description(request.getDescription())
                        .build()
        );
        return toResponse(saved);
    }

    public AdminDtos.CategoryResponse update(Long id, AdminDtos.CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        categoryRepository.findByNameIgnoreCase(request.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("Category name already exists");
            }
        });

        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        return toResponse(categoryRepository.save(category));
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found");
        }
        if (medicineRepository.existsByCategoryId(id)) {
            throw new BadRequestException("Category is in use by medicines");
        }
        categoryRepository.deleteById(id);
    }

    private AdminDtos.CategoryResponse toResponse(Category category) {
        return AdminDtos.CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}
