package com.quickmeds.dto;

import com.quickmeds.entity.enums.RoleName;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

public class AdminDtos {
    @Data
    public static class CategoryRequest {
        @NotBlank
        private String name;
        private String description;
    }

    @Data
    @Builder
    public static class CategoryResponse {
        private Long id;
        private String name;
        private String description;
    }

    @Data
    @Builder
    public static class UserSummaryResponse {
        private Long id;
        private String fullName;
        private String email;
        private String role;
    }

    @Data
    public static class UpdateUserRoleRequest {
        @NotNull
        private RoleName role;
    }
}
