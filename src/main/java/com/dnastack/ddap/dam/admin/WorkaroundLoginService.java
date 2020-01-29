package com.dnastack.ddap.dam.admin;

import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.ic.oauth.client.ReactiveIdpOAuthClient;
import com.dnastack.ddap.ic.oauth.service.IdpLoginService;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.BasicServices.DAM;
import static com.dnastack.ddap.common.security.UserTokenCookiePackager.BasicServices.IC;

/**
 * Remove this once the hydra upgrade is complete. Has bizarre cookie names that make login work while we transition
 * away from old login endpoints.
 */
@Primary
@Component
public class WorkaroundLoginService extends IdpLoginService {
    public WorkaroundLoginService(UserTokenCookiePackager cookiePackager, ReactiveIdpOAuthClient oAuthClient) {
        super(cookiePackager, oAuthClient);
    }

    @Override
    protected UserTokenCookiePackager.CookieName idTokenName() {
        return DAM.cookieName(UserTokenCookiePackager.TokenKind.ACCESS);
    }

    @Override
    protected UserTokenCookiePackager.CookieName accessTokenName() {
        return IC.cookieName(UserTokenCookiePackager.TokenKind.ACCESS);
    }
}
