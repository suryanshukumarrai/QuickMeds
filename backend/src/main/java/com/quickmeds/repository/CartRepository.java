package com.quickmeds.repository;

import com.quickmeds.entity.Cart;
import com.quickmeds.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
