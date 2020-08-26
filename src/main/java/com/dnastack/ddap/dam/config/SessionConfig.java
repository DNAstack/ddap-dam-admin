package com.dnastack.ddap.dam.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.server.session.DefaultWebSessionManager;
import org.springframework.web.server.session.WebSessionManager;

@Configuration
public class SessionConfig {

    @Primary
    @Bean
    public WebSessionManager webSessionManager() {
        DefaultWebSessionManager defaultWebSessionManager = new DefaultWebSessionManager();
        defaultWebSessionManager.setSessionStore(new NonExpiringInMemoryWebSessionStore());
        return defaultWebSessionManager;
    }

}
