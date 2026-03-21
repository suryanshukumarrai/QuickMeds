package com.quickmeds.service;

import com.quickmeds.dto.OrderDtos;
import com.quickmeds.entity.*;
import com.quickmeds.entity.enums.OrderStatus;
import com.quickmeds.exception.BadRequestException;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.CartRepository;
import com.quickmeds.repository.OrderRepository;
import com.quickmeds.repository.PrescriptionRepository;
import com.quickmeds.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final PrescriptionRepository prescriptionRepository;

    public OrderDtos.OrderResponse place(String username, OrderDtos.PlaceOrderRequest request) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Cart cart = cartRepository.findByUser(user).orElseThrow(() -> new BadRequestException("Cart not found"));
        if (cart.getItems().isEmpty()) throw new BadRequestException("Cart is empty");

        boolean requiresRx = cart.getItems().stream().anyMatch(i -> Boolean.TRUE.equals(i.getMedicine().getRequiresPrescription()));
        Prescription rx = null;
        if (request.getPrescriptionId() != null) {
            rx = prescriptionRepository.findById(request.getPrescriptionId()).orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
            if (!rx.getUser().getId().equals(user.getId())) throw new BadRequestException("Prescription does not belong to user");
        }
        if (requiresRx && rx == null) {
            throw new BadRequestException("Prescription required for medicines in cart");
        }

        Order order = Order.builder().user(user).status(OrderStatus.PLACED).createdAt(LocalDateTime.now()).prescription(rx).items(new ArrayList<>()).build();
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            Medicine medicine = item.getMedicine();
            if (medicine.getStock() < item.getQuantity()) throw new BadRequestException("Insufficient stock for " + medicine.getName());
            medicine.setStock(medicine.getStock() - item.getQuantity());
            order.getItems().add(OrderItem.builder().order(order).medicine(medicine).quantity(item.getQuantity()).priceAtPurchase(medicine.getPrice()).build());
            total = total.add(medicine.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);
        cart.getItems().clear();
        cartRepository.save(cart);
        return toResponse(saved);
    }

    public List<OrderDtos.OrderResponse> mine(String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream().map(this::toResponse).toList();
    }

    public List<OrderDtos.OrderResponse> findAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    public OrderDtos.OrderResponse updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
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
        if (orders.isEmpty()) {
            return;
        }
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
                    .append(order.getUserId() != null ? order.getUserId() : "")
                    .append(',')
                    .append(csvValue(order.getUserFullName())).append(',')
                    .append(csvValue(order.getUserEmail())).append(',')
                    .append(order.getTotalAmount()).append(',')
                    .append(order.getStatus()).append(',')
                .append(csvValue(order.getCancellationReason())).append(',')
                    .append(order.getCreatedAt()).append(',')
                    .append(order.getItems() != null ? order.getItems().size() : 0)
                    .append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String csvValue(String value) {
        if (value == null) {
            return "";
        }
        String escaped = value.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }

    private OrderDtos.OrderResponse toResponse(Order o) {
        return OrderDtos.OrderResponse.builder()
                .id(o.getId())
                .userId(o.getUser().getId())
                .userEmail(o.getUser().getEmail())
                .userFullName(o.getUser().getFullName())
                .totalAmount(o.getTotalAmount())
                .status(o.getStatus())
                .cancellationReason(o.getCancellationReason())
                .prescriptionId(o.getPrescription() != null ? o.getPrescription().getId() : null)
                .createdAt(o.getCreatedAt())
                .items(o.getItems().stream().map(i -> OrderDtos.OrderItemResponse.builder().medicineId(i.getMedicine().getId()).medicineName(i.getMedicine().getName()).quantity(i.getQuantity()).priceAtPurchase(i.getPriceAtPurchase()).build()).toList())
                .build();
    }
}
