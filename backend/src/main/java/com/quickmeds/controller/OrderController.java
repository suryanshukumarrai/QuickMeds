package com.quickmeds.controller;

import com.quickmeds.dto.OrderDtos;
import com.quickmeds.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDtos.OrderResponse> place(Authentication authentication, @RequestBody OrderDtos.PlaceOrderRequest request) {
        return ResponseEntity.ok(orderService.place(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<OrderDtos.OrderResponse>> mine(Authentication authentication) {
        return ResponseEntity.ok(orderService.mine(authentication.getName()));
    }
}
