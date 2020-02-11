package com.dnastack.ddap.dam.admin.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Data
@ConfigurationProperties("ddap")
public class DdapConfig {

    private List<UserWhitelist> whitelists;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserWhitelist {
        private String name;
        private List<User> users;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class User {
        private String email;
    }
}
