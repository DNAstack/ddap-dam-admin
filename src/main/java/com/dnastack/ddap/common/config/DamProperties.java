package com.dnastack.ddap.common.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.net.URI;

@Data
@ConfigurationProperties(prefix = "dam")
public class DamProperties {

    private URI baseUrl;
    private String clientId;
    private String clientSecret;

}
