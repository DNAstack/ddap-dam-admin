package com.dnastack.ddap.dam.account.controller;

import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.dam.account.client.ReactiveTokenClient;
import com.dnastack.ddap.dam.account.service.TokensExperimentalFeaturesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Set;

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.BasicServices.DAM;
import static com.dnastack.ddap.common.security.UserTokenCookiePackager.CookieName;
import static com.dnastack.ddap.common.security.UserTokenCookiePackager.TokenKind;

/**
 * NOTE: this is controller exists to support experimental features
 */
@Slf4j
@RestController
@RequestMapping("/api/v1alpha/realm/{realm}/users/{userId}/tokens")
public class TokensController {

    @Value("${ddap.enable-experimental}")
    private Boolean experimentalEnabled;

    private final ReactiveTokenClient tokenClient;
    private final UserTokenCookiePackager cookiePackager;
    private final TokensExperimentalFeaturesService experimentalFeaturesService;

    @Autowired
    public TokensController(
        ReactiveTokenClient tokenClient,
        UserTokenCookiePackager cookiePackager,
        TokensExperimentalFeaturesService experimentalFeaturesService
    ) {
        this.tokenClient = tokenClient;
        this.cookiePackager = cookiePackager;
        this.experimentalFeaturesService = experimentalFeaturesService;
    }

    @GetMapping
    public Mono<? extends ResponseEntity<?>> getTokens(
        ServerHttpRequest request,
        @PathVariable String realm,
        @PathVariable String userId) {
        Map<CookieName, UserTokenCookiePackager.CookieValue> cookies = cookiePackager
            .extractRequiredTokens(request, Set.of(DAM.cookieName(TokenKind.ACCESS), DAM.cookieName(TokenKind.REFRESH)));
        UserTokenCookiePackager.CookieValue accessToken = cookies.get(DAM.cookieName(TokenKind.ACCESS));
        UserTokenCookiePackager.CookieValue refreshToken = cookies.get(DAM.cookieName(TokenKind.REFRESH));
        if (accessToken == null || refreshToken == null) {
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization is invalid"));
        }
        return tokenClient.getTokens(realm, userId, accessToken.getClearText(), refreshToken.getClearText())
            .flatMap(tokensResponse -> {
                if (experimentalEnabled) {
                    return Mono.just(ResponseEntity.ok()
                        .body(experimentalFeaturesService.addResourcesIfNotExist(tokensResponse)));
                }
                return Mono.just(ResponseEntity.ok().body(tokensResponse));
            });
    }

}
