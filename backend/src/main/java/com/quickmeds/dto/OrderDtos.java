package com.quickmeds.dto;

import com.quickmeds.entity.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

public class OrderDtos {

    @Data
    public static class PlaceOrderRequest {
        @NotNull
        private Long addressId;
        private Long prescriptionId;
        private Long offerId;
        private Integer pointsToRedeem;
    }

    @Data
    public static class UpdateOrderStatusRequest {
        @NotNull
        private OrderStatus status;
    }

    @Data
    @Builder
    public static class OrderItemResponse {
        private Long medicineId;
        private String medicineName;
        private Integer quantity;
        private BigDecimal priceAtPurchase;
    }

    @Data
    @Builder
    public static class OrderResponse {
        private Long id;
        private Long userId;
        private String userEmail;
        private String userFullName;

        // ✅ pricing
        private BigDecimal originalAmount;
        private BigDecimal discountAmount;

        private BigDecimal totalAmount;
        private Integer loyaltyPointsUsed;
        private Integer loyaltyPointsEarned;
        private Long appliedOfferId;
        private String appliedOfferTitle;
        private OrderStatus status;

        // ✅ keep BOTH (merged)
        private String cancellationReason;
        private Long addressId;
        private String deliveryAddress;

        private Long prescriptionId;
        private LocalDateTime createdAt;
        private List<OrderItemResponse> items;
    }
}