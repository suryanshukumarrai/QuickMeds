package com.quickmeds.repository;

import com.quickmeds.entity.Prescription;
import com.quickmeds.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByUserOrderByUploadedAtDesc(User user);
    List<Prescription> findAllByOrderByUploadedAtDesc();
}
