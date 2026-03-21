package com.quickmeds.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quickmeds.dto.LoyaltyDTO;
import com.quickmeds.entity.User;
import com.quickmeds.exception.BadRequestException;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.UserRepository;
import com.quickmeds.service.LoyaltyService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/loyalty")
@RequiredArgsConstructor
public class LoyaltyController {
    private final LoyaltyService loyaltyService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<LoyaltyDTO> getPoints(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(loyaltyService.getUserPoints(user.getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<LoyaltyDTO> addPoints(Authentication authentication, @Valid @RequestBody LoyaltyActionRequest request) {
        Long targetUserId = resolveTargetUserId(authentication, request.getUserId());
        return ResponseEntity.ok(loyaltyService.addPoints(targetUserId, request.getPoints()));
    }

    @PostMapping("/redeem")
    public ResponseEntity<LoyaltyDTO> redeemPoints(Authentication authentication, @Valid @RequestBody LoyaltyActionRequest request) {
        Long targetUserId = resolveTargetUserId(authentication, request.getUserId());
        return ResponseEntity.ok(loyaltyService.redeemPoints(targetUserId, request.getPoints()));
    }

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Long resolveTargetUserId(Authentication authentication, Long requestedUserId) {
        User authUser = getAuthenticatedUser(authentication);
        boolean isAdmin = authUser.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (requestedUserId == null) {
            return authUser.getId();
        }
        if (!isAdmin && !requestedUserId.equals(authUser.getId())) {
            throw new BadRequestException("You can only modify your own loyalty points");
        }
        return requestedUserId;
    }

    @Data
    public static class LoyaltyActionRequest {
        private Long userId;
        @NotNull
        @Min(1)
        private Integer points;
    }
}
