package com.dnastack.ddap.dam.admin.controller;

import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.common.security.UserTokenCookiePackager.CookieName;
import com.dnastack.ddap.common.security.UserTokenCookiePackager.TokenKind;
import com.dnastack.ddap.dam.admin.client.ReactiveAdminDamClient;
import common.Common;
import dam.v1.DamService;
import dam.v1.DamService.DamConfig;
import dam.v1.DamService.Policy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.stream.Stream;

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.BasicServices.DAM;
import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.toList;

@Slf4j
@RestController
@RequestMapping("/api/v1alpha/realm/{realm}/dam/autocomplete")
public class AutoCompleteController {

    private UserTokenCookiePackager cookiePackager;
    private ReactiveAdminDamClient damClient;

    @Autowired
    public AutoCompleteController(UserTokenCookiePackager cookiePackager,
                                  ReactiveAdminDamClient damClient) {
        this.cookiePackager = cookiePackager;
        this.damClient = damClient;
    }

    @GetMapping("/claim-value")
    public Mono<Set<String>> getClaimValues(ServerHttpRequest request,
                                            @PathVariable String realm,
                                            @RequestParam String claimName) {
        Set<String> result = new TreeSet<>();

        Map<CookieName, UserTokenCookiePackager.CookieValue> tokens = cookiePackager.extractRequiredTokens(request, Set.of(DAM.cookieName(TokenKind.ACCESS), DAM.cookieName(TokenKind.REFRESH)));

        return damClient.getConfig(realm, tokens.get(DAM.cookieName(TokenKind.ACCESS)).getClearText(), tokens.get(DAM.cookieName(TokenKind.REFRESH)).getClearText())
            .flatMap((damConfig) -> {
                Map<String, Policy> policies = damConfig.getPoliciesMap();
                for (Map.Entry<String, Policy> policyEntry : policies.entrySet()) {
                    List<Common.Condition> conditions = getAllConditionsFromPolicy(policyEntry.getValue());
                    result.addAll(getAllContainedValuesFromConditions(conditions, claimName, damConfig));
                }
                return Mono.just(result);
            });
    }

    private List<Common.Condition> getAllConditionsFromPolicy(Policy policy) {
        return policy.getAnyOfList().stream()
            .map(Common.ConditionSet::getAllOfList)
            .flatMap(Collection::stream)
            .collect(toList());
    }

    private List<String> getAllContainedValuesFromConditions(List<Common.Condition> conditions,
                                                             String claimName,
                                                             DamService.DamConfig damConfig) {
        return conditions.stream()
            .map(condition -> getAllContainedValues(claimName, condition, damConfig))
            .flatMap(Collection::stream)
            .map(this::stripPrefix)
            .flatMap(Collection::stream)
            .collect(toList());
    }

    private List<String> getAllContainedValues(String claimName,
                                               Common.Condition condition,
                                               DamService.DamConfig damConfig) {
        if (Objects.equals(claimName, condition.getType())) {
            return getParsedVariableValues(condition.getValue(), damConfig);
        }

        return Collections.emptyList();
    }

    private List<String> getParsedVariableValues(String valueOrVariable, DamService.DamConfig damConfig) {
        boolean isVariable = valueOrVariable.contains("${");
        if (isVariable) {
            //variableName is: "${DATASETS}" cleaned up to "DATASETS"
            String variableName = valueOrVariable.substring(valueOrVariable.indexOf("{")+1, valueOrVariable.indexOf("}"));
            return getPoliciesInResourceViews(damConfig)
                //replacing variable in values with the actual values
                .flatMap(policyValueString ->
                    Stream.of(valueOrVariable.replace("${"+ variableName + "}",
                            policyValueString.getOrDefault(variableName, "${" + variableName + "}"))))
                    .collect(toList());
        } else if (!isRegexValue(valueOrVariable)) {
            return singletonList(valueOrVariable);
        } else {
            return Collections.emptyList();
        }
    }

    private Stream<Map<String, String>> getPoliciesInResourceViews(DamConfig damConfig) {
        return damConfig.getResourcesMap().values().stream()
            .flatMap(res -> res.getViewsMap().values().stream())
            .flatMap(view -> view.getRolesMap().values().stream())
            .flatMap(accessRole -> accessRole.getPoliciesList().stream())
            .map(DamService.ViewRole.ViewPolicy::getArgsMap);
    }

    private boolean isRegexValue(String assignmentValue) {
        return assignmentValue.startsWith("^") && assignmentValue.endsWith("$");
    }

    private List<String> stripPrefix(String value) {
        return Stream.of("const:", "pattern:", "split_pattern:")
            .filter(value::startsWith)
            .map((prefix) -> {
                if (!prefix.equals("split_pattern:")) {
                    return singletonList(value.replaceFirst(prefix, ""));
                }
                String splitPatters = value.replaceFirst(prefix, "");
                return asList(splitPatters.split(";"));
            })
            .flatMap(Collection::stream)
            .collect(toList());
    }

}
