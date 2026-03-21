package com.quickmeds.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import lombok.*;

public class MedicineDtos {
    @Data
    public static class MedicineRequest {
        @NotBlank private String name;
        @NotBlank private String description;
        @NotNull @DecimalMin("0.0") private BigDecimal price;
        @NotNull @Min(0) private Integer stock;
        @NotNull private Boolean requiresPrescription;
        private String imageUrl;
        @NotNull private Long categoryId;
    }

    @Data
    @Builder
    public static class MedicineResponse {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer stock;
        private Boolean requiresPrescription;
        private String imageUrl;
        private Long categoryId;
        private String categoryName;
    }
}
