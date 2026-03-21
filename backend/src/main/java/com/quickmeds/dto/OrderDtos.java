package com.quickmeds.dto;

import com.quickmeds.entity.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

public class OrderDtos {
    @Data
    public static class PlaceOrderRequest {
        private Long prescriptionId;
    }

    @Data @Builder
    public static class OrderItemResponse {
        private Long medicineId;
        private String medicineName;
        private Integer quantity;
        private BigDecimal priceAtPurchase;
    }

    @Data @Builder
    public static class OrderResponse {
        private Long id;
        private BigDecimal totalAmount;
        private OrderStatus status;
        private Long prescriptionId;
        private LocalDateTime createdAt;
        private List<OrderItemResponse> items;
    }
}
