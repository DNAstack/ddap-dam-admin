package com.dnastack.ddap;

import com.dnastack.ddap.ic.common.config.IdpProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@EnableConfigurationProperties({IdpProperties.class})
public class DdapDamAdminApplication {

	public static void main(String[] args) {
		SpringApplication.run(DdapDamAdminApplication.class, args);
	}

}

