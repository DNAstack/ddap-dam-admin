package com.dnastack.ddap.dam.admin.service;

import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.dam.admin.client.ReactiveAdminDamClient;
import com.dnastack.ddap.dam.admin.model.UserDamAccessInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Map;

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.CookieKind;

@Slf4j
@Component
public class DamAdminAccessTester {

    private ReactiveAdminDamClient damClient;

    @Autowired
    public DamAdminAccessTester(ReactiveAdminDamClient damClient) {
        this.damClient = damClient;
    }

    public Mono<UserDamAccessInfo> determineAccessForUser(String realm, Map<CookieKind, UserTokenCookiePackager.CookieValue> tokens) {
        UserDamAccessInfo userDamAccessInfo = new UserDamAccessInfo();

        return damClient.getConfig(realm, tokens.get(CookieKind.DAM).getClearText(), tokens.get(CookieKind.REFRESH).getClearText())
            .doOnSuccessOrError((damConfig, throwable) -> {
                if (throwable != null && !throwable.getMessage().contains("403")) {
                    log.warn("Unexpected exception", throwable);
                }
                if (throwable == null && damConfig != null) {
                    userDamAccessInfo.setUi(damConfig.getUiMap());
                }
                userDamAccessInfo.setAccessible(throwable == null);
            })
            .thenReturn(userDamAccessInfo)
            .onErrorReturn(userDamAccessInfo);
    }

}
