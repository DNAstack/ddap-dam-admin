package com.dnastack.ddap.dam.admin.controller;

import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.common.security.UserTokenCookiePackager.CookieName;
import com.dnastack.ddap.common.security.UserTokenCookiePackager.TokenKind;
import com.dnastack.ddap.dam.admin.client.ReactiveAdminDamClient;
import dam.v1.DamService;
import dam.v1.DamService.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Set;

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.BasicServices.DAM;
import static java.lang.String.format;

@RestController
@RequestMapping(value = "/api/v1alpha/realm/{realm}/dam/service-templates")
public class ServiceTemplateController {

    private UserTokenCookiePackager cookiePackager;
    private ReactiveAdminDamClient damClient;

    @Autowired
    public ServiceTemplateController(UserTokenCookiePackager cookiePackager,
                                     ReactiveAdminDamClient damClient) {
        this.cookiePackager = cookiePackager;
        this.damClient = damClient;
    }

    @GetMapping(value = "/{serviceTemplateId}/variables")
    public Mono<Map<String, VariableFormat>> resolveVariables(ServerHttpRequest request,
                                                              @PathVariable String realm,
                                                              @PathVariable String serviceTemplateId) {
        Map<CookieName, UserTokenCookiePackager.CookieValue> tokens = cookiePackager.extractRequiredTokens(request, Set.of(DAM.cookieName(TokenKind.ACCESS), DAM.cookieName(TokenKind.REFRESH)));
        return getServiceTemplate(damClient, realm, tokens, serviceTemplateId)
            .flatMap(serviceTemplate -> getItemFormatForServiceTemplate(damClient, realm, tokens, serviceTemplate)
                .map(ItemFormat::getVariablesMap));
    }

    private Mono<ServiceTemplate> getServiceTemplate(ReactiveAdminDamClient damClient,
                                                     String realm,
                                                     Map<CookieName, UserTokenCookiePackager.CookieValue> tokens,
                                                     String serviceTemplateId) {
        return damClient.getConfig(realm, tokens.get(DAM.cookieName(TokenKind.ACCESS)).getClearText(), tokens.get(DAM.cookieName(TokenKind.REFRESH)).getClearText())
            .map(DamService.DamConfig::getServiceTemplatesMap)
            .map(serviceTemplates -> {
                if (!serviceTemplates.containsKey(serviceTemplateId)) {
                    throw new IllegalArgumentException(format("Unrecognized serviceTemplate id [%s]", serviceTemplateId));
                }
                return serviceTemplates.get(serviceTemplateId);
            });
    }

    private Mono<ItemFormat> getItemFormatForServiceTemplate(ReactiveAdminDamClient damClient,
                                                             String realm,
                                                             Map<CookieName, UserTokenCookiePackager.CookieValue> tokens,
                                                             ServiceTemplate serviceTemplate) {
        String targetAdapterId = serviceTemplate.getTargetAdapter();
        String itemFormatId = serviceTemplate.getItemFormat();

        return damClient.getTargetAdapters(realm, tokens.get(DAM.cookieName(TokenKind.ACCESS)).getClearText(), tokens.get(DAM.cookieName(TokenKind.REFRESH)).getClearText())
            .map(targetAdaptersResponse -> {
                TargetAdapter targetAdapter = getDamTargetAdapter(targetAdapterId, targetAdaptersResponse);
                return getDamItemFormat(targetAdapterId, itemFormatId, targetAdapter);
            });
    }

    private ItemFormat getDamItemFormat(String targetAdapterId, String itemFormatId, TargetAdapter targetAdapter) {
        ItemFormat itemFormat = targetAdapter.getItemFormatsMap().get(itemFormatId);
        if (itemFormat == null) {
            throw new IllegalStateException(format(
                "Could not find itemFormat [%s] in targetAdapter [%s] referenced from service template",
                itemFormatId,
                targetAdapterId));
        }
        return itemFormat;
    }

    private TargetAdapter getDamTargetAdapter(String targetAdapterId, TargetAdaptersResponse targetAdaptersResponse) {
        TargetAdapter targetAdapter = targetAdaptersResponse.getTargetAdaptersMap().get(targetAdapterId);
        if (targetAdapter == null) {
            throw new IllegalStateException(format(
                "Could not find targetAdapter [%s] referenced from service template",
                targetAdapterId));
        }
        return targetAdapter;
    }

}
