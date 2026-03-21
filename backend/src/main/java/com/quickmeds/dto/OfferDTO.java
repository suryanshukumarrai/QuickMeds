package com.quickmeds.dto;

import java.time.LocalDate;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OfferDTO {
    private Long id;
    private String title;
    private String description;
    private Integer discountPercentage;
    private LocalDate validFrom;
    private LocalDate validTill;
    private String category;
    private Boolean active;
    private Boolean expiringSoon;
}
