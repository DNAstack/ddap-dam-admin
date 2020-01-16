package com.dnastack.ddap.dam.admin.controller;

import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.dam.admin.client.ReactiveAdminDamClient;
import dam.v1.DamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Set;

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.*;

@RestController
@RequestMapping(value = "/api/v1alpha/realm/{realm}/dam/target-adapters")
public class TargetAdapterController {

    private UserTokenCookiePackager cookiePackager;
    private ReactiveAdminDamClient damClient;

    @Autowired
    public TargetAdapterController(UserTokenCookiePackager cookiePackager,
                                   ReactiveAdminDamClient damClient) {
        this.cookiePackager = cookiePackager;
        this.damClient = damClient;
    }

    @GetMapping
    public Mono<Map<String, DamService.TargetAdapter>> getTargetAdapters(@PathVariable String realm,
                                                                         ServerHttpRequest request) {
        Map<CookieKind, UserTokenCookiePackager.CookieValue> tokens = cookiePackager.extractRequiredTokens(request, Set.of(CookieKind.DAM, CookieKind.REFRESH));

        return damClient.getTargetAdapters(realm, tokens.get(CookieKind.DAM).getClearText(), tokens.get(CookieKind.REFRESH).getClearText())
            .map(DamService.TargetAdaptersResponse::getTargetAdaptersMap);
    }

}
