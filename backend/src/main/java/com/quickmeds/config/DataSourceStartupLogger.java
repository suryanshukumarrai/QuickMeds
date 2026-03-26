package com.quickmeds.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSourceStartupLogger {
    private static final Logger log = LoggerFactory.getLogger(DataSourceStartupLogger.class);

    @Bean
    ApplicationRunner logDataSourceUrl(@Value("${spring.datasource.url}") String datasourceUrl) {
        return args -> log.info("Configured datasource URL: {}", maskCredentials(datasourceUrl));
    }

    private String maskCredentials(String url) {
        if (url == null || url.isBlank()) {
            return "<empty>";
        }

        // Masks user info in URLs like jdbc:postgresql://user:pass@host:5432/db
        return url.replaceAll("(jdbc:[a-zA-Z0-9]+://)([^/@:]+):([^/@]+)@", "$1****:****@");
    }
}
