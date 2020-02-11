package com.dnastack.ddap.dam.admin.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1alpha/realm/{realm}/tokens")
public class AdminTokensController {
    private final List<String> tokens;

    @Autowired
    public AdminTokensController() {
        this.tokens = new ArrayList<String>();
    }
    @GetMapping
    public Mono<? extends ResponseEntity<?>> getTokens() {
        return Mono.just(ResponseEntity.ok().body(this.tokens));
    }

    @DeleteMapping
    public Mono<? extends ResponseEntity<?>> revokeToken(@PathVariable String realm,
                                                         @PathVariable String tokenId) {
        return Mono.just(ResponseEntity.status(HttpStatus.ACCEPTED).build());
    }
}
