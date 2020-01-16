package com.dnastack.ddap.dam.admin.controller;

import com.dnastack.ddap.common.security.UserTokenCookiePackager;
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

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.CookieKind;
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

    //Reading the realm config
    //Iterate through realm config policies and find all the values in policies
    @GetMapping("/claim-value")
    public Mono<Set<String>> getClaimValues(ServerHttpRequest request,
                                             @PathVariable String realm,
                                             @RequestParam String claimName) {
        Set<String> result = new TreeSet<>();

        // find beacons under resourceId in DAM config
        Map<CookieKind, UserTokenCookiePackager.CookieValue> tokens = cookiePackager.extractRequiredTokens(request, Set.of(CookieKind.DAM, CookieKind.REFRESH));

        return damClient.getConfig(realm, tokens.get(CookieKind.DAM).getClearText(), tokens.get(CookieKind.REFRESH).getClearText())
            .flatMap((damConfig) -> {
                Map<String, Policy> policies = damConfig.getPoliciesMap();
                for (Map.Entry<String, Policy> policyEntry : policies.entrySet()) {
                    List<Common.Condition> conditions = getAllConditionsFromPolicy(policyEntry.getValue());
                    result.addAll(getAllContainedValuesFromConditions(conditions, claimName, damConfig, policyEntry.getKey()));
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
                                                             DamService.DamConfig damConfig,
                                                             String policyName) {
        return conditions.stream()
            .map(condition -> getAllContainedValues(claimName, condition, damConfig, policyName))
            .flatMap(Collection::stream)
            .map(this::stripPrefix)
            .flatMap(Collection::stream)
            .collect(toList());
    }

    private List<String> getAllContainedValues(String claimName,
                                               Common.Condition condition,
                                               DamService.DamConfig damConfig,
                                               String policyName) {
        if (Objects.equals(claimName, condition.getType())) {
            return getParsedVariableValues(condition.getValue(), policyName, damConfig);
        }

        return Collections.emptyList();
    }

    private List<String> getParsedVariableValues(String valueOrVariable, String policyName, DamService.DamConfig damConfig) {
        boolean isVariable = valueOrVariable.startsWith("${") && valueOrVariable.endsWith("}");
        if (isVariable) {
            //variableName is: "${DATASETS}" cleaned up to "DATASETS"
            String variableName = valueOrVariable.substring(2, valueOrVariable.length() - 1);
            return getPoliciesInResourceViews(damConfig)
                //Filter would match something like: variablePolicy(VAR1=value1,value2;VAR2=value3,value4)
                .filter(resourcePolicyName -> resourcePolicyName.startsWith(policyName + "(") && resourcePolicyName
                    .endsWith(")"))
                .flatMap(policyValueString -> {
                    List<String> assignmentList = asList(policyValueString.substring(policyName.length() + 1, policyValueString.length() - 1)
                            .split(";"));

                    return getValuesForVariable(variableName, assignmentList)
                        .filter(assignmentValue -> !isRegexValue(assignmentValue));
                }).collect(toList());
        } else if (!isRegexValue(valueOrVariable)) {
            return singletonList(valueOrVariable);
        } else {
            return Collections.emptyList();
        }
    }

    //Gets something like: DATASETS=^https?://dac\.nih\.gov/datasets/phs000710$,https://dac.nih.gov/datasets/phs000711,https://dac.nih.gov/datasets/phs000712
    //Returns the RHS split by comma something like: ^https?://dac\.nih\.gov/datasets/phs000710$, https://dac.nih.gov/datasets/phs000711, https://dac.nih.gov/datasets/phs000712
    private Stream<String> getValuesForVariable(String variableName, List<String> assignmentList) {
        return assignmentList.stream()
            .filter(assignment -> {
                String[] assignmentParts = assignment.split("=");
                return assignmentParts[0].equals(variableName);
            })
            .map(variableAssignmentChunk -> {
                String[] variableAssignment = variableAssignmentChunk.split("=");
                return variableAssignment[1];
            })
            .flatMap(rhsAssignment -> Arrays.stream(rhsAssignment.split(",")));
    }

    private Stream<String> getPoliciesInResourceViews(DamConfig damConfig) {
        return damConfig.getResourcesMap().values().stream()
            .flatMap(res -> res.getViewsMap().values().stream())
            .flatMap(view -> view.getAccessRolesMap().values().stream())
            .flatMap(accessRole -> accessRole.getPoliciesList().stream())
            .map(DamService.AccessRole.AccessPolicy::getName);
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
