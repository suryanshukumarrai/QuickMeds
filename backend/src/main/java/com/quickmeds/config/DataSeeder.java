package com.quickmeds.config;

import com.quickmeds.entity.*;
import com.quickmeds.entity.enums.RoleName;
import com.quickmeds.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final MedicineRepository medicineRepository;
    private final CartRepository cartRepository;
    private final HealthPackageRepository healthPackageRepository;
    private final OfferRepository offerRepository;
    private final LoyaltyPointsRepository loyaltyPointsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER).orElseGet(() -> roleRepository.save(Role.builder().name(RoleName.ROLE_USER).build()));
        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).orElseGet(() -> roleRepository.save(Role.builder().name(RoleName.ROLE_ADMIN).build()));

        if (!userRepository.existsByEmail("admin@quickmeds.com")) {
            User admin = userRepository.save(User.builder().fullName("QuickMeds Admin").email("admin@quickmeds.com").password(passwordEncoder.encode("admin123")).roles(Set.of(adminRole)).build());
            cartRepository.save(Cart.builder().user(admin).build());
        }

        if (!userRepository.existsByEmail("user@quickmeds.com")) {
            User user = userRepository.save(User.builder().fullName("QuickMeds User").email("user@quickmeds.com").password(passwordEncoder.encode("user123")).roles(Set.of(userRole)).build());
            cartRepository.save(Cart.builder().user(user).build());
        }

        if (categoryRepository.count() == 0) {
            Category pain = categoryRepository.save(Category.builder().name("Pain Relief").description("Pain and inflammation medicines").build());
            Category vitamins = categoryRepository.save(Category.builder().name("Vitamins").description("Daily health supplements").build());
            Category cold = categoryRepository.save(Category.builder().name("Cold & Flu").description("Cold and fever care").build());
            medicineRepository.saveAll(List.of(
                    Medicine.builder().name("Paracetamol 500mg").description("Fever and mild pain relief").price(new BigDecimal("4.99")).stock(150).requiresPrescription(false).imageUrl("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600").category(pain).build(),
                    Medicine.builder().name("Ibuprofen 400mg").description("Pain relief and anti-inflammatory").price(new BigDecimal("6.50")).stock(120).requiresPrescription(false).imageUrl("https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600").category(pain).build(),
                    Medicine.builder().name("Vitamin C Tablets").description("Immunity support supplement").price(new BigDecimal("8.90")).stock(200).requiresPrescription(false).imageUrl("https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600").category(vitamins).build(),
                    Medicine.builder().name("Multivitamin Capsules").description("Essential daily vitamins").price(new BigDecimal("12.00")).stock(180).requiresPrescription(false).imageUrl("https://images.unsplash.com/photo-1550572017-edd951aa8f7a?w=600").category(vitamins).build(),
                    Medicine.builder().name("Cough Syrup Rx").description("Prescription cough syrup").price(new BigDecimal("14.25")).stock(75).requiresPrescription(true).imageUrl("https://images.unsplash.com/photo-1626716493137-b67fe9501e76?w=600").category(cold).build(),
                    Medicine.builder().name("Antibiotic Course Rx").description("Prescription antibiotic tablets").price(new BigDecimal("22.99")).stock(60).requiresPrescription(true).imageUrl("https://images.unsplash.com/photo-1576671081837-49000212a370?w=600").category(cold).build()
            ));
        }

                if (healthPackageRepository.count() == 0) {
                    List<Medicine> medicines = medicineRepository.findAll();
                    Medicine paracetamol = findByName(medicines, "Paracetamol");
                    Medicine vitaminC = findByName(medicines, "Vitamin C");
                    Medicine multivitamin = findByName(medicines, "Multivitamin");
                    Medicine ibuprofen = findByName(medicines, "Ibuprofen");
                    Medicine coughSyrup = findByName(medicines, "Cough Syrup");

                    healthPackageRepository.saveAll(List.of(
                        HealthPackage.builder()
                            .name("Immunity Starter Pack")
                            .description("Daily immune support essentials for seasonal wellness.")
                            .price(new BigDecimal("349.00"))
                            .discountPercentage(15)
                            .imageUrl("https://images.unsplash.com/photo-1611242320536-f12d3541249b?w=900")
                            .includedMedicines(Set.of(vitaminC, multivitamin))
                            .build(),
                        HealthPackage.builder()
                            .name("Cold & Recovery Pack")
                            .description("Relief combo for fever, cough, and mild body pain.")
                            .price(new BigDecimal("429.00"))
                            .discountPercentage(20)
                            .imageUrl("https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900")
                            .includedMedicines(Set.of(paracetamol, coughSyrup))
                            .build(),
                        HealthPackage.builder()
                            .name("Pain Care Combo")
                            .description("Quick pain management essentials at a value price.")
                            .price(new BigDecimal("299.00"))
                            .discountPercentage(12)
                            .imageUrl("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900")
                            .includedMedicines(Set.of(paracetamol, ibuprofen))
                            .build()
                    ));
                }

                if (offerRepository.count() == 0) {
                    Category vitaminsCategory = categoryRepository.findByName("Vitamins").orElse(null);
                    offerRepository.saveAll(List.of(
                        Offer.builder()
                            .title("Spring Immunity Boost")
                            .description("Get 20% off on vitamins and supplements this season.")
                            .discountPercentage(20)
                            .validFrom(LocalDate.now().minusDays(3))
                            .validTill(LocalDate.now().plusDays(20))
                            .category(vitaminsCategory)
                            .active(true)
                            .build(),
                        Offer.builder()
                            .title("Wellness Weekend")
                            .description("Flat 10% off on all medicines this week.")
                            .discountPercentage(10)
                            .validFrom(LocalDate.now().minusDays(1))
                            .validTill(LocalDate.now().plusDays(7))
                            .category(null)
                            .active(true)
                            .build()
                    ));
                }

                if (loyaltyPointsRepository.count() == 0) {
                    userRepository.findAll().forEach(user -> loyaltyPointsRepository.save(
                        LoyaltyPoints.builder()
                            .user(user)
                            .points("admin@quickmeds.com".equalsIgnoreCase(user.getEmail()) ? 150 : 80)
                            .lastUpdated(LocalDateTime.now())
                            .build()
                    ));
                }
    }

                private Medicine findByName(List<Medicine> medicines, String key) {
                return medicines.stream()
                    .filter(medicine -> medicine.getName().toLowerCase().contains(key.toLowerCase()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("Seed medicine missing for key: " + key));
                }
}
