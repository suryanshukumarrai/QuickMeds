package com.quickmeds.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoyaltyDTO {
    private Long userId;
    private Integer points;
    private LocalDateTime lastUpdated;
}
