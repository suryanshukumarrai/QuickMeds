package com.quickmeds.service;

import com.quickmeds.dto.CartDtos;
import com.quickmeds.entity.*;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.CartRepository;
import com.quickmeds.repository.MedicineRepository;
import com.quickmeds.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartService {
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final MedicineRepository medicineRepository;

    public CartDtos.CartResponse get(String username) {
        return toResponse(getOrCreate(username));
    }

    public CartDtos.CartResponse add(String username, CartDtos.AddToCartRequest request) {
        Cart cart = getOrCreate(username);
        Medicine medicine = medicineRepository.findById(request.getMedicineId()).orElseThrow(() -> new ResourceNotFoundException("Medicine not found"));
        CartItem found = cart.getItems().stream().filter(i -> i.getMedicine().getId().equals(medicine.getId())).findFirst().orElse(null);
        if (found == null) cart.getItems().add(CartItem.builder().cart(cart).medicine(medicine).quantity(request.getQuantity()).build());
        else found.setQuantity(found.getQuantity() + request.getQuantity());
        return toResponse(cartRepository.save(cart));
    }

    public CartDtos.CartResponse update(String username, Long itemId, Integer quantity) {
        Cart cart = getOrCreate(username);
        CartItem item = cart.getItems().stream().filter(i -> i.getId().equals(itemId)).findFirst().orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        item.setQuantity(quantity);
        return toResponse(cartRepository.save(cart));
    }

    public CartDtos.CartResponse remove(String username, Long itemId) {
        Cart cart = getOrCreate(username);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return toResponse(cartRepository.save(cart));
    }

    private Cart getOrCreate(String username) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return cartRepository.findByUser(user).orElseGet(() -> cartRepository.save(Cart.builder().user(user).items(new ArrayList<>()).build()));
    }

    private CartDtos.CartResponse toResponse(Cart cart) {
        var items = cart.getItems().stream().map(item -> CartDtos.CartItemResponse.builder()
            .id(item.getId())
            .medicineId(item.getMedicine().getId())
            .medicineName(item.getMedicine().getName())
            .categoryId(item.getMedicine().getCategory().getId())
            .categoryName(item.getMedicine().getCategory().getName())
            .price(item.getMedicine().getPrice())
            .quantity(item.getQuantity())
            .lineTotal(item.getMedicine().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .build()).toList();
        BigDecimal total = items.stream().map(CartDtos.CartItemResponse::getLineTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        return CartDtos.CartResponse.builder().id(cart.getId()).items(items).total(total).build();
    }
}
