package com.quickmeds.service;

import com.quickmeds.dto.AdminDtos;
import com.quickmeds.entity.Role;
import com.quickmeds.entity.User;
import com.quickmeds.entity.enums.RoleName;
import com.quickmeds.exception.ResourceNotFoundException;
import com.quickmeds.repository.RoleRepository;
import com.quickmeds.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

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

                public AdminDtos.UserSummaryResponse updateRole(Long userId, RoleName roleName) {
                User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

                user.setRoles(Set.of(role));
                User saved = userRepository.save(user);
                return AdminDtos.UserSummaryResponse.builder()
                    .id(saved.getId())
                    .fullName(saved.getFullName())
                    .email(saved.getEmail())
                    .role(saved.getRoles().stream().findFirst().map(r -> r.getName().name()).orElse("ROLE_USER"))
                    .build();
                }
}
