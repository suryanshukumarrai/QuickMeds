package com.quickmeds.service;

import com.quickmeds.dto.AdminDtos;
import com.quickmeds.entity.User;
import com.quickmeds.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<AdminDtos.UserSummaryResponse> findAllSummaries() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getId).reversed())
                .map(user -> AdminDtos.UserSummaryResponse.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRoles().stream().findFirst().map(r -> r.getName().name()).orElse("ROLE_USER"))
                        .build())
                .toList();
    }
}
