package com.dnastack.ddap.dam.admin.config;

import com.dnastack.ddap.common.config.DamProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {

    @ConfigurationProperties("dam")
    @Bean
    public DamProperties damProperties() {
        return new DamProperties();
    }
}
