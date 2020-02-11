package com.dnastack.ddap.dam.admin.controller;

import com.dnastack.ddap.dam.admin.config.DdapConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/v1alpha/realm/{realm}/whitelists")
public class AdminWhitelistController {

    private final List<DdapConfig.UserWhitelist> whitelists;

    @Autowired
    public AdminWhitelistController(DdapConfig ddapConfig) {
        this.whitelists = new ArrayList<>(ddapConfig.getWhitelists());
    }

    @PostMapping
    public Mono<? extends ResponseEntity<?>> saveWhitelist(ServerHttpRequest request,
                                                           @PathVariable String realm,
                                                           @RequestBody DdapConfig.UserWhitelist whitelistToAdd) {
        return this.whitelists.stream()
            .filter((whitelist) -> whitelist.getName().equalsIgnoreCase(whitelistToAdd.getName()))
            .findFirst()
            .map((whitelist) -> Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).build()))
            .orElseGet(() -> {
                this.whitelists.add(whitelistToAdd);
                URI location = UriComponentsBuilder.fromHttpRequest(request)
                    .path("/{operationId}")
                    .buildAndExpand(whitelistToAdd.getName())
                    .toUri();
                return Mono.just(ResponseEntity.created(location).body(whitelistToAdd));
            });
    }

    @GetMapping
    public Mono<? extends ResponseEntity<?>> getWhitelists(@PathVariable String realm) {
        return Mono.just(ResponseEntity.ok().body(this.whitelists));
    }

    @GetMapping(path = "/{whitelistId}")
    public Mono<? extends ResponseEntity<?>> getWhitelist(@PathVariable String realm,
                                                          @PathVariable String whitelistId) {
        return this.whitelists.stream()
            .filter((whitelist) -> whitelist.getName().equalsIgnoreCase(whitelistId))
            .findFirst()
            .map((whitelist) -> Mono.just(ResponseEntity.ok().body(whitelist)))
            .orElseGet(() -> Mono.just(ResponseEntity.notFound().build()));
    }

    @DeleteMapping(path = "/{whitelistId}")
    public Mono<? extends ResponseEntity<?>> deleteWhitelists(@PathVariable String realm,
                                                           @PathVariable String whitelistId) {
        return this.whitelists.stream()
            .filter((whitelist) -> whitelist.getName().equalsIgnoreCase(whitelistId))
            .findFirst()
            .map((whitelist) -> {
                this.whitelists.remove(whitelist);
                return Mono.just(ResponseEntity.noContent().build());
            })
            .orElseGet(() -> Mono.just(ResponseEntity.notFound().build()));
    }

}
