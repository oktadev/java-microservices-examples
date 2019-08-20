package com.example.carservice;

import java.time.LocalDate;
import java.time.Month;
import java.util.Collections;
import java.util.UUID;
import java.util.function.Consumer;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import reactor.core.publisher.Mono;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.springSecurity;
import static org.springframework.web.reactive.function.client.ExchangeFilterFunctions.basicAuthentication;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class CarServiceApplicationTests {

    @Autowired
    ApplicationContext context;

    @Autowired
    CarRepository carRepository;

    @MockBean
    ReactiveJwtDecoder jwtDecoder;

    WebTestClient webTestClient;

    @Before
    public void setup() {
        this.webTestClient = WebTestClient
                .bindToApplicationContext(this.context)
                .apply(springSecurity())
                .configureClient()
                .filter(basicAuthentication())
                .build();
    }

    @Test
    public void testAddCar() {
        Car buggy = new Car(UUID.randomUUID(), "ID. BUGGY", LocalDate.of(2022, Month.DECEMBER, 1));

        Jwt jwt = jwt();
        when(this.jwtDecoder.decode(anyString())).thenReturn(Mono.just(jwt));
        webTestClient.post().uri("/cars")
                .headers(addJwt(jwt))
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .accept(MediaType.APPLICATION_JSON_UTF8)
                .body(Mono.just(buggy), Car.class)
                .exchange()
                .expectStatus().isCreated()
                .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
                .expectBody()
                .jsonPath("$.id").isNotEmpty()
                .jsonPath("$.name").isEqualTo("ID. BUGGY");
    }

    @Test
    public void testGetAllCars() {
        Jwt jwt = jwt();
        when(this.jwtDecoder.decode(anyString())).thenReturn(Mono.just(jwt));
        webTestClient.get().uri("/cars")
                .accept(MediaType.APPLICATION_JSON_UTF8)
                .headers(addJwt(jwt))
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
                .expectBodyList(Car.class);
    }

    @Test
    public void testDeleteCar() {
        Car buzzCargo = carRepository.save(new Car(UUID.randomUUID(), "ID. BUZZ CARGO",
                LocalDate.of(2022, Month.DECEMBER, 2))).block();

        Jwt jwt = jwt();
        when(this.jwtDecoder.decode(anyString())).thenReturn(Mono.just(jwt));
        webTestClient.delete()
                .uri("/cars/{id}", Collections.singletonMap("id", buzzCargo.getId()))
                .headers(addJwt(jwt))
                .exchange()
                .expectStatus().isOk();
    }


    private Jwt jwt() {
        return new Jwt("token", null, null,
                Collections.singletonMap("alg", "none"), Collections.singletonMap("sub", "dave"));
    }

    private Consumer<HttpHeaders> addJwt(Jwt jwt) {
        return headers -> headers.setBearerAuth(jwt.getTokenValue());
    }
}
