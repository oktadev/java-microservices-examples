package com.example.carservice;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.Month;
import java.util.Map;
import java.util.UUID;
import java.util.function.Consumer;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {"spring.cloud.discovery.enabled = false"})
public class CarServiceApplicationTests {

    @Autowired
    CarRepository carRepository;

    @Autowired
    WebTestClient webTestClient;

    @MockBean
    ReactiveJwtDecoder jwtDecoder;

    @Test
    public void testAddCar() {
        Car buggy = new Car(UUID.randomUUID(), "ID. BUGGY", LocalDate.of(2022, Month.DECEMBER, 1));

        Jwt jwt = jwt();
        when(this.jwtDecoder.decode(anyString())).thenReturn(Mono.just(jwt));

        webTestClient.post().uri("/cars")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .accept(MediaType.APPLICATION_JSON_UTF8)
                .headers(addJwt(jwt))
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
                .uri("/cars/{id}", Map.of("id", buzzCargo.getId()))
                .headers(addJwt(jwt))
                .exchange()
                .expectStatus().isOk();
    }

    private Jwt jwt() {
        return new Jwt("token", null, null,
                Map.of("alg", "none"), Map.of("sub", "dave"));
    }

    private Consumer<HttpHeaders> addJwt(Jwt jwt) {
        return headers -> headers.setBearerAuth(jwt.getTokenValue());
    }
}
