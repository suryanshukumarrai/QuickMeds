package com.quickmeds.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.quickmeds.dto.OrderDtos;
import com.quickmeds.entity.Address;
import com.quickmeds.entity.Cart;
import com.quickmeds.entity.CartItem;
import com.quickmeds.entity.Medicine;
import com.quickmeds.entity.Offer;
import com.quickmeds.entity.Order;
import com.quickmeds.entity.OrderItem;
import com.quickmeds.entity.Prescription;
import com.quickmeds.entity.User;
import com.quickmeds.entity.enums.OrderStatus;
import com.quickmeds.exception.BadRequestException;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.CartRepository;
import com.quickmeds.repository.OrderRepository;
import com.quickmeds.repository.PrescriptionRepository;
import com.quickmeds.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final LoyaltyService loyaltyService;
    private final OfferService offerService;
    private final AddressService addressService;
    private final EmailService emailService;

    @Value("${app.mail.fallback-to:suryanshura173@gmail.com}")
    private String fallbackEmail;

    public OrderDtos.OrderResponse place(String username, OrderDtos.PlaceOrderRequest request) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Address address = addressService.requireOwnedAddress(user.getId(), request.getAddressId());

        boolean requiresRx = cart.getItems().stream()
                .anyMatch(i -> Boolean.TRUE.equals(i.getMedicine().getRequiresPrescription()));

        Prescription rx = null;

        // ✅ Strict prescription validation
        if (requiresRx) {
            if (request.getPrescriptionId() == null) {
                throw new BadRequestException("Prescription required");
            }

            rx = prescriptionRepository.findById(request.getPrescriptionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

            if (!rx.getUser().getId().equals(user.getId())) {
                throw new BadRequestException("Prescription does not belong to user");
            }

            if (!Boolean.TRUE.equals(rx.getValidated())) {
                throw new BadRequestException("Prescription not validated yet");
            }
        }

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PLACED)
                .createdAt(LocalDateTime.now())
                .prescription(rx)
                .address(address)
                .items(new ArrayList<>())
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal offerDiscount = BigDecimal.ZERO;
        Optional<Offer> selectedOffer = Optional.empty();

        if (request.getOfferId() != null) {
            selectedOffer = offerService.getActiveOfferById(request.getOfferId());

            if (selectedOffer.isEmpty()) {
                throw new BadRequestException("Selected offer is not active");
            }
        }

        for (CartItem item : cart.getItems()) {

            Medicine medicine = item.getMedicine();

            if (medicine.getStock() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for " + medicine.getName());
            }

            medicine.setStock(medicine.getStock() - item.getQuantity());

            order.getItems().add(OrderItem.builder()
                    .order(order)
                    .medicine(medicine)
                    .quantity(item.getQuantity())
                    .priceAtPurchase(medicine.getPrice())
                    .build());

            BigDecimal lineTotal = medicine.getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));

            subtotal = subtotal.add(lineTotal);

            Optional<Offer> lineOffer = selectedOffer;

            if (lineOffer.isPresent()
                    && lineOffer.get().getCategory() != null
                    && !lineOffer.get().getCategory().getId()
                    .equals(medicine.getCategory().getId())) {
                lineOffer = Optional.empty();
            }

            if (selectedOffer.isEmpty()) {
                lineOffer = offerService.applyOffer(medicine.getId());
            }

            if (lineOffer.isPresent()) {
                BigDecimal lineDiscount = lineTotal
                        .multiply(BigDecimal.valueOf(lineOffer.get().getDiscountPercentage()))
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                offerDiscount = offerDiscount.add(lineDiscount);
            }
        }

        BigDecimal afterOffer = subtotal.subtract(offerDiscount).max(BigDecimal.ZERO);

        int requestedPoints = request.getPointsToRedeem() != null ? request.getPointsToRedeem() : 0;
        int maxRedeemablePoints = afterOffer.setScale(0, RoundingMode.DOWN).intValue();
        int pointsToRedeem = Math.max(0, Math.min(requestedPoints, maxRedeemablePoints));

        if (pointsToRedeem > 0) {
            loyaltyService.redeemPoints(user.getId(), pointsToRedeem);
        }

        BigDecimal loyaltyDiscount = BigDecimal.valueOf(pointsToRedeem);
        BigDecimal finalTotal = afterOffer.subtract(loyaltyDiscount).max(BigDecimal.ZERO);

        int pointsEarned = finalTotal.divide(BigDecimal.TEN, 0, RoundingMode.DOWN).intValue();

        if (pointsEarned > 0) {
            loyaltyService.addPoints(user.getId(), pointsEarned);
        }

        order.setTotalAmount(finalTotal);

        Order saved = orderRepository.save(order);

        // Email failures are intentionally non-blocking for order placement.
        String recipient = (user.getEmail() != null && !user.getEmail().isBlank()) ? user.getEmail() : fallbackEmail;
        try {
            emailService.sendOrderConfirmationEmail(recipient, saved);
        } catch (Exception ex) {
            log.error("Failed to send order confirmation email for order {} to {}", saved.getId(), recipient, ex);
        }

        cart.getItems().clear();
        cartRepository.save(cart);

        return toResponse(
                saved,
                subtotal,
                offerDiscount.add(loyaltyDiscount),
                pointsToRedeem,
                pointsEarned,
                selectedOffer.orElse(null)
        );
    }

    public List<OrderDtos.OrderResponse> mine(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<OrderDtos.OrderResponse> findAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderDtos.OrderResponse updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(status);

        // ✅ cancellation handling
        if (status == OrderStatus.CANCELLED && order.getCancellationReason() == null) {
            order.setCancellationReason("Cancelled by admin");
        }
        if (status != OrderStatus.CANCELLED) {
            order.setCancellationReason(null);
        }

        return toResponse(orderRepository.save(order));
    }

    public void cancelOrdersByRejectedPrescription(Long prescriptionId, String reason) {
        List<Order> orders = orderRepository.findByPrescriptionIdAndStatusIn(
                prescriptionId,
                List.of(OrderStatus.PLACED, OrderStatus.PROCESSING)
        );

        for (Order order : orders) {
            order.setStatus(OrderStatus.CANCELLED);
            order.setCancellationReason(reason);
        }

        orderRepository.saveAll(orders);
    }

    public byte[] exportOrdersCsv() {
        List<OrderDtos.OrderResponse> orders = findAll();

        StringBuilder sb = new StringBuilder();
        sb.append("orderId,userId,userName,userEmail,totalAmount,status,cancellationReason,createdAt,itemCount\n");

        for (OrderDtos.OrderResponse order : orders) {
            sb.append(order.getId()).append(',')
                    .append(order.getUserId()).append(',')
                    .append(csvValue(order.getUserFullName())).append(',')
                    .append(csvValue(order.getUserEmail())).append(',')
                    .append(order.getTotalAmount()).append(',')
                    .append(order.getStatus()).append(',')
                    .append(csvValue(order.getCancellationReason())).append(',')
                    .append(order.getCreatedAt()).append(',')
                    .append(order.getItems().size())
                    .append('\n');
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String csvValue(String value) {
        if (value == null) return "";
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }

    private OrderDtos.OrderResponse toResponse(Order o) {
        return toResponse(o, o.getTotalAmount(), BigDecimal.ZERO, 0, 0, null);
    }

    private OrderDtos.OrderResponse toResponse(
            Order o,
            BigDecimal originalAmount,
            BigDecimal discountAmount,
            Integer loyaltyPointsUsed,
            Integer loyaltyPointsEarned,
            Offer offer
    ) {

        return OrderDtos.OrderResponse.builder()
                .id(o.getId())
                .userId(o.getUser().getId())
                .userEmail(o.getUser().getEmail())
                .userFullName(o.getUser().getFullName())
                .originalAmount(originalAmount)
                .discountAmount(discountAmount)
                .totalAmount(o.getTotalAmount())
                .loyaltyPointsUsed(loyaltyPointsUsed)
                .loyaltyPointsEarned(loyaltyPointsEarned)
                .appliedOfferId(offer != null ? offer.getId() : null)
                .appliedOfferTitle(offer != null ? offer.getTitle() : null)
                .status(o.getStatus())
                .cancellationReason(o.getCancellationReason())
                .addressId(o.getAddress() != null ? o.getAddress().getId() : null)
                .deliveryAddress(o.getAddress() != null
                        ? String.format("%s, %s, %s, %s",
                        o.getAddress().getStreet(),
                        o.getAddress().getCity(),
                        o.getAddress().getState(),
                        o.getAddress().getPincode())
                        : null)
                .prescriptionId(o.getPrescription() != null ? o.getPrescription().getId() : null)
                .createdAt(o.getCreatedAt())
                .items(o.getItems().stream()
                        .map(i -> OrderDtos.OrderItemResponse.builder()
                                .medicineId(i.getMedicine().getId())
                                .medicineName(i.getMedicine().getName())
                                .quantity(i.getQuantity())
                                .priceAtPurchase(i.getPriceAtPurchase())
                                .build())
                        .toList())
                .build();
    }
}