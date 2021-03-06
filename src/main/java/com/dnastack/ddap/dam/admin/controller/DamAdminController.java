package com.dnastack.ddap.dam.admin.controller;

import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.common.security.UserTokenCookiePackager.CookieName;
import com.dnastack.ddap.common.security.UserTokenCookiePackager.TokenKind;
import com.dnastack.ddap.dam.admin.model.UserDamAccessInfo;
import com.dnastack.ddap.dam.admin.service.DamAdminAccessTester;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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


@Slf4j
@RestController
@RequestMapping("/api/v1alpha/realm/{realm}/dam")
public class DamAdminController {

    private UserTokenCookiePackager cookiePackager;
    private DamAdminAccessTester accessTesterClient;

    @Autowired
    public DamAdminController(UserTokenCookiePackager cookiePackager, DamAdminAccessTester accessTesterClient) {
        this.cookiePackager = cookiePackager;
        this.accessTesterClient = accessTesterClient;
    }

    @GetMapping(value = "/info")
    public Mono<? extends ResponseEntity<?>> getAccessInfo(ServerHttpRequest request,
                                                           @PathVariable String realm) {
        Map<CookieName, UserTokenCookiePackager.CookieValue> tokens =
                cookiePackager.extractRequiredTokens(request, Set.of(DAM.cookieName(TokenKind.ACCESS), DAM.cookieName(TokenKind.REFRESH)));

        Mono<UserDamAccessInfo> accessesMono = accessTesterClient.determineAccessForUser(realm, tokens);

        return accessesMono.flatMap(access -> Mono.just(ResponseEntity.ok().body(access)));
    }

}
