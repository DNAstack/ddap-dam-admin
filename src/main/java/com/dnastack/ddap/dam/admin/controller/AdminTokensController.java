package com.dnastack.ddap.dam.admin.controller;

import common.Common;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1alpha/realm/{realm}/tokens")
public class AdminTokensController {

    @GetMapping
    public Mono<? extends ResponseEntity<?>> getTokens() {
        final Map<String,List<Token>> tokensData = new LinkedHashMap<>();
        List<Token> tokens = new ArrayList<>();
        final Token fakeToken = new Token();
        fakeToken.name = "access-token";
        fakeToken.expires_at = 1581551329;
        fakeToken.issued_at = 1581521329;
        fakeToken.scope = "openid";
        fakeToken.target = "target";
        final Client client = new Client();
        client.id = "fake-client-id";
        client.description = "fake client description";
        client.name = "fake-client";
        fakeToken.client = client;
        final Metadata metadata = new Metadata();
        metadata.client_desc = "Access token to access dam resources";
        fakeToken.metadata = metadata;
        tokens.add(fakeToken);
        tokensData.put("tokens", tokens);
        return Mono.just(ResponseEntity.ok().body(tokensData));
    }

    @DeleteMapping("/{tokenId}")
    public Mono<? extends ResponseEntity<?>> revokeToken(@PathVariable String realm,
                                                         @PathVariable String tokenId) {
        return Mono.just(ResponseEntity.status(HttpStatus.OK).build());
    }

    @Data
    private static class Token {
        private String name;
        private long expires_at;
        private long issued_at;
        private String scope;
        private Client client;
        private String target;
        private Metadata metadata;
    }

    @Data
    private static class Client {
        private String id;
        private String name;
        private String description;
    }

    @Data
    private static class Metadata {
        private String client_desc;
    }
}
