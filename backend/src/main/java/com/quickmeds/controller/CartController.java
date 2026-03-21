package com.quickmeds.controller;

import com.quickmeds.dto.CartDtos;
import com.quickmeds.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDtos.CartResponse> get(Authentication authentication) {
        return ResponseEntity.ok(cartService.get(authentication.getName()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDtos.CartResponse> add(Authentication authentication, @Valid @RequestBody CartDtos.AddToCartRequest request) {
        return ResponseEntity.ok(cartService.add(authentication.getName(), request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDtos.CartResponse> update(Authentication authentication, @PathVariable Long itemId, @Valid @RequestBody CartDtos.UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.update(authentication.getName(), itemId, request.getQuantity()));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDtos.CartResponse> remove(Authentication authentication, @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.remove(authentication.getName(), itemId));
    }
}
