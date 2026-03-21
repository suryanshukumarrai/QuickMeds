package com.quickmeds.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quickmeds.dto.OfferDTO;
import com.quickmeds.service.OfferService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {
    private final OfferService offerService;

    @GetMapping("/active")
    public ResponseEntity<List<OfferDTO>> getActiveOffers() {
        return ResponseEntity.ok(offerService.getActiveOffers());
    }
}
