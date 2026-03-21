package com.quickmeds.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickmeds.entity.HealthPackage;

public interface HealthPackageRepository extends JpaRepository<HealthPackage, Long> {
}
