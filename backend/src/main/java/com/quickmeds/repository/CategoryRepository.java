package com.quickmeds.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickmeds.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    Optional<Category> findByNameIgnoreCase(String name);
}