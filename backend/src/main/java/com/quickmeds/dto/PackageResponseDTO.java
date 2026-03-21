package com.quickmeds.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PackageResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer discountPercentage;
    private String imageUrl;
    private List<IncludedMedicineDTO> includedMedicines;

    @Data
    @Builder
    public static class IncludedMedicineDTO {
        private Long id;
        private String name;
    }
}
