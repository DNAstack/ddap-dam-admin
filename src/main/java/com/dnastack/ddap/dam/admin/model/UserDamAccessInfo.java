package com.dnastack.ddap.dam.admin.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDamAccessInfo {

    private Map<String, String> ui;
    private Boolean accessible;

}
