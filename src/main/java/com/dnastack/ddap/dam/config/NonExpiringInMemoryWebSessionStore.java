package com.dnastack.ddap.dam.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.server.WebSession;
import org.springframework.web.server.session.InMemoryWebSessionStore;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Slf4j
@Component
public class NonExpiringInMemoryWebSessionStore extends InMemoryWebSessionStore {

    private static final Duration MAX_IDLE_TIME = Duration.ofHours(-1);

    @Override
    public Mono<WebSession> createWebSession() {
        // To make SESSION never expiring we need to override maxIdleTime in WebSession,
        // otherwise session expires after 30 minutes of inactivity
        return super.createWebSession()
            .map((webSession) -> {
                webSession.setMaxIdleTime(MAX_IDLE_TIME);
                return webSession;
            });
    }

}
