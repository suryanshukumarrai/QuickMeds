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

    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new BadRequestException("Default role missing"));

        User user = userRepository.save(User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(userRole))
                .build());

        cartRepository.save(Cart.builder().user(user).build());

        String token = jwtService.generateToken(user, userRole.getName().name());
        return AuthDtos.AuthResponse.builder().token(token).email(user.getEmail()).fullName(user.getFullName()).role(userRole.getName().name()).build();
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new BadRequestException("Invalid credentials"));
        String role = user.getRoles().stream().findFirst().map(r -> r.getName().name()).orElse(RoleName.ROLE_USER.name());
        String token = jwtService.generateToken(user, role);
        return AuthDtos.AuthResponse.builder().token(token).email(user.getEmail()).fullName(user.getFullName()).role(role).build();
    }
}
