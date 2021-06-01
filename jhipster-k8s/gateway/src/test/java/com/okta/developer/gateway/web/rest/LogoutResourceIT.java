package com.okta.developer.gateway.web.rest;

import static com.okta.developer.gateway.web.rest.TestUtil.ID_TOKEN;
import static com.okta.developer.gateway.web.rest.TestUtil.authenticationToken;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.*;

import com.okta.developer.gateway.IntegrationTest;
import com.okta.developer.gateway.config.TestSecurityConfiguration;
import com.okta.developer.gateway.security.AuthoritiesConstants;
import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link LogoutResource} REST controller.
 */
@IntegrationTest
class LogoutResourceIT {

    @Autowired
    private ReactiveClientRegistrationRepository registrations;

    @Autowired
    private ApplicationContext context;

    private WebTestClient webTestClient;

    private OidcIdToken idToken;

    @BeforeEach
    public void before() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("groups", Collections.singletonList(AuthoritiesConstants.USER));
        claims.put("sub", 123);
        this.idToken = new OidcIdToken(ID_TOKEN, Instant.now(), Instant.now().plusSeconds(60), claims);

        this.webTestClient = WebTestClient.bindToApplicationContext(this.context).apply(springSecurity()).configureClient().build();
    }

    @Test
    void getLogoutInformation() {
        String logoutUrl =
            this.registrations.findByRegistrationId("oidc")
                .map(oidc -> oidc.getProviderDetails().getConfigurationMetadata().get("end_session_endpoint").toString())
                .block();

        this.webTestClient.mutateWith(csrf())
            .mutateWith(mockAuthentication(TestUtil.authenticationToken(idToken)))
            .post()
            .uri("/api/logout")
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .expectBody()
            .jsonPath("$.logoutUrl")
            .isEqualTo(logoutUrl.toString())
            .jsonPath("$.idToken")
            .isEqualTo(ID_TOKEN);
    }
}
