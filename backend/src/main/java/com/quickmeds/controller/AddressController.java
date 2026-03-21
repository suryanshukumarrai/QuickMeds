package com.quickmeds.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quickmeds.dto.AddressDtos;
import com.quickmeds.service.AddressService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<AddressDtos.AddressResponse>> list(Authentication authentication) {
        return ResponseEntity.ok(addressService.listUserAddresses(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<AddressDtos.AddressResponse> add(Authentication authentication,
                                                           @Valid @RequestBody AddressDtos.AddressRequest request) {
        return ResponseEntity.ok(addressService.addAddress(authentication.getName(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDtos.AddressResponse> update(Authentication authentication,
                                                              @PathVariable Long id,
                                                              @Valid @RequestBody AddressDtos.AddressRequest request) {
        return ResponseEntity.ok(addressService.updateAddress(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        addressService.deleteAddress(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
