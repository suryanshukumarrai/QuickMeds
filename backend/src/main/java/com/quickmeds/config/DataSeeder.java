package com.quickmeds.config;

import com.quickmeds.entity.*;
import com.quickmeds.entity.enums.RoleName;
import com.quickmeds.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
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
    }
}
