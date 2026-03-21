package com.quickmeds.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickmeds.entity.Offer;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByActiveTrueAndValidFromLessThanEqualAndValidTillGreaterThanEqual(LocalDate fromDate, LocalDate tillDate);
    Optional<Offer> findByIdAndActiveTrueAndValidFromLessThanEqualAndValidTillGreaterThanEqual(Long id, LocalDate fromDate, LocalDate tillDate);
}
