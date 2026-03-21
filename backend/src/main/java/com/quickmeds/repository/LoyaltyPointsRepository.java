package com.quickmeds.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickmeds.entity.LoyaltyPoints;
import com.quickmeds.entity.User;

public interface LoyaltyPointsRepository extends JpaRepository<LoyaltyPoints, Long> {
    Optional<LoyaltyPoints> findByUser(User user);
    Optional<LoyaltyPoints> findByUserId(Long userId);
}
