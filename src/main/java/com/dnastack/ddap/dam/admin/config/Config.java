package com.dnastack.ddap.dam.admin.config;

import com.dnastack.ddap.common.config.DamProperties;
import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.common.security.filter.UserTokenStatusFilter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.BasicServices.DAM;

@Configuration
public class Config {

    @ConfigurationProperties("dam")
    @Bean
    public DamProperties damProperties() {
        return new DamProperties();
    }

    @Bean
    public UserTokenStatusFilter userTokenStatusFilter(UserTokenCookiePackager userTokenCookiePackager) {
        return new UserTokenStatusFilter(userTokenCookiePackager, DAM.cookieName(UserTokenCookiePackager.TokenKind.ACCESS));
    }
}
