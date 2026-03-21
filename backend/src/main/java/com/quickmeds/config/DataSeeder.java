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
import java.util.HashSet;
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

                    // 🔹 Pain Relief
                    Medicine.builder().name("Dolo 650").description("Used to reduce fever and mild body pain").price(new BigDecimal("34")).stock(78).requiresPrescription(false).imageUrl("").category(pain).build(),
                    Medicine.builder().name("Crocin Advance").description("Provides quick relief from fever and headache").price(new BigDecimal("28")).stock(64).requiresPrescription(false).imageUrl("").category(pain).build(),
                    Medicine.builder().name("Combiflam").description("Relieves pain inflammation and fever").price(new BigDecimal("52")).stock(43).requiresPrescription(false).imageUrl("").category(pain).build(),
                    Medicine.builder().name("Saridon").description("Effective for tension headache relief").price(new BigDecimal("48")).stock(57).requiresPrescription(false).imageUrl("").category(pain).build(),
                    Medicine.builder().name("Voveran SR").description("Used for joint pain and swelling relief").price(new BigDecimal("96")).stock(35).requiresPrescription(false).imageUrl("").category(pain).build(),
                    Medicine.builder().name("Zerodol SP").description("Helps reduce musculoskeletal pain and inflammation").price(new BigDecimal("142")).stock(29).requiresPrescription(false).imageUrl("").category(pain).build(),
                    Medicine.builder().name("Meftal Spas").description("Used for abdominal cramps and period pain").price(new BigDecimal("118")).stock(41).requiresPrescription(false).imageUrl("").category(pain).build(),
                    Medicine.builder().name("Ultracet").description("Used for moderate to severe pain management").price(new BigDecimal("162")).stock(22).requiresPrescription(true).imageUrl("").category(pain).build(),
                    Medicine.builder().name("Calpol 500").description("Used to relieve fever and common aches").price(new BigDecimal("24")).stock(88).requiresPrescription(false).imageUrl("").category(pain).build(),
                    Medicine.builder().name("Brufen 400").description("Provides relief from pain and inflammation").price(new BigDecimal("38")).stock(53).requiresPrescription(false).imageUrl("").category(pain).build(),

                    // 🔹 Antibiotics
                    Medicine.builder().name("Azithral 500").description("Treats bacterial infections of throat and lungs").price(new BigDecimal("119")).stock(32).requiresPrescription(true).imageUrl("").category(cold).build(),
                    Medicine.builder().name("Augmentin 625").description("Broad spectrum antibiotic for bacterial infections").price(new BigDecimal("198")).stock(27).requiresPrescription(true).imageUrl("").category(cold).build(),
                    Medicine.builder().name("Cifran 500").description("Used for urinary and gastrointestinal infections").price(new BigDecimal("86")).stock(46).requiresPrescription(true).imageUrl("").category(cold).build(),
                    Medicine.builder().name("Taxim-O 200").description("Used to treat respiratory and urinary infections").price(new BigDecimal("142")).stock(34).requiresPrescription(true).imageUrl("").category(cold).build(),
                    Medicine.builder().name("Azee 500").description("Treats bacterial infections in ear nose and throat").price(new BigDecimal("112")).stock(39).requiresPrescription(true).imageUrl("").category(cold).build(),
                    Medicine.builder().name("Moxikind-CV 625").description("Used for bacterial chest and sinus infections").price(new BigDecimal("176")).stock(25).requiresPrescription(true).imageUrl("").category(cold).build(),
                    Medicine.builder().name("O2 Tablet").description("Used for mixed bacterial and protozoal infections").price(new BigDecimal("168")).stock(31).requiresPrescription(true).imageUrl("").category(cold).build(),
                    Medicine.builder().name("Doxy-1 L-DR").description("Used for skin chest and infections").price(new BigDecimal("74")).stock(55).requiresPrescription(true).imageUrl("").category(cold).build(),
                    Medicine.builder().name("Levoflox 500").description("Used for severe bacterial respiratory infections").price(new BigDecimal("129")).stock(37).requiresPrescription(true).imageUrl("").category(cold).build(),
                    Medicine.builder().name("Monocef-O 200").description("Used for bacterial infections of lungs").price(new BigDecimal("154")).stock(28).requiresPrescription(true).imageUrl("").category(cold).build(),

                    // 🔹 Cold & Flu
                    Medicine.builder().name("Cetcip").description("Relieves sneezing runny nose and allergy symptoms").price(new BigDecimal("32")).stock(69).requiresPrescription(false).imageUrl("").category(cold).build(),
                    Medicine.builder().name("Okacet").description("Provides relief from cold related allergic symptoms").price(new BigDecimal("26")).stock(73).requiresPrescription(false).imageUrl("").category(cold).build(),
                    Medicine.builder().name("Sinarest").description("Relieves nasal congestion headache and fever").price(new BigDecimal("58")).stock(48).requiresPrescription(false).imageUrl("").category(cold).build(),
                    Medicine.builder().name("Vicks Action 500").description("Used for common cold body ache").price(new BigDecimal("44")).stock(62).requiresPrescription(false).imageUrl("").category(cold).build(),
                    Medicine.builder().name("Cheston Cold").description("Helps manage cold symptoms").price(new BigDecimal("49")).stock(51).requiresPrescription(false).imageUrl("").category(cold).build(),

                    // 🔹 Vitamins
                    Medicine.builder().name("Becosules Capsule").description("Treat vitamin B deficiency").price(new BigDecimal("52")).stock(76).requiresPrescription(false).imageUrl("").category(vitamins).build(),
                    Medicine.builder().name("Shelcal 500").description("Supports bone strength").price(new BigDecimal("138")).stock(45).requiresPrescription(false).imageUrl("").category(vitamins).build(),
                    Medicine.builder().name("Revital H").description("Energy and immunity support").price(new BigDecimal("320")).stock(30).requiresPrescription(false).imageUrl("").category(vitamins).build(),
                    Medicine.builder().name("Neurobion Forte").description("Supports nerve health").price(new BigDecimal("42")).stock(66).requiresPrescription(false).imageUrl("").category(vitamins).build(),
                    Medicine.builder().name("Limcee 500").description("Boosts immunity").price(new BigDecimal("28")).stock(90).requiresPrescription(false).imageUrl("").category(vitamins).build()

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
                            .includedMedicines(new HashSet<>(List.of(vitaminC, multivitamin)))
                            .build(),
                        HealthPackage.builder()
                            .name("Cold & Recovery Pack")
                            .description("Relief combo for fever, cough, and mild body pain.")
                            .price(new BigDecimal("429.00"))
                            .discountPercentage(20)
                            .imageUrl("https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900")
                            .includedMedicines(new HashSet<>(List.of(paracetamol, coughSyrup)))
                            .build(),
                        HealthPackage.builder()
                            .name("Pain Care Combo")
                            .description("Quick pain management essentials at a value price.")
                            .price(new BigDecimal("299.00"))
                            .discountPercentage(12)
                            .imageUrl("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900")
                            .includedMedicines(new HashSet<>(List.of(paracetamol, ibuprofen)))
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
                    .orElseGet(() -> medicines.stream().findFirst()
                        .orElseThrow(() -> new IllegalStateException("No medicines available to seed health packages")));
                }
}
