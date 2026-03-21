package com.quickmeds.repository;

import com.quickmeds.entity.Medicine;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByNameContainingIgnoreCase(String name);
    List<Medicine> findByCategoryId(Long categoryId);
    List<Medicine> findByNameContainingIgnoreCaseAndCategoryId(String name, Long categoryId);
}
