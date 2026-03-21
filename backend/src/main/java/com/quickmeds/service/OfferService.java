package com.quickmeds.service;

import com.quickmeds.dto.OfferDTO;
import com.quickmeds.entity.Medicine;
import com.quickmeds.entity.Offer;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.MedicineRepository;
import com.quickmeds.repository.OfferRepository;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OfferService {
    private final OfferRepository offerRepository;
    private final MedicineRepository medicineRepository;

    public List<OfferDTO> getActiveOffers() {
        LocalDate today = LocalDate.now();
        return offerRepository.findByActiveTrueAndValidFromLessThanEqualAndValidTillGreaterThanEqual(today, today)
                .stream()
                .sorted(Comparator.comparing(Offer::getValidTill))
                .map(this::toDto)
                .toList();
    }

    public Optional<Offer> applyOffer(Long medicineId) {
        LocalDate today = LocalDate.now();
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found"));

        return offerRepository.findByActiveTrueAndValidFromLessThanEqualAndValidTillGreaterThanEqual(today, today)
                .stream()
                .filter(offer -> offer.getCategory() == null || offer.getCategory().getId().equals(medicine.getCategory().getId()))
                .max(Comparator.comparing(Offer::getDiscountPercentage));
    }

    public Optional<Offer> getActiveOfferById(Long offerId) {
        LocalDate today = LocalDate.now();
        return offerRepository.findByIdAndActiveTrueAndValidFromLessThanEqualAndValidTillGreaterThanEqual(offerId, today, today);
    }

    private OfferDTO toDto(Offer offer) {
        LocalDate today = LocalDate.now();
        boolean expiringSoon = !offer.getValidTill().isBefore(today) && !offer.getValidTill().isAfter(today.plusDays(3));
        return OfferDTO.builder()
                .id(offer.getId())
                .title(offer.getTitle())
                .description(offer.getDescription())
                .discountPercentage(offer.getDiscountPercentage())
                .validFrom(offer.getValidFrom())
                .validTill(offer.getValidTill())
                .category(offer.getCategory() != null ? offer.getCategory().getName() : null)
                .active(offer.getActive())
                .expiringSoon(expiringSoon)
                .build();
    }
}
