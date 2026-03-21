package com.quickmeds.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;

public class AddressDtos {
    @Data
    public static class AddressRequest {
        @NotBlank
        private String fullName;

        @NotBlank
        @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
        private String phone;

        @NotBlank
        private String street;

        @NotBlank
        private String city;

        @NotBlank
        private String state;

        @NotBlank
        @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
        private String pincode;
    }

    @Data
    @Builder
    public static class AddressResponse {
        private Long id;
        private String fullName;
        private String phone;
        private String street;
        private String city;
        private String state;
        private String pincode;
    }
}
