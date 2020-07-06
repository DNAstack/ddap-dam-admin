package com.dnastack.ddap.dam.account.service;

import org.springframework.stereotype.Component;
import tokens.v1.TokensOuterClass;

import java.util.ArrayList;
import java.util.List;

@Component
public class TokensExperimentalFeaturesService {

    public TokensOuterClass.ListTokensResponse addResourcesIfNotExist(TokensOuterClass.ListTokensResponse tokensResponse) {
        List<TokensOuterClass.Token> tokens = new ArrayList<>();
        tokensResponse.getTokensList().forEach((token) -> {
            // If there isn't resources property or is empty add mocked up data otherwise return non-modified value
            if (token.getResourcesList() == null || token.getResourcesList().isEmpty()) {
                tokens.add(TokensOuterClass.Token.newBuilder()
                    .mergeFrom(token)
                    .addResources("aaa")
                    .addResources("bbb")
                    .build());
            } else {
                tokens.add(token);
            }
        });

        return TokensOuterClass.ListTokensResponse.newBuilder()
            .addAllTokens(tokens)
            .build();
    }

}
