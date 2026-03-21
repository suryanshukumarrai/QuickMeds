package com.quickmeds.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.quickmeds.dto.MedicineDtos;
import com.quickmeds.entity.Category;
import com.quickmeds.entity.Medicine;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.CategoryRepository;
import com.quickmeds.repository.MedicineRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MedicineService {
    private static final Logger log = LoggerFactory.getLogger(MedicineService.class);

    private final MedicineRepository medicineRepository;
    private final CategoryRepository categoryRepository;
    private final JdbcTemplate jdbcTemplate;

    public List<MedicineDtos.MedicineResponse> findAll(String search, Long categoryId) {
        if (hasImportedMedicineRows()) {
            List<MedicineDtos.MedicineResponse> importedRows = findAllFromImportedTable(search, categoryId);
            log.info("Fetched {} medicines from imported table `medicine` (search={}, categoryId={})", importedRows.size(), search, categoryId);
            return importedRows;
        }

        List<Medicine> medicines;
        if (search != null && !search.isBlank() && categoryId != null) medicines = medicineRepository.findByNameContainingIgnoreCaseAndCategoryId(search, categoryId);
        else if (search != null && !search.isBlank()) medicines = medicineRepository.findByNameContainingIgnoreCase(search);
        else if (categoryId != null) medicines = medicineRepository.findByCategoryId(categoryId);
        else medicines = medicineRepository.findAll();

        List<MedicineDtos.MedicineResponse> rows = medicines.stream().map(this::toResponse).toList();
        log.info("Fetched {} medicines from entity table `medicines` (search={}, categoryId={})", rows.size(), search, categoryId);
        return rows;
    }

    public MedicineDtos.MedicineResponse findById(Long id) {
        if (hasImportedMedicineRows()) {
            MedicineDtos.MedicineResponse imported = findByIdFromImportedTable(id);
            if (imported != null) {
                return imported;
            }
        }
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

    private boolean hasImportedMedicineRows() {
        try {
            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM medicine", Integer.class);
            return count != null && count > 0;
        } catch (DataAccessException ex) {
            return false;
        }
    }

    private List<MedicineDtos.MedicineResponse> findAllFromImportedTable(String search, Long categoryId) {
        StringBuilder sql = new StringBuilder("SELECT id, name, description, price_inr, stock, requires_prescription, category FROM medicine WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (search != null && !search.isBlank()) {
            sql.append(" AND LOWER(name) LIKE ?");
            params.add("%" + search.toLowerCase() + "%");
        }

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            sql.append(" AND category = ?");
            params.add(category.getName());
        }

        sql.append(" ORDER BY id");

        return jdbcTemplate.query(sql.toString(), params.toArray(), (rs, rowNum) -> MedicineDtos.MedicineResponse.builder()
                .id(rs.getLong("id"))
                .name(rs.getString("name"))
                .description(rs.getString("description"))
                .price(BigDecimal.valueOf(rs.getInt("price_inr")))
                .stock(rs.getInt("stock"))
                .requiresPrescription(rs.getBoolean("requires_prescription"))
                .imageUrl(null)
                .categoryName(rs.getString("category"))
                .categoryId(categoryRepository.findByName(rs.getString("category")).map(Category::getId).orElse(null))
                .build());
    }

    private MedicineDtos.MedicineResponse findByIdFromImportedTable(Long id) {
        List<MedicineDtos.MedicineResponse> result = jdbcTemplate.query(
                "SELECT id, name, description, price_inr, stock, requires_prescription, category FROM medicine WHERE id = ?",
                (rs, rowNum) -> MedicineDtos.MedicineResponse.builder()
                        .id(rs.getLong("id"))
                        .name(rs.getString("name"))
                        .description(rs.getString("description"))
                        .price(BigDecimal.valueOf(rs.getInt("price_inr")))
                        .stock(rs.getInt("stock"))
                        .requiresPrescription(rs.getBoolean("requires_prescription"))
                        .imageUrl(null)
                        .categoryName(rs.getString("category"))
                        .categoryId(categoryRepository.findByName(rs.getString("category")).map(Category::getId).orElse(null))
                        .build(),
                id
        );
        return result.isEmpty() ? null : result.get(0);
    }
}
