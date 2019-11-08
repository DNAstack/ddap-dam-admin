package com.dnastack.ddap.dam.admin.client;

import com.dnastack.ddap.common.client.AuthAwareWebClientFactory;
import com.dnastack.ddap.common.client.OAuthFilter;
import com.dnastack.ddap.common.client.ProtobufDeserializer;
import com.dnastack.ddap.common.client.WebClientFactory;
import com.dnastack.ddap.common.config.DamProperties;
import dam.v1.DamService;
import dam.v1.DamService.DamConfig;
import dam.v1.DamService.TargetAdaptersResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriTemplate;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Slf4j
@Component
public class ReactiveAdminDamClient {

    private DamProperties damProperties;
    private AuthAwareWebClientFactory webClientFactory;

    public ReactiveAdminDamClient(DamProperties damProperties,
                                  AuthAwareWebClientFactory webClientFactory) {
        this.damProperties = damProperties;
        this.webClientFactory = webClientFactory;
    }

    public Mono<DamService.GetInfoResponse> getDamInfo() {
        return WebClientFactory.getWebClient()
            .get()
            .uri(damProperties.getBaseUrl().resolve("/dam"))
            .retrieve()
            .bodyToMono(String.class)
            .flatMap(json -> ProtobufDeserializer.fromJson(json, DamService.GetInfoResponse.getDefaultInstance()));
    }

    public Mono<DamConfig> getConfig(String realm, String damToken, String refreshToken) {
        final UriTemplate template = new UriTemplate("/dam/v1alpha/{realm}/config" +
            "?client_id={clientId}" +
            "&client_secret={clientSecret}");
        final Map<String, Object> variables = new HashMap<>();
        variables.put("realm", realm);
        variables.put("clientId", damProperties.getClientId());
        variables.put("clientSecret", damProperties.getClientSecret());

        return webClientFactory.getWebClient(realm, refreshToken, OAuthFilter.Audience.IC)
            .get()
            .uri(damProperties.getBaseUrl().resolve(template.expand(variables)))
            .header(AUTHORIZATION, "Bearer " + damToken)
            .retrieve()
            .bodyToMono(String.class)
            .flatMap(json -> ProtobufDeserializer.fromJson(json, DamConfig.getDefaultInstance()));
    }

    public Mono<TargetAdaptersResponse> getTargetAdapters(String realm, String damToken, String refreshToken) {
        final UriTemplate template = new UriTemplate("/dam/v1alpha/{realm}/targetAdapters" +
            "?client_id={clientId}" +
            "&client_secret={clientSecret}");
        final Map<String, Object> variables = new HashMap<>();
        variables.put("realm", realm);
        variables.put("clientId", damProperties.getClientId());
        variables.put("clientSecret", damProperties.getClientSecret());

        return webClientFactory.getWebClient(realm, refreshToken, OAuthFilter.Audience.IC)
            .get()
            .uri(damProperties.getBaseUrl().resolve(template.expand(variables)))
            .header(AUTHORIZATION, "Bearer " + damToken)
            .retrieve()
            .bodyToMono(String.class)
            .flatMap(json -> ProtobufDeserializer.fromJson(json, TargetAdaptersResponse.getDefaultInstance()));
    }

}
