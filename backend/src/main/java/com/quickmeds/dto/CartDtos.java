package com.quickmeds.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import lombok.*;

public class CartDtos {
    @Data
    public static class AddToCartRequest {
        @NotNull private Long medicineId;
        @NotNull @Min(1) private Integer quantity;
    }

    @Data
    public static class UpdateCartItemRequest {
        @NotNull @Min(1) private Integer quantity;
    }

    @Data @Builder
    public static class CartItemResponse {
        private Long id;
        private Long medicineId;
        private String medicineName;
        private BigDecimal price;
        private Integer quantity;
        private BigDecimal lineTotal;
    }

    @Data @Builder
    public static class CartResponse {
        private Long id;
        private List<CartItemResponse> items;
        private BigDecimal total;
    }
}
