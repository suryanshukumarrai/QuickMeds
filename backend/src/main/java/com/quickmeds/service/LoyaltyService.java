package com.quickmeds.service;

import com.quickmeds.dto.LoyaltyDTO;
import com.quickmeds.entity.LoyaltyPoints;
import com.quickmeds.entity.User;
import com.quickmeds.exception.BadRequestException;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.LoyaltyPointsRepository;
import com.quickmeds.repository.UserRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoyaltyService {
    private final LoyaltyPointsRepository loyaltyPointsRepository;
    private final UserRepository userRepository;

    public LoyaltyDTO addPoints(Long userId, Integer points) {
        if (points == null || points <= 0) {
            throw new BadRequestException("Points to add must be greater than 0");
        }
        LoyaltyPoints loyaltyPoints = getOrCreate(userId);
        loyaltyPoints.setPoints(loyaltyPoints.getPoints() + points);
        loyaltyPoints.setLastUpdated(LocalDateTime.now());
        return toDto(loyaltyPointsRepository.save(loyaltyPoints));
    }

    public LoyaltyDTO redeemPoints(Long userId, Integer points) {
        if (points == null || points <= 0) {
            throw new BadRequestException("Points to redeem must be greater than 0");
        }
        LoyaltyPoints loyaltyPoints = getOrCreate(userId);
        if (loyaltyPoints.getPoints() < points) {
            throw new BadRequestException("Insufficient loyalty points");
        }
        loyaltyPoints.setPoints(loyaltyPoints.getPoints() - points);
        loyaltyPoints.setLastUpdated(LocalDateTime.now());
        return toDto(loyaltyPointsRepository.save(loyaltyPoints));
    }

    public LoyaltyDTO getUserPoints(Long userId) {
        return toDto(getOrCreate(userId));
    }

    private LoyaltyPoints getOrCreate(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return loyaltyPointsRepository.findByUser(user)
                .orElseGet(() -> loyaltyPointsRepository.save(LoyaltyPoints.builder()
                        .user(user)
                        .points(0)
                        .lastUpdated(LocalDateTime.now())
                        .build()));
    }

    private LoyaltyDTO toDto(LoyaltyPoints loyaltyPoints) {
        return LoyaltyDTO.builder()
                .userId(loyaltyPoints.getUser().getId())
                .points(loyaltyPoints.getPoints())
                .lastUpdated(loyaltyPoints.getLastUpdated())
                .build();
    }
}
