package com.quickmeds.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.*;

public class PrescriptionDtos {
    @Data @Builder
    public static class PrescriptionResponse {
        private Long id;
        private String fileName;
        private Boolean validated;
        private LocalDateTime uploadedAt;
    }

    @Data
    public static class ValidatePrescriptionRequest {
        @NotNull
        private Boolean validated;
    }
}
