package com.example.carservice;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.Month;
import java.util.Collections;
import java.util.UUID;

import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.springSecurity;
import static org.springframework.web.reactive.function.client.ExchangeFilterFunctions.basicAuthentication;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class CarServiceApplicationTests {

    @Autowired
    ApplicationContext context;

    @Autowired
    CarRepository carRepository;

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
    @WithMockUser
    public void testAddCar() {
        Car buggy = new Car(UUID.randomUUID(), "ID. BUGGY", LocalDate.of(2022, Month.DECEMBER, 1));

        webTestClient.post().uri("/cars")
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
    @WithMockUser
    public void testGetAllCars() {
        webTestClient.get().uri("/cars")
                .accept(MediaType.APPLICATION_JSON_UTF8)
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
                .expectBodyList(Car.class);
    }

    @Test
    @WithMockUser
    public void testDeleteCar() {
        Car buzzCargo = carRepository.save(new Car(UUID.randomUUID(), "ID. BUZZ CARGO",
                LocalDate.of(2022, Month.DECEMBER, 2))).block();

        webTestClient.delete()
                .uri("/cars/{id}", Collections.singletonMap("id", buzzCargo.getId()))
                .exchange()
                .expectStatus().isOk();
    }
}
