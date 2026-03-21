package com.quickmeds.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI docs() {
        return new OpenAPI().info(new Info().title("QuickMeds API").description("Pharmacy ordering REST APIs").version("1.0.0"));
    }
}
