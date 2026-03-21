package com.quickmeds.service;

import com.quickmeds.dto.AuthDtos;
import com.quickmeds.entity.Cart;
import com.quickmeds.entity.Role;
import com.quickmeds.entity.User;
import com.quickmeds.entity.enums.RoleName;
import com.quickmeds.exception.BadRequestException;
import com.quickmeds.repository.CartRepository;
import com.quickmeds.repository.RoleRepository;
import com.quickmeds.repository.UserRepository;
import com.quickmeds.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    // ✅ REGISTER
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {

        // 🔒 Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        // 🔑 Fetch default role
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new BadRequestException("Default role missing"));

        // 👤 Create user
        User user = userRepository.save(
                User.builder()
                        .fullName(request.getFullName())
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .roles(Set.of(userRole))
                        .build()
        );

        // 🛒 Create empty cart
        cartRepository.save(
                Cart.builder()
                        .user(user)
                        .build()
        );

        // 🔐 Generate token
        String role = userRole.getName().name();
        String token = jwtService.generateToken(user, role);

        // 📦 Response
        return AuthDtos.AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(role)
                .build();
    }

    // ✅ LOGIN
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {

        // 🔐 Authenticate via Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 👤 Fetch user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        // 🎭 Extract role (safe fallback)
        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> r.getName().name())
                .orElse(RoleName.ROLE_USER.name());

        // 🔐 Generate token
        String token = jwtService.generateToken(user, role);

        // 📦 Response
        return AuthDtos.AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(role)
                .build();
    }
}